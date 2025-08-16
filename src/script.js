const btn   = document.querySelector('#tripTypeBtn');
const text  = document.querySelector('#tripTypeText');
const caret = document.querySelector('#tripTypeCaret');
const menu  = document.querySelector('#tripTypeMenu');

let isOpen = false;

// تابع باز کردن منو
const openMenu = () => {
  menu.classList.remove('hidden');
  caret.classList.add('rotate-180');
  isOpen = true;
};

// تابع بستن منو
const closeMenu = () => {
  menu.classList.add('hidden');
  caret.classList.remove('rotate-180');
  isOpen = false;
};

// کلیک روی دکمه -> باز/بسته شدن
btn.addEventListener('click', (e) => {
  e.stopPropagation();
  isOpen ? closeMenu() : openMenu();
});

// انتخاب گزینه از منو
menu.addEventListener('click', (e) => {
  const option = e.target.closest('[data-value]');
  if (!option) return;
  text.textContent = option.dataset.value; // تغییر متن دکمه
  closeMenu(); // بستن منو
});

// کلیک بیرون از منو -> بستن
document.addEventListener('click', () => {
  if (isOpen) closeMenu();
});




(() => {
  const CITIES = ["تهران","مشهد","اصفهان","شیراز","تبریز","کرج","قم","اهواز","کرمانشاه","رشت"];
  const $ = (id) => document.getElementById(id);

  const originInput = $("origin-input");
  const destInput   = $("destination-input");
  const swapBtn     = $("swap-btn");

  const isReadyToSwap = () =>
    (originInput.value || "").trim() !== "" && (destInput.value || "").trim() !== "";

  const setSwapState = () => {
    swapBtn.style.opacity = isReadyToSwap() ? "1" : "0.5";
    swapBtn.style.cursor  = isReadyToSwap() ? "pointer" : "not-allowed";
  };

  const addClearButton = (groupId, inputId) => {
    const group = $(groupId);
    const input = $(inputId);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML = "&times;";
    btn.style.position = "absolute";
    btn.style.top = "50%";
    btn.style.transform = "translateY(-50%)";
    btn.style.left = "8px"; // چون متن فارسیه و لیبل سمت راست هست، ضربدر سمت چپ input باشه
    btn.style.background = "transparent";
    btn.style.border = "none";
    btn.style.color = "#999";
    btn.style.fontSize = "18px";
    btn.style.cursor = "pointer";
    btn.style.display = "none";
    btn.style.zIndex = "30";

    btn.addEventListener("click", () => {
      input.value = "";
      btn.style.display = "none";
      setSwapState();
    });

    group.appendChild(btn);

    input.addEventListener("input", () => {
      btn.style.display = input.value.trim() ? "block" : "none";
    });

    return btn;
  };

  const setupCityInput = (groupId, inputId, listId) => {
    const group = $(groupId);
    const input = $(inputId);
    const list  = $(listId);
    if (!group || !input || !list) return;

    const clearBtn = addClearButton(groupId, inputId);

    const makeHeader = () =>
      `<li class="px-4 py-2 text-slate-400 text-sm cursor-default select-none">شهرهای پرتردد</li>`;

    const renderList = (items) => {
      list.innerHTML =
        makeHeader() +
        items.map(
          c => `<li class="px-6 py-2 hover:bg-slate-100 cursor-pointer" data-val="${c}">${c}</li>`
        ).join("");
    };

    const openList  = () => list.classList.remove("hidden");
    const closeList = () => list.classList.add("hidden");
    const filterCities = (q) => q.trim() ? CITIES.filter(c => c.includes(q.trim())) : CITIES;

    const showMenu = () => {
      renderList(filterCities(input.value || ""));
      openList();
    };

    input.addEventListener("focus", showMenu, { passive: true });
    input.addEventListener("click",  showMenu);
    input.addEventListener("input",  showMenu);

    list.addEventListener("click", (e) => {
      const li = e.target.closest("li[data-val]");
      if (!li) return;
      input.value = li.dataset.val;
      clearBtn.style.display = "block"; // وقتی شهر انتخاب شد، ضربدر ظاهر بشه
      closeList();
      setSwapState();
    });

    document.addEventListener("click", (e) => {
      if (!group.contains(e.target)) closeList();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeList();
    });
  };

  setupCityInput("origin-group", "origin-input", "origin-list");
  setupCityInput("destination-group", "destination-input", "destination-list");

  swapBtn.addEventListener("click", () => {
    if (!isReadyToSwap()) return;
    const tmp = originInput.value;
    originInput.value = destInput.value;
    destInput.value   = tmp;
    setSwapState();
  });

  ["input","change"].forEach(ev => {
    originInput.addEventListener(ev, setSwapState);
    destInput.addEventListener(ev, setSwapState);
  });

  setSwapState();
})();





