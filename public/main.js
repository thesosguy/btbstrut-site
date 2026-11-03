(()=>{const t=document.querySelector('.menu-toggle'),m=document.getElementById('menu');if(t&&m){t.addEventListener('click',()=>{const o=m.classList.toggle('open');t.setAttribute('aria-expanded',o)})}
const y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();
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
