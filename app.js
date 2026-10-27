document.querySelector('#year').textContent = new Date().getFullYear();
const dialog = document.querySelector('.video-dialog');
if (dialog) {
const player = document.querySelector('#video-player');
let lastTrigger;
document.querySelectorAll('[data-video]').forEach(button => button.addEventListener('click', () => {
  lastTrigger = button;
  const frame = document.createElement('iframe');
  const url = new URL('https://www.youtube.com/embed/' + button.dataset.video);
  url.searchParams.set('autoplay', '1');
  url.searchParams.set('playsinline', '1');
  if (location.protocol.startsWith('http')) url.searchParams.set('origin', location.origin);
  frame.src = url.href;
  frame.title = button.dataset.title;
  frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  player.replaceChildren(frame);
  document.querySelector('.video-fallback').href = 'https://www.youtube.com/watch?v=' + button.dataset.video;
  dialog.showModal();
}));
document.querySelector('.close-video').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if(event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
});
dialog.addEventListener('close', () => { player.replaceChildren(); lastTrigger?.focus(); });

}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motionToggle = document.querySelector('.motion-toggle');
let userPaused = false;
function applyMotion() {
  const paused = userPaused || reducedMotion.matches;
  document.documentElement.classList.toggle('motion-paused', paused);
  if (motionToggle) { motionToggle.setAttribute('aria-pressed', String(paused)); motionToggle.textContent = paused ? 'Ativar animações ▷' : 'Pausar animações Ⅱ'; }
  if (paused) document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));
}
motionToggle?.addEventListener('click', () => { if(reducedMotion.matches) return; userPaused = !userPaused; applyMotion(); });
reducedMotion.addEventListener('change', applyMotion);
applyMotion();
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), {threshold:0.08});
  document.querySelectorAll('.section-heading>div,.section-heading>p,.instagram-copy,.manifesto>p,.booking h2,.booking p,.release-intro h1,.release-body>p,.release-body>h2,.gallery-item').forEach((element,i) => { element.classList.add('reveal'); element.style.setProperty('--reveal-delay', (element.matches('.gallery-item') ? i%3*65 : 0)+'ms'); observer.observe(element); });
}
const photoDialog = document.querySelector('.photo-dialog');
if (photoDialog) {
  const items = [...document.querySelectorAll('[data-photo]')];
  const expanded = document.querySelector('#expanded-photo');
  let current = 0, returnFocus;
  function showPhoto(index) {
    current = (index+items.length)%items.length;
    const img = items[current].querySelector('img');
    expanded.src = items[current].href;
    expanded.alt = img.alt;
    document.querySelector('#photo-caption').textContent = img.alt;
    document.querySelector('#photo-count').textContent = (current+1)+' / '+items.length;
  }
  items.forEach((item,index) => item.addEventListener('click', event => { event.preventDefault(); returnFocus=item; showPhoto(index); photoDialog.showModal(); document.body.classList.add('photo-open'); }));
  document.querySelector('.photo-close').addEventListener('click',()=>photoDialog.close());
  document.querySelector('.photo-prev').addEventListener('click',()=>showPhoto(current-1));
  document.querySelector('.photo-next').addEventListener('click',()=>showPhoto(current+1));
  photoDialog.addEventListener('keydown',event=>{ if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(current-1)} if(event.key==='ArrowRight'){event.preventDefault();showPhoto(current+1)} });
  photoDialog.addEventListener('close',()=>{document.body.classList.remove('photo-open');expanded.removeAttribute('src');returnFocus?.focus()});
  photoDialog.addEventListener('click',event=>{if(event.target===photoDialog)photoDialog.close()});
  let touchX;
  expanded.addEventListener('touchstart',event=>{touchX=event.changedTouches[0].clientX},{passive:true});
  expanded.addEventListener('touchend',event=>{const delta=event.changedTouches[0].clientX-touchX;if(Math.abs(delta)>55)showPhoto(current+(delta<0?1:-1))},{passive:true});
}