/* ------------------ ابزار جلالی/میلادی (از صفر) ------------------ */
/* الگوریتم roozbeh/behdad - ساده‌سازی شده */
function div(a,b){return ~~(a/b)}
function jalaliToJDN(jy,jm,jd){
  const epbase = jy- (jy>=0?474:473);
  const epyear = 474 + (epbase % 2820);
  return jd +
    (jm<=7 ? (jm-1)*31 : (jm-7)*30 + 186) +
    div((epyear*682-110),2816) +
    (epyear-1)*365 +
    div(epbase,2820)*1029983 +
    (1948320.5-1); // jdn
}
function jdnToGregorian(jdn){
  let j = jdn + 0.5;
  let z = Math.floor(j), a = z;
  let b = a + 1524, c = Math.floor((b - 122.1)/365.25), d = Math.floor(365.25*c),
      e = Math.floor((b - d)/30.6001);
  let day = b - d - Math.floor(30.6001*e);
  let month = (e < 14) ? e - 1 : e - 13;
  let year  = (month > 2) ? c - 4716 : c - 4715;
  return {gy: year, gm: month, gd: day};
}
function gregorianToJDN(gy,gm,gd){
  let a = div(14-gm,12);
  let y = gy + 4800 - a;
  let m = gm + 12*a - 3;
  return gd + div(153*m+2,5) + 365*y + div(y,4) - div(y,100) + div(y,400) - 32045;
}
function toGregorian(jy,jm,jd){
  const jdn = jalaliToJDN(jy,jm,jd);
  return jdnToGregorian(jdn);
}
function toJalali(gy,gm,gd){
  const jdn = gregorianToJDN(gy,gm,gd);
  let depoch  = jdn - jalaliToJDN(475,1,1);
  let cycle   = Math.floor(depoch / 1029983);
  let cyear   = depoch % 1029983;
  let ycycle;
  if (cyear === 1029982){ ycycle = 2820; }
  else{
    let aux1 = Math.floor(cyear/366);
    let aux2 = cyear % 366;
    ycycle = Math.floor((2134*aux1 + 2816*aux2 + 2815)/1028522) + aux1 + 1;
  }
  let jy = ycycle + 2820*cycle + 474;
  if (jy <= 0) jy--;
  let yday = jdn - jalaliToJDN(jy,1,1) + 1;
  let jm = (yday <= 186) ? Math.ceil(yday/31) : Math.ceil((yday-186)/30) + 6;
  let jd = jdn - jalaliToJDN(jy,jm,1) + 1;
  return {jy,jm,jd};
}
function jMonthLength(jy,jm){ return jm<=6?31:(jm<=11?30:(isJLeap(jy)?30:29)); }
function isJLeap(jy){
  return (((jy>0?jy:jy+1)-474)%2820+474+38)*682 % 2816 < 682;
}
/* ------------------ حالت و UI ------------------ */
const monthsEl = document.getElementById('months');
const calendarEl = document.getElementById('calendar');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const gotoTodayBtn = document.getElementById('gotoToday');
const toggleModeBtn = document.getElementById('toggleMode');
const summaryEl = document.getElementById('summary');
const confirmBtn = document.getElementById('confirm');

const departInput = document.getElementById('departInput');
const returnInput = document.getElementById('returnInput');
const toggleReturnBtn = document.getElementById('toggleReturn');

let mode = 'jalali'; // 'jalali' | 'gregorian'
const gToday = new Date();
const jToday = toJalali(gToday.getFullYear(), gToday.getMonth()+1, gToday.getDate());

let startYear = jToday.jy;
let startMonth = jToday.jm;

let selectingReturn = false;
let depart = null;   // {y,m,d, mode:'jalali'|'gregorian'}
let back = null;

function fmtJ(y,m,d){return `${y}/${String(m).padStart(2,'0')}/${String(d).padStart(2,'0')}`;}
function sameDate(a,b){ return a && b && a.y===b.y && a.m===b.m && a.d===b.d && a.mode===b.mode; }
function toGDate(obj){
  if(obj.mode==='jalali'){
    const g = toGregorian(obj.y,obj.m,obj.d);
    return new Date(g.gy, g.gm-1, g.gd);
  }else{
    return new Date(obj.y, obj.m-1, obj.d);
  }
}
function isPast(obj){
  const t = new Date(gToday.getFullYear(), gToday.getMonth(), gToday.getDate());
  return toGDate(obj) < t;
}
function isBetween(obj, a, b){
  if(!a || !b) return false;
  const x = toGDate(obj), s = toGDate(a), e = toGDate(b);
  return x > s && x < e;
}
function isFriday(obj){
  const d = toGDate(obj).getDay(); // 0..6 (0=Sunday)
  return d === 5;
}
const faMonthsJ = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
const faMonthsG = ["ژانویه","فوریه","مارس","آوریل","مه","ژوئن","جولای","اوت","سپتامبر","اکتبر","نوامبر","دسامبر"];
const weekHeads = ["ش","ی","د","س","چ","پ","ج"]; // شنبه..جمعه

