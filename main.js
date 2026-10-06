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
if(inquiryForm){const goal=document.getElementById('goal');const requestedGoal=new URLSearchParams(location.search).get('service');if(requestedGoal&&Array.from(goal.options).some(o=>o.value===requestedGoal)){goal.value=requestedGoal}inquiryForm.addEventListener('submit',event=>{event.preventDefault();if(!inquiryForm.reportValidity())return;const en=document.documentElement.lang==='en';const organisation=document.getElementById('organisation').value.trim();const message=document.getElementById('message').value.trim();const selected=goal.options[goal.selectedIndex].textContent;const subject='INNOHUB — '+selected;const body=(en?'Organisation: ':'Organizace: ')+organisation+'\n'+(en?'Topic: ':'Téma: ')+selected+'\n\n'+message;const email='mailto:simek@tc.cz?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);document.getElementById('form-status').textContent=en?'Your email application will open with a draft. Send the message there. If it does not open, email simek@tc.cz directly.':'V e-mailové aplikaci se otevře rozepsaná zpráva. Odešlete ji v této aplikaci. Pokud se neotevře, napište přímo na simek@tc.cz.';window.location.href=email})}
