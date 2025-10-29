
(function(){
  function qs(s){return document.querySelector(s)}
  function qsa(s){return Array.from(document.querySelectorAll(s))}
  const LOG='cst_log', CUR='cst_cur';
  function pushLog(detail){ const l=JSON.parse(localStorage.getItem(LOG)||'[]'); l.unshift({time:new Date().toLocaleString(), detail:detail, user: localStorage.getItem(CUR)||'guest'}); localStorage.setItem(LOG, JSON.stringify(l)); if(qs('#activityFeed')) renderDash(); }
  function getLogs(){return JSON.parse(localStorage.getItem(LOG)||'[]')}
  function initials(name){ return name.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase(); }
  function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  const fbSafe=[{user:'Anna Gomez',text:'Lovely day at the beach! 🌊',mins:15},{user:'Local Bakery',text:'New pastries today',mins:240},{user:'School PTA',text:'Meeting Friday 5pm',mins:500},{user:'Juan R',text:'Trip photos uploaded',mins:75},{user:'Mayor Office',text:'Community cleanup this weekend',mins:220}];
  const fbScam=[{user:'Promo Deals PH',textPrefix:'Win ₱',link:'claim-now-free.xyz'},{user:'FreeGiftOfficial',textPrefix:'You have been selected to receive',link:'freeprize-claim.net'},{user:'LimitedOffer',textPrefix:'Exclusive cash prize',link:'get-rich-fast.info'}];
  const gmSafe=[{from:'friend@example.com',subject:'Lunch?',snippet:'Meet at 12',mins:90},{from:'store@receipt.com',subject:'Order confirmed',snippet:'#12345 shipped',mins:300},{from:'newsletter@tech.org',subject:'Weekly roundup',snippet:'Top stories this week',mins:720}];
  const gmPhish=[{from:'security@googIe.com',subject:'Verify your account',snippet:'Click to verify: secure-verify-login.com'},{from:'no-reply@bank-secure.com',subject:'Confirm transaction',snippet:'bank-verify.info'}];

  window.SIM = {
    renderSocialFeed: function(container){
      if(!container) return;
      container.innerHTML='';
      const pool = fbSafe.slice().sort(()=>0.5-Math.random()).slice(0,5);
      if(Math.random()<0.95){ const s=rand(fbScam); pool.splice(Math.floor(Math.random()*pool.length),0,{user:s.user,text:s.textPrefix+' '+(Math.floor(Math.random()*90000)+1000)+' today! Click: '+s.link,scam:true}); }
      pool.forEach(p=>{ const el=document.createElement('div'); el.className='post'+(p.scam?' suspicious':''); el.innerHTML=`<div class="avatar">${initials(p.user)}</div><div class="post-body"><div class="post-meta"><strong>${p.user}</strong> · <span class="small">${p.mins||'10'}m</span></div><div class="post-text">${p.text}</div>${p.scam?'<div style="margin-top:8px"><button class="btn inspect">Inspect</button> <button class="btn ghost ignore">Ignore</button></div>':''}</div>`; container.appendChild(el); });
      setTimeout(()=>{ qsa('.inspect').forEach(b=> b.addEventListener('click', function(e){ e.preventDefault(); const root=b.closest('.suspicious'); if(root){ qs('#iosBody').textContent='This post appears to be a scam. Do not follow links.'; qs('#iosWarning').classList.add('show'); pushLog('Inspected suspicious post'); } })); qsa('.ignore').forEach(b=> b.addEventListener('click', function(e){ e.preventDefault(); pushLog('Ignored suspicious post'); alert('Ignored (demo)'); })); qsa('.suspicious').forEach(s=> s.addEventListener('click', function(e){ if(e.target.classList.contains('inspect')||e.target.classList.contains('ignore')) return; qs('#iosBody').textContent='This post appears suspicious.'; qs('#iosWarning').classList.add('show'); pushLog('Inspected suspicious post'); })); },50); pushLog('Opened Social simulation'); },

    renderInbox: function(container){
      if(!container) return;
      container.innerHTML='';
      const pool = gmSafe.slice().sort(()=>0.5-Math.random());
      if(Math.random()<0.95) pool.splice(Math.floor(Math.random()*pool.length),0, rand(gmPhish));
      pool.forEach(m=>{ const div=document.createElement('div'); div.className='email-row'+(m.scam?' suspicious':''); div.innerHTML=`<div class="email-sender">${initials(m.from||m.from||'ME')}</div><div class="email-meta"><div class="email-sub">${m.subject}</div><div class="email-snippet">${m.snippet||''}</div></div><div style="min-width:80px;color:var(--muted);font-size:13px">${m.mins?m.mins+'m':''}</div>`; container.appendChild(div); });
      setTimeout(()=>{ qsa('.suspicious').forEach(el=> el.addEventListener('click', function(e){ e.preventDefault(); qs('#iosBody').textContent='This email appears to be phishing: suspicious sender or link.'; qs('#iosWarning').classList.add('show'); pushLog('Inspected suspicious email'); })); },60); pushLog('Opened Inbox simulation'); }
  };

  document.addEventListener('DOMContentLoaded', function(){ const report=qs('#reportBtn'); if(report) report.addEventListener('click', function(){ pushLog('Reported content'); qs('#iosWarning').classList.remove('show'); alert('Reported (demo)'); }); const dismiss=qs('#dismissBtn'); if(dismiss) dismiss.addEventListener('click', function(){ pushLog('Dismissed warning'); qs('#iosWarning').classList.remove('show'); }); if(qs('#btnClear')) qs('#btnClear').addEventListener('click', function(){ if(confirm('Clear logs?')){ localStorage.removeItem(LOG); alert('Cleared'); location.reload(); } }); function renderDash(){ if(!qs('#activityFeed')) return; const feed=qs('#activityFeed'); feed.innerHTML=''; const logs=getLogs(); if(logs.length===0) feed.innerHTML='<div class="small">No activity yet</div>'; logs.slice(0,200).forEach(it=>{ const d=document.createElement('div'); d.className='card'; d.style.marginBottom='8px'; d.innerHTML='<div style="font-weight:700">'+it.detail+'</div><div style="font-size:12px;color:#9fb3c8">'+it.user+' • '+it.time+'</div>'; feed.appendChild(d); }); } window.renderDash = renderDash; renderDash(); });
})();