function monthData(y,m){
  if(mode==='jalali'){
    const gFirst = toGregorian(y,m,1);
    const firstDate = new Date(gFirst.gy, gFirst.gm-1, gFirst.gd);
    const startWeek = (firstDate.getDay()+1)%7; // شروع با شنبه
    const len = jMonthLength(y,m);
    const days = Array.from({length:startWeek}, ()=>null);
    for(let d=1; d<=len; d++) days.push({y,m,d,mode});
    return days;
  }else{
    const firstDate = new Date(y, m-1, 1);
    const len = new Date(y, m, 0).getDate();
    const startWeek = (firstDate.getDay()+1)%7;
    const days = Array.from({length:startWeek}, ()=>null);
    for(let d=1; d<=len; d++) days.push({y,m,d,mode});
    return days;
  }
}
function render(){
  monthsEl.innerHTML = '';
  for(let i=0;i<2;i++){
    let y = startYear, m = startMonth + i;
    if(mode==='jalali'){
      if(m>12){ m-=12; y++; }
    }else{
      if(m>12){ m-=12; y++; }
    }
    const days = monthData(y,m);
    const monthTitle = (mode==='jalali'?faMonthsJ[m-1]:faMonthsG[m-1]) + ' ' + y;

    const col = document.createElement('div');
    col.className = "w-64";
    const title = document.createElement('div');
    title.className = "text-center font-bold mb-2";
    title.textContent = monthTitle;
    col.appendChild(title);

    const head = document.createElement('div');
    head.className = "grid grid-cols-7 text-center text-sm font-bold mb-2";
    weekHeads.forEach(w=>{
      const el = document.createElement('div');
      el.textContent = w;
      head.appendChild(el);
    });
    col.appendChild(head);

    const grid = document.createElement('div');
    grid.className = "grid grid-cols-7 gap-1 text-center";

    days.forEach(d=>{
      const cell = document.createElement('div');
      if(!d){ grid.appendChild(cell); return; }

      const past = isPast(d);
      const fri = isFriday(d);
      const isDep = sameDate(d, depart);
      const isRet = sameDate(d, back);
      const btw = isBetween(d, depart, back);

      cell.textContent = d.d;
      cell.className =
        "p-2 cursor-pointer " +
        (past ? "text-gray-400 cursor-not-allowed " : "hover:bg-blue-100 ") +
        (fri && !past ? "text-red-500 " : "") +
        (isDep ? "bg-blue-500 text-white " : "") +
        (isRet ? "bg-green-500 text-white " : "") +
        (btw ? "bg-blue-200 " : "");

      if(!past){
        cell.addEventListener('click', ()=>{
          if(!depart || selectingReturn){
            if(!selectingReturn){
              depart = d;
              back = null;
              departInput.value = (mode==='jalali')? fmtJ(d.y,d.m,d.d) : fmtJ(d.y,d.m,d.d);
              returnInput.value = "";
              returnInput.disabled = false;
              toggleReturnBtn.disabled = false;
              toggleReturnBtn.textContent = "+";
              summaryEl.textContent = `رفت — ${departInput.value}`;
            }else{
              back = d;
              returnInput.value = fmtJ(d.y,d.m,d.d);
              selectingReturn = false;
              toggleReturnBtn.textContent = "×";
            }
            render();
          }
        });
      }
      grid.appendChild(cell);
    });

    col.appendChild(grid);
    monthsEl.appendChild(col);
  }

  // دکمه حالت
  toggleModeBtn.textContent = (mode==='jalali') ? "تقویم میلادی" : "تقویم جلالی";
}
function showCalendar(){
  calendarEl.classList.remove('hidden');
  render();
}
function hideCalendar(){ calendarEl.classList.add('hidden'); }

