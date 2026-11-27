
const S=[...document.querySelectorAll('.slide')],stage=document.getElementById('stage'),notes=document.getElementById('notes');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let i=Math.min(Math.max(parseInt(location.hash.slice(1))||1,1),S.length)-1;
document.getElementById('bar').innerHTML=S.map((s,j)=>`<i data-n="${j}"></i>`).join('');
const W=stage.offsetWidth,H=stage.offsetHeight;
function fit(){const k=Math.min(innerWidth/W,innerHeight/H);stage.style.transform=`scale(${k}) translate(-50%,-50%)`;}

/* table rows rise one after another; big numbers count up */
S.forEach(s=>{
  s.querySelectorAll('[data-a=table] tr').forEach((tr,j)=>tr.style.animationDelay=`calc(var(--t) + ${Math.min(j,14)*55}ms)`);
  s.querySelectorAll('.tx span').forEach(sp=>{const t=sp.textContent.trim(),m=t.match(/^(\d[\d,]*)(\.\d+)?(%?)$/);
    if(m&&parseFloat(sp.style.fontSize)>=44){sp.dataset.count=t;}});
});
function countUp(s){s.querySelectorAll('[data-count]').forEach(el=>{
  const end=el.dataset.count,m=end.match(/^(\d[\d,]*)(\.\d+)?(%?)$/),target=parseFloat(m[1].replace(/,/g,'')+(m[2]||'')),dec=m[2]?m[2].length-1:0,comma=m[1].includes(',');
  const host=el.closest('[data-a]'),delay=host?parseFloat(getComputedStyle(host).animationDelay)*1000||0:0;
  const f=v=>{let x=v.toFixed(dec);if(comma)x=Number(x).toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec});return x+m[3]};
  el.textContent=f(0);setTimeout(()=>{const t0=performance.now();const step=t=>{const p=Math.min(1,(t-t0)/1000);
    el.textContent=f(target*(1-Math.pow(1-p,3)));if(p<1&&S[i]===s)requestAnimationFrame(step);else el.textContent=end;};requestAnimationFrame(step);},delay+150);});}

/* click steps: PowerPoint "On Click" animations become steps of the page's player.
   ← → change page only · ↓ ↑ next/previous step · Space plays/pauses the steps · every page change resets the player to step 0 */
const steps=s=>Math.max(0,...[...s.querySelectorAll('[data-step]')].map(e=>+e.dataset.step));
let st=0;
function paint(){S[i].querySelectorAll('[data-step]').forEach(e=>{const n=+e.dataset.step;e.classList.toggle('later',n>st);
  if(n===st&&st>0){e.classList.remove('now');void e.offsetWidth;e.classList.add('now')}});
  const m=steps(S[i]);document.getElementById('count').textContent=`${i+1} / ${S.length}`+(m?` · ขั้น ${st}/${m}`+(playT?' ▶':''):'');}
function stepFwd(){if(st<steps(S[i])){st++;paint();return true}return false}
function stepBack(){if(st>0){st--;paint();return true}return false}
let playT=null;
function stopPlay(){if(playT){clearInterval(playT);playT=null;paint()}}
function playPage(){if(playT)return stopPlay();if(!steps(S[i]))return;if(st>=steps(S[i])){st=0}
  playT=setInterval(()=>{if(!stepFwd())stopPlay()},1600);stepFwd()||stopPlay();paint()}
/* P: run the whole deck by itself — every step, then the next page */
let deckT=null;function autoplay(){if(deckT){clearInterval(deckT);deckT=null;return}
  deckT=setInterval(()=>{if(stepFwd())return;if(i===S.length-1){autoplay();return}show(i+1)},2600)}
/* all=true shows every step at once (the checker uses it); keys and clicks always start at step 0 */
function show(n,all){i=Math.max(0,Math.min(S.length-1,n));S.forEach((s,j)=>s.classList.toggle('on',j===i));
  if(playT){clearInterval(playT);playT=null}
  S[i].querySelectorAll('[data-step]').forEach(e=>e.classList.remove('now'));st=all?steps(S[i]):0;
  paint();
  document.querySelectorAll('#bar i').forEach((b,j)=>b.className=j<i?'done':j===i?'now':'');
  const a=S[i].querySelector('aside');document.getElementById('notesBody').innerHTML=a?a.innerHTML:'(ไม่มีโน้ต)';
  history.replaceState(null,'','#'+(i+1));tick();
  document.querySelector('.edge.l').classList.toggle('off',i===0);document.querySelector('.edge.r').classList.toggle('off',i===S.length-1);
  countUp(S[i]);if(menuEl.classList.contains('on'))menu(true);}
