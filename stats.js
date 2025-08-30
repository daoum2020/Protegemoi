const KEY='PM_USER_CONFIG'
function readCfg(){ try{ return JSON.parse(localStorage.getItem(KEY)||'null') }catch{ return null } }
function fmtDate(ts){ const d=new Date(ts); const p=n=>(''+n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}` }
function set(el, v){ document.getElementById(el).textContent = v }

function setHeaderInfo(rangeText, parentName, parentId){ 
  const p = document.getElementById('hPeriod'); if(p) p.textContent = rangeText||''
  const n = document.getElementById('hParentName'); if(n) n.textContent = parentName||'—'
  const i = document.getElementById('hParentId'); if(i) i.textContent = parentId||'—'
}

async function compute(){
  const cfg = readCfg()
  const out = document.getElementById('statsStatus')
  const parentId = document.getElementById('parentIdStats').value.trim()
  const range = document.getElementById('range').value
  const from = document.getElementById('from').value
  const to = document.getElementById('to').value
  if(!cfg||!cfg.apiKey||!cfg.projectId||!cfg.appId){ out.innerHTML='<span class="danger">Config manquante (Paramètres).</span>'; return }
  if(!parentId){ out.innerHTML='<span class="danger">parentId requis.</span>'; return }

  // compute date range
  let start, end
  const now = new Date()
  if(range==='custom'){
    if(!from||!to){ out.innerHTML='<span class="danger">Dates requises.</span>'; return }
    start = new Date(from+'T00:00:00').getTime()
    end = new Date(to+'T23:59:59').getTime()
  }else{
    const days = parseInt(range,10)
    end = now.getTime()
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() - (days-1)*24*3600*1000
  }

  try{
    const [{ initializeApp }, { getFirestore, collection, query, where, orderBy, getDocs, limit }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js')
    ])
    const app = initializeApp({ apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, appId: cfg.appId }, 'pm-stats')
    const db = getFirestore(app)

    // Query alerts in range
    const col = collection(db, 'parents', parentId, 'alerts')
    const q = query(col, where('createdAt','>=', start), where('createdAt','<=', end), orderBy('createdAt','desc'))
    const snap = await getDocs(q)
    const items = snap.docs.map(d=>({ id:d.id, ...(d.data()||{}) }))

    buildAdvancedStats(items)

    // Summary
    const total = items.length
    const dayCount = Math.max(1, Math.ceil((end - start) / (24*3600*1000)))
    const perDayAvg = (total/dayCount).toFixed(2)
    const children = new Set(items.map(x=>x.childId||'inconnu'))
    set('mTotal', total); set('mPerDay', perDayAvg); set('mChildren', children.size)
    document.getElementById('mRange').textContent = `Période: ${new Date(start).toLocaleDateString()} → ${new Date(end).toLocaleDateString()}`

    // Per child
    const byChild = {}
    for(const it of items){ const c = it.childId||'inconnu'; byChild[c]=(byChild[c]||0)+1 }
    const byChildEl = document.getElementById('byChild'); byChildEl.innerHTML=''
    Object.entries(byChild).sort((a,b)=>b[1]-a[1]).forEach(([child, n])=>{
      const div = document.createElement('div')
      div.textContent = `• ${child}: ${n}`
      byChildEl.appendChild(div)
    })

    // Per day bars
    const perDay = {}
    for(let t=start; t<=end; t+=24*3600*1000){ const d = new Date(t); const key = d.toISOString().slice(0,10); perDay[key]=0 }
    items.forEach(it=>{ const key=new Date(it.createdAt).toISOString().slice(0,10); if(perDay[key]!=null) perDay[key]++ })
    const max = Math.max(1, ...Object.values(perDay))
    const bars = document.getElementById('perDayBars'); bars.innerHTML=''
    Object.entries(perDay).forEach(([day, n])=>{
      const wrap = document.createElement('div')
      const bar = document.createElement('div'); bar.className='bar'; bar.style.width = '100%'
      const fill = document.createElement('div'); fill.style.height='100%'; fill.style.width = (n/max*100)+'%'; fill.style.background='#0ea5e9'; fill.style.borderRadius='8px'
      const label = document.createElement('span'); label.textContent = `${day} — ${n}`
      bar.appendChild(fill); bar.appendChild(label); wrap.appendChild(bar); bars.appendChild(wrap)
    })

    // Recent table (limit 20)
    const tbody = document.querySelector('#recentTbl tbody'); tbody.innerHTML=''
    items.slice(0,20).forEach(it=>{
      const tr = document.createElement('tr')
      tr.innerHTML = `<td>${fmtDate(it.createdAt||0)}</td><td>${it.childId||''}</td><td>${(it.text||'').replace(/</g,'&lt;')}</td>`
      tbody.appendChild(tr)
    })

    out.innerHTML = '<span class="ok">Stats prêtes ✓</span>'
  }catch(e){
    console.error(e); out.innerHTML = '<span class="danger">Erreur stats: ' + (e?.message||e) + '</span>'
  }
}

document.getElementById('computeBtn').addEventListener('click', compute)


function buildBars(containerId, entries, labelFmt){
  const el = document.getElementById(containerId); el.innerHTML=''
  const max = Math.max(1, ...entries.map(([,n])=>n))
  entries.forEach(([label, n])=>{
    const wrap = document.createElement('div')
    const bar = document.createElement('div'); bar.className='bar'; bar.style.width='100%'
    const fill = document.createElement('div'); fill.style.height='100%'; fill.style.width=(n/max*100)+'%'; fill.style.background='#0ea5e9'; fill.style.borderRadius='8px'
    const span = document.createElement('span'); span.textContent = `${labelFmt(label)} — ${n}`
    bar.appendChild(fill); bar.appendChild(span); wrap.appendChild(bar); el.appendChild(wrap)
  })
}

function weekdayName(i){
  // 0=Dimanche ... 6=Samedi (JS)
  const fr = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']; return fr[i]||String(i)
}

function buildHeatmap(counts){
  const grid = document.getElementById('heatmap'); grid.innerHTML=''
  // header row
  const headerBlank = document.createElement('div'); headerBlank.textContent=''; grid.appendChild(headerBlank)
  for(let h=0; h<24; h++){ const d=document.createElement('div'); d.className='muted'; d.style.textAlign='center'; d.textContent=String(h).padStart(2,'0'); grid.appendChild(d) }
  // rows by weekday (Mon..Sun for readability): we'll map Monday-first (1..6,0)
  const order = [1,2,3,4,5,6,0]
  const labels = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
  const max = Math.max(1, ...Object.values(counts).flatMap(row=>Object.values(row)))
  order.forEach((wd, idx)=>{
    const rowLabel = document.createElement('div'); rowLabel.textContent = labels[idx]; rowLabel.className='muted'; grid.appendChild(rowLabel)
    for(let h=0; h<24; h++){
      const v = (counts[wd] && counts[wd][h]) || 0
      const cell = document.createElement('div')
      const intensity = v/max // 0..1
      // simple blue scale
      const alpha = 0.15 + 0.85*intensity
      cell.style.background = `rgba(14,165,233,${alpha})`
      cell.style.height = '20px'
      cell.style.borderRadius = '4px'
      cell.title = `${labels[idx]} ${String(h).padStart(2,'0')}h — ${v}`
      grid.appendChild(cell)
    }
  })
}

function buildAdvancedStats(items){
  // items: array with createdAt, childId, text
  const byHour = new Array(24).fill(0)
  const byWeekday = new Array(7).fill(0) // JS: 0=Sun
  const heat = {}
  for(const it of items){
    const t = new Date(it.createdAt||0)
    const h = t.getHours()
    const w = t.getDay()
    byHour[h]++
    byWeekday[w]++
    if(!heat[w]) heat[w] = {}
    heat[w][h] = (heat[w][h]||0)+1
  }
  const topHours = byHour.map((n,i)=>[i,n]).sort((a,b)=>b[1]-a[1])
  const topWeekdays = byWeekday.map((n,i)=>[i,n]).sort((a,b)=>b[1]-a[1])

  buildBars('topHours', topHours, (h)=>String(h).padStart(2,'0')+':00')
  buildBars('topWeekdays', topWeekdays, (w)=>weekdayName(w))
  buildHeatmap(heat)
}


document.getElementById('exportPdfBtn').addEventListener('click', ()=>{
  // Simple browser print-to-PDF
  document.getElementById('hExportDate').textContent = new Date().toLocaleString(); window.print()
})
