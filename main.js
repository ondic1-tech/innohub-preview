const menuButton=document.querySelector('.menu-toggle');
const serviceTabs=Array.from(document.querySelectorAll('[role="tab"][data-service]'));
if(serviceTabs.length){
  const selectService=(id,updateUrl=false)=>{
    const selected=serviceTabs.find(tab=>tab.dataset.service===id)||serviceTabs[0];
    serviceTabs.forEach(tab=>{
      const active=tab===selected;
      tab.setAttribute('aria-selected',String(active));
      tab.tabIndex=active?0:-1;
      tab.classList.toggle('active',active);
      document.getElementById(tab.getAttribute('aria-controls')).hidden=!active;
    });
    if(updateUrl)history.pushState(null,'','#'+selected.dataset.service);
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
  const syncService=()=>selectService(location.hash.slice(1));
  window.addEventListener('hashchange',syncService);
  window.addEventListener('popstate',syncService);
  syncService();
}
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
    }finally{
      clearTimeout(timeout);
      button.disabled=false;
      button.textContent=label;
      inquiryForm.removeAttribute('aria-busy');
    }
  });
}
