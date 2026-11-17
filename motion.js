(() => {
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cover=document.getElementById('cover'),main=document.getElementById('invitation');
  // All content stays visible when JavaScript or IntersectionObserver is unavailable.
  const targets=[...document.querySelectorAll('.lace,.album,.location,.closing')];
  if('IntersectionObserver' in window&&!reduce){
    targets.forEach(el=>el.classList.add('reveal'));
    document.documentElement.classList.add('motion-ready');
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.06});
    targets.forEach(el=>observer.observe(el));
  }else targets.forEach(el=>el.classList.add('is-visible'));
  const openButton=document.getElementById('open');let opening=false;
  function revealInvitation(instant=false){
    if(opening)return;opening=true;
    main.inert=false;document.body.classList.add('opened');
    if(instant||reduce){cover.hidden=true;window.scrollTo(0,0);return}
    openButton.disabled=true;cover.classList.add('is-opening');
    window.scrollTo(0,0);
    setTimeout(()=>{cover.hidden=true;document.querySelector('.hero-name').setAttribute('tabindex','-1');document.querySelector('.hero-name').focus({preventScroll:true})},1500);
  }
  openButton.onclick=()=>revealInvitation();
  if(cover.hidden){opening=false;revealInvitation(true)}
  const petals=document.createElement('div');petals.className='floating-blooms';petals.setAttribute('aria-hidden','true');
  if(!reduce){for(let i=0;i<9;i++){const leaf=document.createElement('i');leaf.style.cssText=`--x:${8+i*10}%;--size:${5+(i%4)*2}px;--duration:${17+(i%4)*4}s;--delay:-${i*3}s`;petals.append(leaf)}document.querySelector('header').style.position='relative';document.querySelector('header').append(petals)}
  const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');progress.append(document.createElement('span'));document.body.append(progress);
  let scheduled=false;function updateProgress(){scheduled=false;const length=document.documentElement.scrollHeight-innerHeight;progress.firstElementChild.style.transform=`scaleX(${length>0?scrollY/length:0})`}
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress)}},{passive:true});addEventListener('resize',updateProgress);updateProgress();
  // The outgoing photo stays in place while the next image decodes, then dissolves.
  const photo=document.getElementById('photo'),frame=document.querySelector('.photo-main');let lastSrc=photo.src,transitionId=0;
  const photoObserver=new MutationObserver(()=>{const nextSrc=photo.src;if(nextSrc===lastSrc)return;const previous=lastSrc;lastSrc=nextSrc;const id=++transitionId;
    if(reduce)return;
    const outgoing=new Image();outgoing.src=previous;outgoing.alt='';outgoing.className='photo-outgoing';outgoing.setAttribute('aria-hidden','true');frame.querySelectorAll('.photo-outgoing').forEach(el=>el.remove());frame.append(outgoing);
    photo.classList.remove('drifting');
    const finish=()=>{if(id!==transitionId)return;requestAnimationFrame(()=>{outgoing.classList.add('fading');photo.classList.add('drifting')});setTimeout(()=>outgoing.remove(),1100)};
    photo.decode().then(finish,finish);
  });photoObserver.observe(photo,{attributes:true,attributeFilter:['src']});
  if(!reduce)requestAnimationFrame(()=>photo.classList.add('drifting'));
  let swipeX=0,swipeY=0;frame.addEventListener('touchstart',e=>{swipeX=e.changedTouches[0].clientX;swipeY=e.changedTouches[0].clientY},{passive:true});
  frame.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-swipeX,dy=e.changedTouches[0].clientY-swipeY;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){frame.querySelector(dx<0?'.next':'.prev').click()}},{passive:true});
  // Animate only the countdown digits that actually changed.
  const countdown=document.getElementById('countdown');let previousDigits=[];
  new MutationObserver(()=>{[...countdown.querySelectorAll('strong')].forEach((digit,i)=>{if(previousDigits[i]!==undefined&&previousDigits[i]!==digit.textContent&&!reduce)digit.classList.add('tick');previousDigits[i]=digit.textContent})}).observe(countdown,{childList:true});
  const linkQuery=new URLSearchParams(location.search);if(linkQuery.get('open')==='1')document.querySelectorAll('nav a').forEach(a=>{const u=new URL(a.href);u.searchParams.set('open','1');a.href=u.href});
})();