/* تعامل‌ها */
departInput.addEventListener('click', ()=>{ selectingReturn=false; showCalendar(); });
returnInput.addEventListener('click', ()=>{ if(!returnInput.disabled){ selectingReturn=true; showCalendar(); }});
toggleReturnBtn.addEventListener('click', ()=>{
  if(toggleReturnBtn.textContent === "+"){ selectingReturn=true; showCalendar(); }
  else{
    back=null; selectingReturn=false; returnInput.value=""; toggleReturnBtn.textContent="+";
    render();
  }
});
prevBtn.addEventListener('click', ()=>{
  startMonth--; if(startMonth<1){ startMonth=12; startYear--; } render();
});
nextBtn.addEventListener('click', ()=>{
  startMonth++; if(startMonth>12){ startMonth=1; startYear++; } render();
});
gotoTodayBtn.addEventListener('click', ()=>{
  if(mode==='jalali'){ startYear=jToday.jy; startMonth=jToday.jm; }
  else{
    startYear=gToday.getFullYear(); startMonth=gToday.getMonth()+1;
  }
  render();
});
toggleModeBtn.addEventListener('click', ()=>{
  // تغییر حالت و هم‌تراز کردن ماه شروع
  if(mode==='jalali'){
    mode='gregorian';
    startYear=gToday.getFullYear(); startMonth=gToday.getMonth()+1;
  }else{
    mode='jalali';
    startYear=jToday.jy; startMonth=jToday.jm;
  }
  // پاک کردن انتخاب‌ها (می‌تونی نگه‌داری هم بکنی، فعلاً ساده)
  depart=null; back=null; departInput.value=""; returnInput.value=""; returnInput.disabled=true; toggleReturnBtn.disabled=true; toggleReturnBtn.textContent="+";
  summaryEl.textContent = "رفت —";
  render();
});
confirmBtn.addEventListener('click', ()=>{ hideCalendar(); });

document.addEventListener('click', (e)=>{
  if(!calendarEl.contains(e.target) && e.target!==departInput && e.target!==returnInput && e.target!==toggleReturnBtn){
    hideCalendar();
  }
});

// شروع
render();




// انتخاب عناصر
const passengerInputEl = document.getElementById("passengerInput");
const passengerMenu = document.getElementById("passengerMenu");

const adultCountEl = document.getElementById("adultCount");
const childCountEl = document.getElementById("childCount");
const infantCountEl = document.getElementById("infantCount");

const adultMinusBtn = document.getElementById("adultMinus");
const adultPlusBtn = document.getElementById("adultPlus");
const childMinusBtn = document.getElementById("childMinus");
const childPlusBtn = document.getElementById("childPlus");
const infantMinusBtn = document.getElementById("infantMinus");
const infantPlusBtn = document.getElementById("infantPlus");

// باز و بسته شدن منو
passengerInputEl?.addEventListener("click", () => {
  passengerMenu?.classList.toggle("hidden");
});

// تابع آپدیت ورودی
const updatePassengerInput = () => {
  const total =
    parseInt(adultCountEl.textContent) +
    parseInt(childCountEl.textContent) +
    parseInt(infantCountEl.textContent);
  passengerInputEl.value = `${total} مسافر`;
};

// تابع فعال/غیرفعال کردن دکمه منفی
const toggleMinusState = (countElement, minusBtn) => {
  minusBtn.disabled = parseInt(countElement.textContent) === 0;
};

// بزرگسال
adultPlusBtn?.addEventListener("click", () => {
  adultCountEl.textContent = parseInt(adultCountEl.textContent) + 1;
  updatePassengerInput();
  toggleMinusState(adultCountEl, adultMinusBtn);
});

adultMinusBtn?.addEventListener("click", () => {
  if (parseInt(adultCountEl.textContent) > 0) {
    adultCountEl.textContent = parseInt(adultCountEl.textContent) - 1;
    updatePassengerInput();
    toggleMinusState(adultCountEl, adultMinusBtn);
  }
});

// کودک
childPlusBtn?.addEventListener("click", () => {
  childCountEl.textContent = parseInt(childCountEl.textContent) + 1;
  updatePassengerInput();
  toggleMinusState(childCountEl, childMinusBtn);
});

childMinusBtn?.addEventListener("click", () => {
  if (parseInt(childCountEl.textContent) > 0) {
    childCountEl.textContent = parseInt(childCountEl.textContent) - 1;
    updatePassengerInput();
    toggleMinusState(childCountEl, childMinusBtn);
  }
});

// نوزاد
infantPlusBtn?.addEventListener("click", () => {
  infantCountEl.textContent = parseInt(infantCountEl.textContent) + 1;
  updatePassengerInput();
  toggleMinusState(infantCountEl, infantMinusBtn);
});

infantMinusBtn?.addEventListener("click", () => {
  if (parseInt(infantCountEl.textContent) > 0) {
    infantCountEl.textContent = parseInt(infantCountEl.textContent) - 1;
    updatePassengerInput();
    toggleMinusState(infantCountEl, infantMinusBtn);
  }
});