function replay(){const s=S[i];stopPlay();s.classList.remove('on');void s.offsetWidth;s.classList.add('on');st=0;paint();countUp(s);}

/* presenter clock (T starts / stops) */
let t0=null,acc=0;
function secs(){return acc+(t0?(Date.now()-t0)/1000:0)}
function fmt(s){s=Math.floor(s);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function tick(){document.getElementById('clock').textContent=fmt(secs());}
setInterval(tick,1000);
function timer(){if(t0){acc=secs();t0=null}else t0=Date.now();tick()}
function fs(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();}
function key(k){
  if(['ArrowRight','PageDown'].includes(k))show(i+1);else if(['ArrowLeft','PageUp','Backspace'].includes(k))show(i-1);
  else if(k===' ')playPage();else if(k==='ArrowDown'){stopPlay();stepFwd()}else if(k==='ArrowUp'){stopPlay();stepBack()}
  else if(k==='Home')show(0);else if(k==='End')show(S.length-1);else if(k==='f'||k==='F')fs();else if(k==='n'||k==='N')notes.classList.toggle('on');
  else if(k==='t'||k==='T')timer();else if(k==='m'||k==='M')menu();else if(k==='r'||k==='R')replay();else if(k==='p'||k==='P')autoplay();else if(k==='Escape')menu(false);
  else return false;return true}
addEventListener('keydown',e=>{if(e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]'))return;
  if(key(e.key)&&[' ','ArrowUp','ArrowDown'].includes(e.key))e.preventDefault()});
addEventListener('resize',fit);
addEventListener('hashchange',()=>{const n=parseInt(location.hash.slice(1));if(n&&n-1!==i)show(n-1);});
let x0=null;addEventListener('touchstart',e=>x0=e.touches[0].clientX);addEventListener('touchend',e=>{if(x0===null)return;const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>80)show(d<0?i+1:i-1);x0=null;});
const prevPage=()=>show(i-1),nextPage=()=>show(i+1);
document.getElementById('prev').onclick=prevPage;document.getElementById('next').onclick=nextPage;
document.querySelector('.edge.l').onclick=prevPage;document.querySelector('.edge.r').onclick=nextPage;
document.getElementById('nb').onclick=()=>notes.classList.toggle('on');notes.querySelector('.nclose').onclick=()=>notes.classList.remove('on');
document.getElementById('fs').onclick=fs;

/* contents menu: sections (data-part) with their pages (data-menu) */
const menuEl=document.getElementById('menu');
document.getElementById('menuList').innerHTML=S.reduce((h,s,j)=>h+(s.dataset.part?(j?'</ul></div>':'')+`<div class="part"><h5>${esc(s.dataset.part)}</h5><ul>`:'')
  +`<li data-n="${j}"><i>${String(j+1).padStart(2,'0')}</i>${esc(s.dataset.menu||'')}</li>`,'')+'</ul></div>';
function menu(open){menuEl.classList.toggle('on',open===undefined?!menuEl.classList.contains('on'):open);
  menuEl.querySelectorAll('li').forEach(l=>l.classList.toggle('cur',+l.dataset.n===i));
  menuEl.querySelectorAll('.part').forEach(p=>p.classList.toggle('cur',!!p.querySelector('li.cur')));}
document.getElementById('menuList').addEventListener('click',e=>{const l=e.target.closest('li');if(l){show(+l.dataset.n);menu(false);}});
menuEl.querySelector('.mclose').onclick=()=>menu(false);menuEl.addEventListener('click',e=>{if(e.target===menuEl)menu(false);});
document.getElementById('mb').onclick=()=>menu();

/* progress bar: hover shows the page name, click jumps */
{const bar=document.getElementById('bar'),tip=document.getElementById('bartip');
 const partOf=j=>{for(let k=j;k>=0;k--)if(S[k].dataset.part)return S[k].dataset.part;return ''};
 bar.addEventListener('mousemove',e=>{const b=e.target.closest('i');if(!b){tip.style.display='none';return}const j=+b.dataset.n,s=S[j];
   tip.innerHTML=`<b>${String(j+1).padStart(2,'0')}</b>${esc(s.dataset.menu||'')}<span>${esc(partOf(j))}</span>`;tip.style.display='block';
   const r=b.getBoundingClientRect(),w=tip.offsetWidth/2;tip.style.left=Math.max(w+8,Math.min(innerWidth-w-8,r.left+r.width/2))+'px';});
 bar.addEventListener('mouseleave',()=>tip.style.display='none');
 bar.addEventListener('click',e=>{const b=e.target.closest('i');if(b)show(+b.dataset.n);});}
setTimeout(()=>document.getElementById('help').style.opacity=0,4500);
fit();show(i);
