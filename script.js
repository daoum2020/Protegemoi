
document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
const toggle = document.querySelector('.menu-toggle');
if(toggle){
  toggle.addEventListener('click', function () {
    const links = document.getElementById('nav-links');
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', (!expanded).toString());
    links.classList.toggle('open');
  });
}
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
