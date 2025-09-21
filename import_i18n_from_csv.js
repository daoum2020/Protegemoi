#!/usr/bin/env node
/**
 * Import translations from a CSV file into JSON language files.
 * CSV must have columns: key, fr, en, es, ar, zh
 * Usage:
 *   node tools/import_i18n_from_csv.js path/to/protegemoi_i18n_keys.csv
 */
const fs = require('fs');
const path = require('path');

function parseCSV(content){
  const [headerLine, ...lines] = content.split(/\r?\n/).filter(Boolean);
  const headers = headerLine.split(',').map(h => h.trim());
  return lines.map(line => {
    // naive CSV split; ok for simple content without commas in fields
    const cells = line.split(',').map(c => c.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = cells[i] || '');
    return obj;
  });
}

function main(csvPath){
  if(!fs.existsSync(csvPath)){
    console.error('[Error] CSV not found:', csvPath);
    process.exit(1);
  }
  const projectRoot = path.resolve(__dirname, '..');
  const i18nDir = path.join(projectRoot, 'assets', 'i18n');
  const langs = ['fr','en','es','ar','zh'];

  const dicts = {};
  langs.forEach(lang => {
    const f = path.join(i18nDir, `${lang}.json`);
    try{
      dicts[lang] = JSON.parse(fs.readFileSync(f, 'utf8'));
    }catch{
      dicts[lang] = {};
    }
  });

  const csv = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCSV(csv);
  const required = ['key','fr','en','es','ar','zh'];
  if(!required.every(k => rows.length === 0 || Object.keys(rows[0]).includes(k))){
    console.error('[Error] CSV must include columns:', required.join(', '));
    process.exit(1);
  }
  let count = 0;
  rows.forEach(row => {
    const key = (row.key || '').trim();
    if(!key) return;
    langs.forEach(lang => {
      dicts[lang][key] = (row[lang] || '');
    });
    count++;
  });

  langs.forEach(lang => {
    const out = path.join(i18nDir, `${lang}.json`);
    fs.writeFileSync(out, JSON.stringify(dicts[lang], null, 2), 'utf8');
  });

  console.log(`[OK] Imported translations for ${count} keys into ${i18nDir}`);
}

if(require.main === module){
  const csvPath = process.argv[2];
  if(!csvPath){
    console.log('Usage: node tools/import_i18n_from_csv.js path/to/protegemoi_i18n_keys.csv');
    process.exit(1);
  }
  main(csvPath);
}
