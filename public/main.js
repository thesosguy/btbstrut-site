(()=>{const t=document.querySelector('.menu-toggle'),m=document.getElementById('menu');if(t&&m){t.addEventListener('click',()=>{const o=m.classList.toggle('open');t.setAttribute('aria-expanded',o)})}
const y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mark=els=>{els.forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--d',`${Math.min(i*55,220)}ms`)})};
const reveal=()=>{const targets=document.querySelectorAll('.card,.step,.section-head,.checklist,.table-wrap,.form-card,.cta-band .container,.split > *');
if(!targets.length)return;
if(reduce){targets.forEach(el=>el.classList.add('reveal','is-in'));return}
mark(targets);
const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -8% 0px'});
targets.forEach(el=>io.observe(el))};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',reveal);else reveal();
const f=document.getElementById('quote-form');if(!f)return;const ts=f.querySelector('[name=_ts]');if(ts)ts.value=Date.now();
const p=new URLSearchParams(location.search).get('product');if(p){const s=f.querySelector('[name=product_interest]');[...s.options].forEach(o=>{if(o.value===p)s.value=p})}
const st=document.getElementById('form-status'),btn=f.querySelector('button[type=submit]');
f.addEventListener('submit',async e=>{e.preventDefault();st.className='form-status';if(!f.checkValidity()){f.reportValidity();return}
btn.disabled=true;const old=btn.textContent;btn.textContent='Sending…';
try{const r=await fetch('/api/quote',{method:'POST',headers:{'Accept':'application/json'},body:new FormData(f)});const j=await r.json().catch(()=>({}));
if(r.ok&&j.ok){st.className='form-status ok';st.textContent='Thank you — your request has been received. Our team will follow up by email shortly.';f.reset();if(ts)ts.value=Date.now()}
else{st.className='form-status err';st.textContent=j.error||'Sorry, something went wrong. Please try again.'}}
catch(_){st.className='form-status err';st.textContent='Network error — please check your connection and try again.'}
finally{btn.disabled=false;btn.textContent=old;st.focus()}})})();