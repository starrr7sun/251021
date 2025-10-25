// by SamuelYAN
// more works //
// https://twitter.com/SamuelAnn0924
// https://www.instagram.com/samuel_yan_1990/

// genuary25
// JAN. 17. (credit: Roni Kaufman)
// What happens if pi=4?

let mySize;

// a shader variable
let theShader;

function preload(){
	theShader = new p5.Shader(this.renderer,vert,frag)
}

function setup() {
	mySize = min(windowWidth, windowHeight)*1.0;
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  // createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  // Create a full-height left slide-out menu using p5 DOM (entirely in sketch.js)
  const menu = createDiv();
  menu.id('leftSlideMenu');
  menu.style('position', 'absolute');
  menu.style('left', '-90px'); // hidden except 10px (so it's off-screen initially)
  menu.style('top', '0px');
  menu.style('height', '100%');
  menu.style('width', '100px');
  // white with 50% opacity
  menu.style('background', 'rgba(255,255,255,0.5)');
  menu.style('padding', '12px 8px');
  menu.style('box-sizing', 'border-box');
  menu.style('font-family', 'sans-serif');
  menu.style('z-index', '20');
  // ensure menu stays above overlay when open
  menu.style('z-index', '2000');
  menu.style('transition', 'left 200ms ease');

  // Menu container for items (vertical layout)
  const menuInner = createDiv();
  menuInner.parent(menu);
  menuInner.style('display', 'flex');
  menuInner.style('flex-direction', 'column');
  menuInner.style('align-items', 'flex-start');
  menuInner.style('height', '100%');
  menuInner.style('justify-content', 'flex-start');
  menuInner.style('padding-top', '20px');

  // Menu items
  const items = ['單元一作業', '單元一筆記', '關閉視窗'];
  items.forEach((label, i) => {
    const item = createDiv(label);
    item.parent(menuInner);
    item.style('color', '#000000');
    item.style('font-size', '16px');
    item.style('padding', '10px 8px');
    item.style('width', '100%');
    item.style('box-sizing', 'border-box');
    item.style('cursor', 'pointer');
    // hover effect
    item.mouseOver(() => {
      item.style('color', '#000000');
      item.style('background', 'rgba(0,0,0,0.04)');
    });
    item.mouseOut(() => {
      item.style('color', '#000000');
      item.style('background', 'transparent');
    });
    item.mousePressed(() => {
      console.log(label + ' clicked');
      // Open URLs for specific items inside iframe overlay
      if (label === '單元一作業') {
        openOverlayWithURL('https://starrr7sun.github.io/251014_2/');
      } else if (label === '單元一筆記') {
        openOverlayWithURL('https://hackmd.io/@teDfc_ZHRUuqk3jgyybMwA/Sk2B3q9Agg');
      } else {
        // 作品三: close overlay
        closeOverlay();
      }
    });
  });

  // Track menu and window so we can update on resize and mouse move
  window._p5LeftMenu = { el: menu };

  // Create overlay + iframe (hidden by default)
  const overlay = createDiv();
  overlay.id('p5IframeOverlay');
  overlay.style('position', 'fixed');
  overlay.style('left', '0');
  overlay.style('top', '0');
  overlay.style('width', '100%');
  overlay.style('height', '100%');
  overlay.style('background', 'rgba(0,0,0,0.6)');
  overlay.style('display', 'none');
  overlay.style('align-items', 'center');
  overlay.style('justify-content', 'center');
  overlay.style('z-index', '1000');

  // Inner container for iframe to control size
  const iframeContainer = createDiv();
  iframeContainer.parent(overlay);
  iframeContainer.style('width', '80%');
  iframeContainer.style('height', '80%');
  iframeContainer.style('background', '#ffffff');
  iframeContainer.style('box-shadow', '0 10px 40px rgba(0,0,0,0.5)');
  iframeContainer.style('position', 'relative');
  iframeContainer.style('z-index', '1010');

  // Close button
  const closeBtn = createButton('✕');
  closeBtn.parent(iframeContainer);
  closeBtn.style('position', 'absolute');
  closeBtn.style('right', '8px');
  closeBtn.style('top', '8px');
  closeBtn.style('z-index', '1100');
  closeBtn.style('background', 'transparent');
  closeBtn.style('border', 'none');
  closeBtn.style('font-size', '20px');
  closeBtn.style('cursor', 'pointer');
  closeBtn.mousePressed(() => closeOverlay());

  // iframe element
  const iframe = createElement('iframe');
  iframe.parent(iframeContainer);
  iframe.attribute('frameborder', '0');
  iframe.style('width', '100%');
  iframe.style('height', '100%');

  // expose overlay controls globally
  window._p5IframeOverlay = {
    overlayEl: overlay,
    iframeEl: iframe,
    open: function(url) {
      iframe.attribute('src', url);
      overlay.style('display', 'flex');
    },
    close: function() {
      iframe.attribute('src', '');
      overlay.style('display', 'none');
    }
  };

  function openOverlayWithURL(url) {
    if (window._p5IframeOverlay) window._p5IframeOverlay.open(url);
  }

  function closeOverlay() {
    if (window._p5IframeOverlay) window._p5IframeOverlay.close();
  }

  // close overlay on ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOverlay();
  });
}

function draw() {  
  // shader() sets the active shader with our shader
  shader(theShader);
  
  theShader.setUniform("u_resolution", [width, height]);
	theShader.setUniform("u_time", millis() / 1000.0); 
  theShader.setUniform("u_frame", frameCount/1.0);
  theShader.setUniform("", [mouseX/100.0, map(mouseY, 0, height, height, 0)/100.0]);

  // rect gives us some geometry on the screen
  rect(0,0,width, height);

  // Slide-out menu behavior: if mouse is within 100px of left edge, slide in
  try {
    const menuObj = window._p5LeftMenu;
    if (menuObj && menuObj.el) {
      // Use mouseX from p5; when mouseX is undefined (e.g., outside canvas), fallback to 9999
      const mx = (typeof mouseX === 'number') ? mouseX : 9999;
      if (mx < 100) {
        menuObj.el.style('left', '0px');
      } else {
        // hide mostly off-screen; width 100, so left -90 keeps 10px visible
        menuObj.el.style('left', '-90px');
      }
    }
  } catch (e) {
    // don't break the sketch if DOM not present
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
