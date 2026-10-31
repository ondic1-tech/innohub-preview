document.querySelectorAll('[data-news-carousel]').forEach(carousel=>{
  const viewport=carousel.querySelector('[data-news-viewport]');
  const track=carousel.querySelector('[data-news-track]');
  const cards=Array.from(track.children);
  const previous=carousel.querySelector('[data-news-prev]');
  const next=carousel.querySelector('[data-news-next]');
  const status=carousel.querySelector('[data-news-status]');
  const en=document.documentElement.lang==='en';
  let index=0;
  const visibleCount=()=>Number.parseInt(getComputedStyle(carousel).getPropertyValue('--news-visible'),10)||3;
  const update=()=>{
    const visible=Math.min(visibleCount(),cards.length);
    index=Math.max(0,Math.min(index,cards.length-visible));
    const gap=Number.parseFloat(getComputedStyle(track).gap)||0;
    const step=cards[0].getBoundingClientRect().width+gap;
    track.style.transform=`translateX(${-index*step}px)`;
    previous.disabled=index===0;
    next.disabled=index>=cards.length-visible;
    status.textContent=visible===1
      ?(en?`News ${index+1} of ${cards.length}`:`Novinka ${index+1} ze ${cards.length}`)
      :(en?`News ${index+1}–${index+visible} of ${cards.length}`:`Novinky ${index+1}–${index+visible} ze ${cards.length}`);
    cards.forEach((card,position)=>{
      const hidden=position<index||position>=index+visible;
      card.inert=hidden;
      card.setAttribute('aria-hidden',String(hidden));
      if(hidden)card.querySelectorAll('details[open]').forEach(detail=>detail.open=false);
    });
  };
  const move=direction=>{index+=direction;update()};
  previous.addEventListener('click',()=>move(-1));
  next.addEventListener('click',()=>move(1));
  carousel.addEventListener('keydown',event=>{
    if(!event.target.matches('[data-news-prev],[data-news-next],[data-news-viewport]'))return;
    if(event.key==='ArrowRight'){event.preventDefault();move(1)}
    if(event.key==='ArrowLeft'){event.preventDefault();move(-1)}
    if(event.key==='Home'){event.preventDefault();index=0;update()}
    if(event.key==='End'){event.preventDefault();index=cards.length;update()}
  });
  carousel.classList.add('is-enhanced');
  carousel.querySelector('.news-controls').hidden=false;
  let frame;
  const resize=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update)};
  if('ResizeObserver' in window)new ResizeObserver(resize).observe(viewport);
  else window.addEventListener('resize',resize);
  update();
});
