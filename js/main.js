/* 膠滴滴 官方網站 */
(function () {
  'use strict';

  // ── 訂位網址：要更換時只改這一行 ──
  var BOOK_URL = 'https://reserve.oddle.me/zh_TW/jiaodidi?rwg_token=ALcMQYYJnqq3TZdFd9jXLQqexPcnuYcSFvs4u-CmQ4K50xw2RZ-Jo4KjN7T17nknzJN7nF1wrohTa0O3E4ku7UQhuBMVr-JEFIxYzdxp68JgvoBpB6-Bz-M%3D';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;

  $$('.js-book').forEach(function (a) { a.href = BOOK_URL; });
  var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();
  requestAnimationFrame(function () { body.classList.add('is-ready'); });

  /* 進場 */
  var rvs = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rvs.forEach(function (el) { io.observe(el); });
  } else { rvs.forEach(function (el) { el.classList.add('is-in'); }); }

  /* 金湯：捲動帶動橫移（桌機）；手機為原生橫滑 */
  var hs = $('#broth'), track = $('#hsTrack'), hsBar = $('#hsBar'), over = 0, pinned = false;
  var sizeHs = function () {
    pinned = innerWidth > 960 && !reduce;
    hs.classList.toggle('is-native', !pinned);
    if (pinned) { track.style.transform = ''; over = Math.max(0, track.scrollWidth - innerWidth); hs.style.height = (innerHeight + over) + 'px'; }
    else { hs.style.height = ''; track.style.transform = ''; }
    onScroll();
  };

  /* 頂列與捲動 */
  var top = $('#top'), dock = $('#dock'), ticking = false;
  var onScroll = function () {
    var y = window.scrollY || 0, vh = innerHeight;
    top.classList.toggle('is-solid', y > vh * 0.6);
    if (dock) dock.classList.toggle('is-on', y > vh * 0.7);
    if (pinned) {
      var r = hs.getBoundingClientRect();
      var p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
      track.style.transform = 'translate3d(' + (-p * over) + 'px,0,0)';
      hsBar.style.transform = 'scaleX(' + p + ')';
    }
    ticking = false;
  };
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', sizeHs);
  window.addEventListener('load', sizeHs);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeHs);
  sizeHs();

  /* 海陸套餐 */
  var SETS = {
    shrimp: { name: '蝦蝦海陸套餐', img: 'img/set_shrimp.jpg', p: ['2,250', '3,350', '4,250'], desc: '白蝦、天使紅蝦，佐以鯛魚、鱸魚、鮮蚵與蛤蜊。' },
    fish:   { name: '烤魚海陸套餐', img: 'img/set_fish.jpg',   p: ['2,650', '3,850', '4,850'], desc: '整尾烤魚，配白蝦、鯛魚、鱸魚、小卷、鮮蚵與蛤蜊。' },
    thai:   { name: '泰國蝦海陸套餐', img: 'img/set_thai.jpg', p: ['2,650', '3,850', '4,850'], desc: '鹽烤泰國蝦，配白蝦、鯛魚、鱸魚、鮮蚵、小卷與蛤蜊。' },
    prawn:  { name: '明蝦海陸套餐', img: 'img/set_prawn.jpg',  p: ['2,750', '3,950', '5,200'], desc: '碩大明蝦，配白蝦、鯛魚、鱸魚、鮮蚵、小卷與蛤蜊。' },
    crab:   { name: '爆蛋大螃蟹海陸套餐', img: 'img/set_crab.jpg', p: ['4,350', '5,900', '8,200'], desc: '整隻爆蛋大螃蟹，配鯛魚、鱸魚、鮮蚵、小卷與蛤蜊。' }
  };
  var items = $$('#setList li'), img = $('#setImg'), detail = $('#setDetail'), cur = '', swapT;
  var fill = function (d) {
    img.src = d.img; img.alt = d.name;
    $('#setDesc').textContent = d.desc;
    $('#p2').textContent = d.p[0]; $('#p3').textContent = d.p[1]; $('#p4').textContent = d.p[2];
  };
  var showSet = function (key, instant) {
    var d = SETS[key]; if (!d || key === cur) return; cur = key;
    items.forEach(function (li) { var on = li.getAttribute('data-set') === key; li.classList.toggle('is-on', on); li.setAttribute('aria-pressed', on); });
    if (instant || reduce) { fill(d); return; }
    img.classList.add('is-out'); detail.classList.add('is-out');
    clearTimeout(swapT);
    swapT = setTimeout(function () { fill(SETS[cur]); img.classList.remove('is-out'); detail.classList.remove('is-out'); }, 260);
  };
  items.forEach(function (li) {
    li.setAttribute('tabindex', '0'); li.setAttribute('role', 'button');
    var go = function () { showSet(li.getAttribute('data-set')); };
    li.addEventListener('click', go);
    li.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
  showSet('shrimp', true);
  Object.keys(SETS).forEach(function (k) { var i = new Image(); i.src = SETS[k].img; });

  /* 賓客回饋：靜靜輪替 */
  (function () {
    var qs = $$('#voiceStage blockquote'), i = 0;
    if (qs.length < 2 || reduce) return;
    setInterval(function () { qs[i].classList.remove('is-on'); i = (i + 1) % qs.length; qs[i].classList.add('is-on'); }, 6000);
  })();

  /* 完整菜單 */
  (function () {
    var files = ['16', '12', '14', '11', '13', '10', '06', '07', '09', '08', '05', '04'].map(function (n) { return 'img/menu_ig_' + n + '.jpg'; });
    var lb = $('#lb'), pic = $('#lbImg'), now = $('#lbNow'), i = 0, opener;
    $('#lbAll').textContent = files.length;
    var show = function (k) { i = (k + files.length) % files.length; pic.src = files[i]; pic.alt = '菜單第 ' + (i + 1) + ' 頁'; now.textContent = i + 1; };
    var open = function () { opener = document.activeElement; lb.hidden = false; body.classList.add('no-scroll'); show(0); $('#lbClose').focus(); };
    var close = function () { lb.hidden = true; body.classList.remove('no-scroll'); if (opener) opener.focus(); };
    $('#openMenu').addEventListener('click', open);
    $('#lbClose').addEventListener('click', close);
    $('#lbPrev').addEventListener('click', function () { show(i - 1); });
    $('#lbNext').addEventListener('click', function () { show(i + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
    });
  })();

  /* 主視覺：流動的金湯 */
  (function () {
    var cv = $('#gl'), hero = $('#hero'); if (!cv) return;
    var gl = !reduce && cv.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) { cv.classList.add('is-fallback'); return; }
    var vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var fs = [
      'precision highp float;',
      'uniform vec2 r;uniform float t;uniform vec2 m;',
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
      'return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
      'float fbm(vec2 p){float v=0.,a=.5;mat2 R=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){v+=a*n(p);p=R*p*2.02;a*=.5;}return v;}',
      'void main(){',
      ' vec2 uv=gl_FragCoord.xy/r; vec2 p=(gl_FragCoord.xy-.5*r)/r.y;',
      ' p+=(m-.5)*.12;',
      ' float tt=t*.04;',
      ' vec2 q=vec2(fbm(p*1.3+vec2(0.,tt)),fbm(p*1.3+vec2(5.2,1.3)-tt));',
      ' vec2 w=vec2(fbm(p*1.3+3.2*q+vec2(1.7,9.2)+tt),fbm(p*1.3+3.2*q+vec2(8.3,2.8)-tt));',
      ' float f=fbm(p*1.3+3.*w);',
      ' vec3 c=vec3(.030,.024,.018);',
      ' c=mix(c,vec3(.22,.125,.035),smoothstep(.3,.75,f));',
      ' c=mix(c,vec3(.62,.43,.15),pow(smoothstep(.5,.9,f),2.4)*.6);',
      ' c*=mix(.12,1.,smoothstep(1.15,.2,length((uv-.5)*vec2(1.1,1.4))));',
      ' c+=(h(gl_FragCoord.xy+t)-.5)*.012;',
      ' gl_FragColor=vec4(c,1.);}'
    ].join('\n');
    var mk = function (type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
    var a = mk(gl.VERTEX_SHADER, vs), b = mk(gl.FRAGMENT_SHADER, fs);
    if (!a || !b) { cv.classList.add('is-fallback'); return; }
    var pg = gl.createProgram(); gl.attachShader(pg, a); gl.attachShader(pg, b); gl.linkProgram(pg);
    if (!gl.getProgramParameter(pg, gl.LINK_STATUS)) { cv.classList.add('is-fallback'); return; }
    gl.useProgram(pg);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pg, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uR = gl.getUniformLocation(pg, 'r'), uT = gl.getUniformLocation(pg, 't'), uM = gl.getUniformLocation(pg, 'm');
    var mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5, visible = true;
    var size = function () {
      var s = Math.min(window.devicePixelRatio || 1, 1.5) * 0.8;
      cv.width = Math.floor(cv.clientWidth * s); cv.height = Math.floor(cv.clientHeight * s);
      gl.viewport(0, 0, cv.width, cv.height);
    };
    size(); window.addEventListener('resize', size);
    hero.addEventListener('pointermove', function (e) { tx = e.clientX / innerWidth; ty = 1 - e.clientY / innerHeight; }, { passive: true });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(hero);
    var t0 = performance.now();
    (function draw(now) {
      if (visible) {
        mx += (tx - mx) * 0.03; my += (ty - my) * 0.03;
        gl.uniform2f(uR, cv.width, cv.height); gl.uniform1f(uT, (now - t0) / 1000); gl.uniform2f(uM, mx, my);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      requestAnimationFrame(draw);
    })(t0);
  })();
})();
