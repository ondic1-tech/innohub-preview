const menuButton=document.querySelector('.menu-toggle');
const linkedinDisclosure=document.querySelector('.linkedin-disclosure');
const linkedinTrigger=linkedinDisclosure?.querySelector('summary');
if(linkedinTrigger){
  const trigger=linkedinTrigger;
  const rail=linkedinDisclosure.closest('.linkedin-rail');
  const masthead=document.querySelector('.masthead');
  if(rail&&masthead&&trigger){
    let positionFrame=0,lastTop=-1,lastHeight=-1;
    const positionRail=()=>{
      positionFrame=0;
      const minTop=Math.max(16,Math.ceil(masthead.getBoundingClientRect().bottom)+16);
      const height=Math.ceil(trigger.getBoundingClientRect().height);
      if(minTop!==lastTop){rail.style.setProperty('--linkedin-min-top',`${minTop}px`);lastTop=minTop;}
      if(height!==lastHeight){
        rail.style.setProperty('--linkedin-trigger-height',`${height}px`);
        rail.style.setProperty('--linkedin-trigger-half',`${height/2}px`);
        lastHeight=height;
      }
    };
    const schedulePosition=()=>{if(!positionFrame)positionFrame=requestAnimationFrame(positionRail);};
    positionRail();
    window.addEventListener('scroll',schedulePosition,{passive:true});
    window.addEventListener('resize',schedulePosition,{passive:true});
    window.addEventListener('pageshow',schedulePosition);
    if('ResizeObserver' in window){
      const headerObserver=new ResizeObserver(schedulePosition);
      headerObserver.observe(masthead);
      headerObserver.observe(trigger);
    }
  }
  let pinned=false;
  const setLinkedinOpen=open=>{linkedinDisclosure.open=open;trigger.setAttribute('aria-expanded',String(open));};
  setLinkedinOpen(false);
  linkedinDisclosure.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')setLinkedinOpen(true);});
  linkedinDisclosure.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'&&!pinned&&!linkedinDisclosure.contains(document.activeElement))setLinkedinOpen(false);});
  trigger.addEventListener('click',event=>{event.preventDefault();pinned=!pinned;setLinkedinOpen(pinned);});
  linkedinDisclosure.addEventListener('focusin',()=>setLinkedinOpen(true));
  linkedinDisclosure.addEventListener('focusout',event=>{if(!pinned&&!linkedinDisclosure.contains(event.relatedTarget))setLinkedinOpen(false);});
  document.addEventListener('pointerdown',event=>{if(!linkedinDisclosure.contains(event.target)){pinned=false;setLinkedinOpen(false);}});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&linkedinDisclosure.open){event.preventDefault();pinned=false;trigger.focus();setLinkedinOpen(false);}});
}
const serviceEntries=Array.from(document.querySelectorAll('[data-service]')).map(tab=>({tab,panel:document.getElementById(tab.getAttribute('aria-controls'))})).filter(entry=>entry.panel);
const serviceTabs=serviceEntries.map(entry=>entry.tab);
if(serviceTabs.length){
  const tablist=serviceTabs[0].parentElement;
  tablist.setAttribute('role','tablist');
  tablist.setAttribute('aria-orientation','vertical');
  serviceEntries.forEach(({tab,panel})=>{
    tab.setAttribute('role','tab');
    panel.setAttribute('role','tabpanel');
    panel.tabIndex=0;
  });
  const selectService=(id,updateUrl=false)=>{
    const selected=serviceTabs.find(tab=>tab.dataset.service===id)||serviceTabs[0];
    serviceEntries.forEach(({tab,panel})=>{
      const active=tab===selected;
      tab.setAttribute('aria-selected',String(active));
      tab.tabIndex=active?0:-1;
      tab.classList.toggle('active',active);
      panel.hidden=!active;
    });
    if(updateUrl&&location.hash!=='#'+selected.dataset.service)history.pushState(null,'','#'+selected.dataset.service);
    document.querySelectorAll('.languages a').forEach(link=>{link.hash=location.hash});
  };
  serviceTabs.forEach((tab,index)=>{
    tab.addEventListener('click',event=>{event.preventDefault();selectService(tab.dataset.service,true)});
    tab.addEventListener('keydown',event=>{
      let next=index;
      if(['ArrowDown','ArrowRight'].includes(event.key))next=(index+1)%serviceTabs.length;
      else if(['ArrowUp','ArrowLeft'].includes(event.key))next=(index-1+serviceTabs.length)%serviceTabs.length;
      else if(event.key==='Home')next=0;
      else if(event.key==='End')next=serviceTabs.length-1;
      else if(['Enter',' '].includes(event.key)){event.preventDefault();selectService(tab.dataset.service,true);return}
      else return;
      event.preventDefault();serviceTabs[next].focus();selectService(serviceTabs[next].dataset.service,true);
    });
  });
  const syncService=()=>{
    const id=location.hash.slice(1);
    selectService(id);
    const tab=serviceTabs.find(item=>item.dataset.service===id);
    if(tab)serviceEntries.find(entry=>entry.tab===tab).panel.scrollIntoView({block:'start'});
  };
  let serviceFrame=0;
  const scheduleService=()=>{if(!serviceFrame)serviceFrame=requestAnimationFrame(()=>{serviceFrame=0;syncService();});};
  window.addEventListener('hashchange',scheduleService);
  window.addEventListener('popstate',scheduleService);
  syncService();
}

