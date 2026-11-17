(() => {
  'use strict';
  const $=id=>document.getElementById(id),set=(id,value)=>$(id).textContent=value;
  const query=new URLSearchParams(location.search),groom=location.pathname.includes('nha-trai');
  const party=groom?{label:'TIỆC CƯỚI NHÀ TRAI',day:'06',weekday:'Chủ nhật',lunar:'28',welcome:'16:30',time:'17:00',venue:'Trống Đồng Palace Long Biên',address:'Tầng 2, Tasco Mall, số 7–9 Nguyễn Văn Linh, phường Việt Hưng, Hà Nội',map:'Trống Đồng Palace Long Biên, Tasco Mall, 7-9 Nguyễn Văn Linh, Hà Nội',start:'20261206T093000Z',end:'20261206T123000Z'}:{label:'TIỆC CƯỚI NHÀ GÁI',day:'05',weekday:'Thứ bảy',lunar:'27',welcome:'10:30',time:'11:00',venue:'TTTC CTM Palace',address:'131 Nguyễn Phong Sắc, phường Nghĩa Đô, Hà Nội',map:'CTM Palace, 131 Nguyễn Phong Sắc, Hà Nội',start:'20261205T033000Z',end:'20261205T063000Z'};
  document.title=`Ngọc Diệp & Hải Nam · ${groom?'Nhà trai':'Nhà gái'} ${party.day}.12.2026`;
  document.querySelectorAll('[data-date]').forEach(el=>el.textContent=`${party.day} . 12 . 2026`);
  for(const [id,value] of Object.entries({'party-label':party.label,day:party.day,weekday:party.weekday,lunar:`Tức ngày ${party.lunar} tháng 10 năm Bính Ngọ`,'welcome-time':party.welcome,'party-time':party.time,venue:party.venue,address:party.address}))set(id,value);
  $(groom?'groom-link':'bride-link').setAttribute('aria-current','page');
  const guest=query.get('guest')?.trim().slice(0,120);if(guest){set('cover-guest',guest);set('guest-name',guest)}
  $('directions').href='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(party.map);
  $('calendar').href='https://calendar.google.com/calendar/render?'+new URLSearchParams({action:'TEMPLATE',text:`${party.label} · Ngọc Diệp & Hải Nam`,dates:party.start+'/'+party.end,ctz:'Asia/Ho_Chi_Minh',location:party.venue+', '+party.address,details:`Đón khách ${party.welcome} · Nhập tiệc ${party.time}`});
  $('map-details').addEventListener('toggle',()=>{if($('map-details').open&&!$('map').getAttribute('src'))$('map').src='https://maps.google.com/maps?q='+encodeURIComponent(party.map)+'&z=16&output=embed'});
  const target=new Date(`2026-12-${party.day}T${party.welcome}:00+07:00`).getTime();
  function countdown(){const remaining=target-Date.now();if(remaining<=0){set('countdown','Hẹn gặp bạn trong ngày chung vui.');return}const days=Math.floor(remaining/86400000),hours=Math.floor(remaining/3600000)%24;set('countdown',`Còn ${days} ngày, ${hours} giờ đến ngày chung vui.`)}countdown();setInterval(countdown,60000);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,main=$('invitation'),cover=$('cover');let opening=false;
  main.inert=true;
  function prepareLinks(){document.querySelectorAll('.site-nav>div>a').forEach(a=>{const u=new URL(a.href);u.searchParams.set('open','1');if(guest)u.searchParams.set('guest',guest);a.href=u.href})}
  function openInvitation(instant=false){if(opening)return;opening=true;$('open').disabled=true;main.inert=false;prepareLinks();
    const enter=()=>{document.body.classList.add('entered');window.scrollTo(0,0)};
    const finish=()=>{cover.hidden=true;document.body.classList.remove('is-covered');$('hero-title').focus({preventScroll:true})};
    if(instant||reduce){enter();finish();return}
    cover.classList.add('is-opening');setTimeout(enter,1450);setTimeout(finish,2800);
  }
  $('open').addEventListener('click',()=>openInvitation());if(query.get('open')==='1')openInvitation(true);
  if('IntersectionObserver' in window&&!reduce){document.documentElement.classList.add('js-motion');const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}})},{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));
  const photos=[{src:'photo-3.jpg',alt:'Ngọc Diệp và Hải Nam bên nhau'},{src:'portrait.jpg',alt:'Ngọc Diệp và Hải Nam cùng bó hoa cưới'},{src:'photo-1.jpg',alt:'Ảnh chung ngày cưới của Ngọc Diệp và Hải Nam'},{src:'photo-2.jpg',alt:'Cận cảnh đôi tay và nhẫn cưới'}];
  const image=$('photo'),frame=$('photo-frame'),dialog=$('lightbox');let index=0,playing=!reduce,inViewport=false,changeId=0;
  function syncCount(){set('image-index',`${String(index+1).padStart(2,'0')} — 04`);set('large-count',`${index+1} / 4`)}
  function setPlayback(value){playing=value;$('autoplay').setAttribute('aria-pressed',String(!playing));set('autoplay',playing?'Tạm dừng trình chiếu':'Phát trình chiếu')}
  function show(next,manual=false){if(manual)setPlayback(false);index=(next+photos.length)%photos.length;const src='/assets/'+photos[index].src,id=++changeId,previousSrc=image.src;
    frame.querySelectorAll('.outgoing').forEach(el=>el.remove());
    let outgoing;if(!reduce&&previousSrc&&!previousSrc.endsWith(photos[index].src)){outgoing=new Image();outgoing.src=previousSrc;outgoing.alt='';outgoing.className='outgoing';outgoing.setAttribute('aria-hidden','true');frame.append(outgoing)}
    image.classList.remove('drifting');image.src=src;image.alt=photos[index].alt;$('large-photo').src=src;$('large-photo').alt=photos[index].alt;syncCount();
    if(manual)set('photo-status',`Ảnh ${index+1} trên ${photos.length}: ${photos[index].alt}`);
    const ready=()=>{if(id!==changeId)return;requestAnimationFrame(()=>{if(outgoing)outgoing.classList.add('fading');if(!reduce)image.classList.add('drifting')});if(outgoing)setTimeout(()=>outgoing.remove(),1000)};
    if(image.decode)image.decode().then(ready,ready);else ready();
  }
  $('previous').onclick=()=>show(index-1,true);$('next').onclick=()=>show(index+1,true);$('large-previous').onclick=()=>show(index-1,true);$('large-next').onclick=()=>show(index+1,true);$('autoplay').onclick=()=>setPlayback(!playing);
  $('photo-open').onclick=()=>{setPlayback(false);$('large-photo').src='/assets/'+photos[index].src;$('large-photo').alt=photos[index].alt;syncCount();dialog.showModal()};$('close-photo').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();show(index+1,true)}if(e.key==='ArrowLeft'){e.preventDefault();show(index-1,true)}});
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{inViewport=entries[0].isIntersecting},{threshold:.2}).observe(frame);else inViewport=true;
  setInterval(()=>{if(playing&&inViewport&&!document.hidden&&!dialog.open&&!main.inert)show(index+1)},6500);setPlayback(playing);syncCount();
  let startX=0,startY=0,ignoreClick=false;frame.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX;startY=e.changedTouches[0].clientY},{passive:true});frame.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){ignoreClick=true;show(index+(dx<0?1:-1),true);setTimeout(()=>{ignoreClick=false},350)}},{passive:true});$('photo-open').addEventListener('click',e=>{if(ignoreClick){e.preventDefault();e.stopImmediatePropagation()}},true);
  let scheduled=false;function updateProgress(){scheduled=false;const length=document.documentElement.scrollHeight-innerHeight;$('reading-bar').style.transform=`scaleX(${length>0?Math.min(1,Math.max(0,scrollY/length)):0})`}
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress)}},{passive:true});addEventListener('resize',updateProgress);
})();
