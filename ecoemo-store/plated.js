// ─────────────────────────────────────────────────────────────────────────────
// PLATED — product photography on an obsidian studio plate.
//
// Chris, Nov 15 2026: "the black rectangle looks bad either removed background or
// paste on black to be a little MORE appealing."
//
// Every Printify mockup is shot on a pure white 1200px studio background, which on a
// near-black page reads as a bright white slab in the middle of the card. This script
// reproduces the studio trick: load the mockup with CORS, flood-fill the white studio
// background in from the edges (edge-connected only, so a white mug or cream garment
// keeps its body), composite the product onto #0b0b0d, and swap that plate in. Lazy,
// two at a time, and silent on failure so a broken CORS response can never take the
// original image away.
// ─────────────────────────────────────────────────────────────────────────────

export const PLATED = '<style id="ee-plated-css">' +
  '.ee-plated{background:#0b0b0d}' +
  '</style>' +
  '<script>(function(){' +
  'if(window.__eePlated)return;window.__eePlated=1;' +
  'var MIN=228,TOL=18,MAXW=900;' +
  'function bgish(d,p){var r=d[p],g=d[p+1],b=d[p+2];' +
  'if(r<MIN||g<MIN||b<MIN)return false;' +
  'var mx=Math.max(r,g,b),mn=Math.min(r,g,b);return mx-mn<=TOL;}' +
  'function plate(off){' +
  'var sw=off.naturalWidth||1200,sh=off.naturalHeight||1200;' +
  'var k=Math.min(1,MAXW/sw);var w=Math.round(sw*k),h=Math.round(sh*k);' +
  'var c=document.createElement("canvas");c.width=w;c.height=h;' +
  'var x=c.getContext("2d");x.drawImage(off,0,0,w,h);' +
  'var id=x.getImageData(0,0,w,h),d=id.data;' +
  'var seen=new Uint8Array(w*h),stack=new Int32Array(w*h),sp=0;' +
  'function seed(i){if(!seen[i]){seen[i]=1;stack[sp++]=i;}}' +
  'for(var i=0;i<w;i++){seed(i);seed((h-1)*w+i);}' +
  'for(var j=0;j<h;j++){seed(j*w);seed(j*w+w-1);}' +
  'while(sp>0){var idx=stack[--sp],p=idx*4;' +
  'if(!bgish(d,p))continue;' +
  'd[p+3]=0;' +
  'var cx=idx%w,cy=(idx-cx)/w;' +
  'if(cx>0)seed(idx-1);if(cx<w-1)seed(idx+1);if(cy>0)seed(idx-w);if(cy<h-1)seed(idx+w);}' +
  'x.putImageData(id,0,0);' +
  'var out=document.createElement("canvas");out.width=w;out.height=h;' +
  'var o=out.getContext("2d");' +
  'o.fillStyle="#0b0b0d";o.fillRect(0,0,w,h);' +
  'var g=o.createRadialGradient(w/2,h*0.42,Math.min(w,h)*0.05,w/2,h*0.5,Math.max(w,h)*0.78);' +
  'g.addColorStop(0,"rgba(30,77,54,.20)");g.addColorStop(.55,"rgba(17,18,21,0)");g.addColorStop(1,"rgba(7,7,9,.55)");' +
  'o.fillStyle=g;o.fillRect(0,0,w,h);' +
  'o.drawImage(c,0,0);' +
  'return out;}' +
  'function run(img){' +
  'if(img.dataset.plating)return;img.dataset.plating="1";' +
  'var src=img.getAttribute("src")||"";' +
  'if(src.indexOf("images-api.printify.com")<0)return;' +
  'var r=img.getBoundingClientRect?img.getBoundingClientRect():null;' +
  'var vh=window.innerHeight||800;' +
  'if(r&&(r.top>vh*1.6||r.bottom<-vh*0.6)){delete img.dataset.plating;return;}' +
  'if(img.parentNode)img.parentNode.classList.add("ee-plated");' +
  'var off=new Image();off.crossOrigin="anonymous";' +
  'off.onload=function(){' +
  'try{' +
  'var out=plate(off);' +
  'var done=function(u){img.src=u;img.removeAttribute("srcset");};' +
  'if(out.toBlob){out.toBlob(function(b){if(b)done(URL.createObjectURL(b));},"image/jpeg",0.9);}' +
  'else{done(out.toDataURL("image/jpeg",0.9));}' +
  '}catch(e){}};' +
  'off.onerror=function(){};' +
  'off.src=src;}' +
  'var q=[],busy=0;' +
  'function pump(){while(busy<2&&q.length){busy++;run(q.shift());setTimeout(function(){busy--;pump();},70);}}' +
  'function collect(){' +
  'var imgs=document.querySelectorAll("img");' +
  'for(var i=0;i<imgs.length;i++){' +
  'var im=imgs[i];' +
  'if(im.dataset.plating)continue;' +
  'if((im.getAttribute("src")||"").indexOf("images-api.printify.com")<0)continue;' +
  'q.push(im);}}' +
  'function start(){' +
  'collect();pump();' +
  'try{new MutationObserver(function(){collect();pump();}).observe(document.body,{childList:true,subtree:true});}catch(e){}' +
  'setInterval(function(){collect();pump();},1500);}' +
  'if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);' +
  'else start();' +
  '})();</script>';
