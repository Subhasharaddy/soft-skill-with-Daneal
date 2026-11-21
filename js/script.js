/* Day content lives in js/days-data.js */

const hues=[250,8,165,38,200,320,95];
const $=s=>document.querySelector(s);
const tile=d=>`background:linear-gradient(135deg,hsl(${hues[d%7]} 70% 45%),hsl(${(hues[d%7]+50)%360} 70% 35%))`;

const items=[];
days.forEach((d,i)=>{
  const list=d.photos.length?d.photos:[null,null,null,null];
  list.forEach((p,k)=>{const f=p&&(p.file||p);items.push({day:i,src:f?`assets/images/day${i+1}/${f}`:null,cap:(p&&p.caption)||`Day ${i+1}: ${d.title}`,h:[220,300,250,270][k%4]})});
});

$("#timeline").innerHTML=days.map((d,i)=>`
 <article class="day glass"><small>${d.date}</small><h3>${d.title}</h3><p>${d.summary}</p>
 <ul>${d.activities.map(a=>`<li>${a}</li>`).join("")}</ul>
 <button data-day="${i}">See Day ${i+1} photos</button></article>`).join("");

$("#chips").innerHTML=['<button class="on" data-f="all">All days</button>',...days.map((d,i)=>`<button data-f="${i}">Day ${i+1}</button>`)].join("");

let current=[],pos=0,filter="all";
function renderGrid(){
  current=items.filter(x=>filter==="all"||x.day==filter);
  $("#grid").innerHTML=current.map((x,j)=>`<figure class="ph" data-j="${j}" tabindex="0">
   ${x.src?`<img src="${x.src}" alt="${x.cap}" loading="lazy">`:`<div class="tile" style="height:${x.h}px;${tile(x.day)}">Photo goes here</div>`}
   <figcaption>${x.cap}</figcaption></figure>`).join("");
}
function setFilter(f){
  filter=f;
  document.querySelectorAll("#chips button").forEach(b=>b.classList.toggle("on",b.dataset.f==f));
  renderGrid();
}
$("#chips").onclick=e=>{const b=e.target.closest("button");if(b)setFilter(b.dataset.f)};
$("#timeline").onclick=e=>{const b=e.target.closest("button");if(b){setFilter(b.dataset.day);$("#gallery").scrollIntoView()}};

const lb=$("#lb");
function show(){const x=current[pos];
  $("#lbFig").innerHTML=(x.src?`<img src="${x.src}" alt="${x.cap}">`:`<div class="tile" style="${tile(x.day)}">Photo goes here</div>`)+`<figcaption>${x.cap} - ${pos+1}/${current.length}</figcaption>`}
function openLb(j){pos=j;show();lb.hidden=false;document.body.style.overflow="hidden"}
function closeLb(){play(false);lb.hidden=true;document.body.style.overflow=""}
function step(n){pos=(pos+n+current.length)%current.length;show()}
$("#grid").onclick=e=>{const f=e.target.closest(".ph");current=items.filter(x=>filter==="all"||x.day==filter);if(f)openLb(+f.dataset.j)};
$("#grid").onkeydown=e=>{if(e.key==="Enter"){const f=e.target.closest(".ph");if(f)openLb(+f.dataset.j)}};
$("#lbClose").onclick=closeLb;$("#lbPrev").onclick=()=>step(-1);$("#lbNext").onclick=()=>step(1);
lb.onclick=e=>{if(e.target===lb)closeLb()};
document.onkeydown=e=>{if(lb.hidden)return;if(e.key==="Escape")closeLb();if(e.key==="ArrowLeft")step(-1);if(e.key==="ArrowRight")step(1)};

if(TRAINER_PHOTO)$("#portrait").innerHTML=`<img src="${TRAINER_PHOTO}" alt="Mr. Daneal Samson">`;

const words=["communicate","lead","work together","believe in ourselves"];let w=0,c=0,del=false;
(function type(){const t=$("#typed"),word=words[w];
  t.textContent=word.slice(0,c);
  if(!del&&c===word.length){del=true;return setTimeout(type,1400)}
  if(del&&c===0){del=false;w=(w+1)%words.length}
  c+=del?-1:1;setTimeout(type,del?40:80)})();

const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&x.target.classList.add("in")),{threshold:.15});
document.querySelectorAll(".day").forEach(d=>io.observe(d));
renderGrid();