// Warm only likely next documents after deliberate mouse or keyboard interest.
// Normal links remain in charge of navigation, including on unsupported browsers.
const prefetchedPages=new Set();
const prefetchPage=link=>{
  const connection=navigator.connection;
  if(document.visibilityState!=='visible'||connection?.saveData||/^(slow-2g|2g)$/.test(connection?.effectiveType||'')||prefetchedPages.size>=4)return;
  const destination=new URL(link.href,location.href);
  if(destination.origin!==location.origin||destination.pathname===location.pathname||destination.search||link.target==='_blank'||link.hasAttribute('download'))return;
  destination.hash='';
  if(prefetchedPages.has(destination.href))return;
  const hint=document.createElement('link');
  hint.rel='prefetch';hint.href=destination.href;
  prefetchedPages.add(destination.href);
  document.head.appendChild(hint);
};
document.querySelectorAll('.navigation a,.languages a,.brand,.brand-caption').forEach(link=>{
  let intentTimer;
  link.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')intentTimer=setTimeout(()=>prefetchPage(link),120);});
  link.addEventListener('pointerleave',()=>clearTimeout(intentTimer));
  link.addEventListener('focus',()=>{if(link.matches(':focus-visible'))prefetchPage(link);});
});
const menu=document.getElementById('main-navigation');
if(menuButton&&menu){menuButton.addEventListener('click',()=>{const expanded=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!expanded));menu.classList.toggle('open',!expanded)});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.classList.contains('open')){menu.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.focus()}})}
const inquiryForm=document.getElementById('inquiry-form');
if(inquiryForm){
  const status=document.getElementById('form-status');
  const button=inquiryForm.querySelector('button[type="submit"]');
  const en=document.documentElement.lang==='en';
  const failure=en?'Your message could not be sent. Please try again or email innohub@tc.cz.':'Zprávu se nepodařilo odeslat. Zkuste to znovu nebo napište na innohub@tc.cz.';
  inquiryForm.addEventListener('submit',async event=>{
    event.preventDefault();
    if(button.disabled||!inquiryForm.reportValidity())return;
    const data=Object.fromEntries(new FormData(inquiryForm));
    if(data._honey)return;
    data._url=location.origin+location.pathname;
    const label=button.textContent;
    button.disabled=true;
    button.textContent=en?'Sending…':'Odesílám…';
    inquiryForm.setAttribute('aria-busy','true');
    status.textContent='';
    status.classList.remove('success','error');
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),20000);
    try{
      const response=await fetch('https://formsubmit.co/ajax/innohub@tc.cz',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data),signal:controller.signal});
      const result=await response.json();
      if(!response.ok||(result.success!==true&&result.success!=='true'))throw new Error('Submission failed');
      if(/activat|confirm.*email|check.*email/i.test(result.message||''))throw new Error('Activation needed');
      inquiryForm.querySelector('.form-fields').hidden=true;
      status.classList.add('success');
      status.textContent=en?'Thank you for your message. We will contact you.':'Děkujeme za Vaši zprávu, budeme Vás kontaktovat.';
      inquiryForm.reset();
      status.focus();
    }catch(error){
      status.classList.add('error');
      status.textContent=failure;
      status.focus();
    }finally{
      clearTimeout(timeout);
      button.disabled=false;
      button.textContent=label;
      inquiryForm.removeAttribute('aria-busy');
    }
  });
}
