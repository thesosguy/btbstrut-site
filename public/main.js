(()=>{const t=document.querySelector('.menu-toggle'),m=document.getElementById('menu');if(t&&m){const setOpen=o=>{m.classList.toggle('open',o);t.setAttribute('aria-expanded',o)};t.addEventListener('click',()=>setOpen(!m.classList.contains('open')));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&m.classList.contains('open')){setOpen(false);t.focus()}})}
const y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile=window.matchMedia('(max-width:900px)').matches;const mark=els=>{els.forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--d',`${Math.min(i*(mobile?70:45),mobile?280:180)}ms`)})};
const reveal=()=>{const targets=document.querySelectorAll('.card,.step,.section-head,.checklist,.table-wrap,.form-card,.cta-band .container,.split > *');
if(!targets.length)return;
if(reduce){targets.forEach(el=>el.classList.add('reveal','is-in'));return}
mark(targets);
const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{threshold:mobile?.08:.12,rootMargin:mobile?'0px 0px -4% 0px':'0px 0px -8% 0px'});
targets.forEach(el=>io.observe(el))};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',reveal);else reveal();
const f=document.getElementById('quote-form');if(!f)return;const ts=f.querySelector('[name=_ts]');if(ts)ts.value=Date.now();
const p=new URLSearchParams(location.search).get('product');if(p){const s=f.querySelector('[name=product_interest]');const map={shallow:'Shallow',deep:'Deep','x-tra-deep':'X-Tra Deep',xtradeep:'X-Tra Deep',mixed:'Mixed'};const want=map[p.toLowerCase()]||p;[...s.options].forEach(o=>{if(o.value===want||o.value===p||o.textContent.includes(p))s.value=o.value})}
const st=document.getElementById('form-status'),btn=f.querySelector('button[type=submit]');

const anchor=document.getElementById('form-submit-anchor'),sticky=document.getElementById('form-sticky'),stickyBtn=document.getElementById('form-sticky-submit');
if(anchor&&sticky&&stickyBtn&&window.matchMedia('(max-width:900px)').matches){
  let interacted=false;
  const sync=()=>{const show=interacted&&!anchor.__inView;sticky.classList.toggle('is-shown',show);sticky.hidden=!show;document.body.classList.toggle('has-form-sticky',show)};
  anchor.__inView=true;
  f.addEventListener('focusin',()=>{interacted=true;sync()});
  f.addEventListener('input',()=>{interacted=true;sync()},{passive:true});
  const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.target===anchor){anchor.__inView=e.isIntersecting;sync()}})},{threshold:0,rootMargin:'0px'});
  io.observe(anchor);
  stickyBtn.addEventListener('click',()=>{if(typeof f.requestSubmit==='function')f.requestSubmit(btn);else btn.click()});
}
f.addEventListener('submit',async e=>{e.preventDefault();st.className='form-status';if(!f.checkValidity()){f.reportValidity();return}const addr=(f.querySelector('[name=delivery_address]')||{}).value?.trim()||'';const w3w=(f.querySelector('[name=delivery_what3words]')||{}).value?.trim()||'';if(!addr&&!w3w){st.className='form-status err';st.textContent='Please provide a delivery street address and/or a what3words location.';st.focus();return}
btn.disabled=true;if(stickyBtn)stickyBtn.disabled=true;const old=btn.textContent;btn.textContent='Sending…';if(stickyBtn)stickyBtn.textContent='Sending…';
try{const r=await fetch('/api/quote',{method:'POST',headers:{'Accept':'application/json'},body:new FormData(f)});const j=await r.json().catch(()=>({}));
if(r.ok&&j.ok){st.className='form-status ok';st.textContent='Thank you — your request has been received. Our team will follow up by email shortly.';f.reset();if(ts)ts.value=Date.now()}
else{st.className='form-status err';st.textContent=j.error||'Sorry, something went wrong. Please try again.'}}
catch(_){st.className='form-status err';st.textContent='Network error — please check your connection and try again.'}
finally{btn.disabled=false;btn.textContent=old;if(stickyBtn){stickyBtn.disabled=false;stickyBtn.textContent=old}st.focus()}})})();