/* ===== PREMIUM EFFECTS (no content here, safe to leave as is) ===== */
// page transition
addEventListener("load",()=>setTimeout(()=>$("#loader").classList.add("done"),700));
// scroll progress
addEventListener("scroll",()=>{const h=document.documentElement;$("#progress").style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+"%"},{passive:true});
// scroll reveals
document.querySelectorAll(".wrap>h2,.mentor,.chips,footer").forEach(e=>{e.classList.add("rv");io.observe(e)});
// golden particles (ambient + mouse trail)
(function(){
  const cv=$("#sparks"),ctx=cv.getContext("2d");let W,H,P=[];const mouse={x:-9,y:-9};
  const fit=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight};fit();addEventListener("resize",fit);
  const mk=(x,y,t)=>({x,y,r:Math.random()*1.8+.6,vx:(Math.random()-.5)*(t?1.4:.25),vy:t?(Math.random()-.5)*1.4:-Math.random()*.35-.08,a:t?1:Math.random()*.6+.2,t});
  const n=Math.min(70,Math.floor(innerWidth/18));
  for(let i=0;i<n;i++)P.push(mk(Math.random()*W,Math.random()*H,0));
  addEventListener("pointermove",e=>{mouse.x=e.clientX;mouse.y=e.clientY;$("#cg").style.left=e.clientX+"px";$("#cg").style.top=e.clientY+"px";
    if(P.length<260)for(let i=0;i<2;i++)P.push(mk(e.clientX,e.clientY,1))});
  (function loop(){ctx.clearRect(0,0,W,H);
    P=P.filter(p=>!(p.t&&p.a<=.02));
    P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.t)p.a-=.02;
      if(!p.t){if(p.y<-5){p.y=H+5;p.x=Math.random()*W}p.a+=Math.sin((p.x+p.y+Date.now()/700))*.01}
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);
      ctx.fillStyle=`rgba(246,214,120,${Math.max(0,Math.min(1,p.a))})`;ctx.shadowColor="#d4af37";ctx.shadowBlur=10;ctx.fill()});
    requestAnimationFrame(loop)})();
})();
// 3D tilt on cards and photos
function tilt(e){const t=e.target.closest(".day,.ph");document.querySelectorAll(".day,.ph").forEach(c=>{if(c!==t){c.style.removeProperty("--rx");c.style.removeProperty("--ry")}});
  if(!t||innerWidth<820)return;const r=t.getBoundingClientRect();
  t.style.setProperty("--ry",((e.clientX-r.left)/r.width-.5)*10+"deg");t.style.setProperty("--rx",-((e.clientY-r.top)/r.height-.5)*10+"deg")}
document.addEventListener("pointermove",tilt);
document.addEventListener("pointerleave",()=>document.querySelectorAll(".day,.ph").forEach(c=>{c.style.removeProperty("--rx");c.style.removeProperty("--ry")}));

/* ===== DAY-WISE SECTIONS, SLIDESHOW ===== */
let timer=null;
function play(on){clearInterval(timer);timer=null;$("#lbPlay").textContent=on?"\u275A\u275A":"\u25B6";$("#lbPlay").setAttribute("aria-label",on?"Pause slideshow":"Play slideshow");if(on)timer=setInterval(()=>step(1),3000)}
$("#lbPlay").onclick=()=>play(!timer);
let tx=0;lb.addEventListener("touchstart",e=>tx=e.touches[0].clientX,{passive:true});
lb.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)step(dx<0?1:-1)});
document.addEventListener("keydown",e=>{if(!lb.hidden&&e.key===" "){e.preventDefault();play(!timer)}});

const blocks=[["Activities","activities"],["Experiences","experiences"],["Achievements","achievements"],["Lessons learned","lessons"]];
$("#dayTabs").innerHTML=days.map((d,i)=>`<button data-d="${i+1}">Day ${i+1}</button>`).join("");
$("#daySections").innerHTML=days.map((d,i)=>{
  const mine=items.filter(x=>x.day===i);
  return `<article class="dsec glass rv" id="day${i+1}" data-d="${i}">
  <header><span class="dn">Day ${i+1}</span><h3>${d.title}</h3><p class="dd">${d.description||d.summary}</p>
  <button class="show" data-play="${i}">&#9654; Play slideshow</button></header>
  <div class="info">${blocks.filter(b=>d[b[1]]&&d[b[1]].length).map(b=>`<div class="ib"><h4>${b[0]}</h4><ul>${d[b[1]].map(a=>`<li>${a}</li>`).join("")}</ul></div>`).join("")}</div>
  <div class="dgrid">${mine.map((x,j)=>`<figure class="ph" data-j="${j}" tabindex="0">${x.src?`<img src="${x.src}" alt="${x.cap}" loading="lazy">`:`<div class="tile" style="height:${x.h}px;${tile(x.day)}">Photo goes here</div>`}<figcaption>${x.cap}</figcaption></figure>`).join("")}</div></article>`}).join("");
const daySet=i=>{current=items.filter(x=>x.day===i)};
$("#daySections").addEventListener("click",e=>{
  const sec=e.target.closest(".dsec");if(!sec)return;const i=+sec.dataset.d;
  if(e.target.closest("[data-play]")){daySet(i);openLb(0);play(true);return}
  const f=e.target.closest(".ph");if(f){daySet(i);openLb(+f.dataset.j)}});
$("#daySections").addEventListener("keydown",e=>{if(e.key!=="Enter")return;const f=e.target.closest(".ph");if(f){daySet(+f.closest(".dsec").dataset.d);openLb(+f.dataset.j)}});
$("#dayTabs").onclick=e=>{const b=e.target.closest("button");if(b)document.getElementById("day"+b.dataset.d).scrollIntoView({behavior:"smooth",block:"start"})};
const so=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){const n=x.target.id.slice(3);document.querySelectorAll("#dayTabs button").forEach(b=>b.classList.toggle("on",b.dataset.d===n))}}),{rootMargin:"-35% 0px -55% 0px"});
document.querySelectorAll(".dsec").forEach(d=>{io.observe(d);so.observe(d)});
