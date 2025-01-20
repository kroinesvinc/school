
var blends = new Array();
window.setInterval("calculateBlends()",50);

function cancelBubbleClick(event){
 if (window.event) window.event.cancelBubble = true; 
 else {event.stopPropagation();event.cancelBubble=true;}
 
 return true;
}

function blendInShopItem(t){
 if (!!("ontouchstart" in window) || !!('onmsgesturechange' in window)) {
  t.onmouseout = null;
  t.onmouseover = null;
 }
 var childs = t.getElementsByTagName("div");
 var i1 = null;
 var i2 = null;
 var i3 = null;
 for(var i=0; i < childs.length; i++){
  if(childs[i].className == "shopIteminner") i1 = childs[i];
  if(childs[i].className == "shopIteminner2") i2 = childs[i];
  if(childs[i].className == "shopItemInnerData") i3 = childs[i];
 }
 if(i1 && i2){
  var c = getCurrentBlend(i2);
  if(c == 0 && i3) setTimeout(function(){ startBlend(i3,0,100);},1000);
  startBlend(i1,100,0);
  startBlend(i2,0,100);
  if(c == 0){
    $(".shopItemButton",t).hide();
    setTimeout(function(){ $(".shopItemButton",t).show(); },350);
  }
 }
}

function blendOutShopItem(t){
 var childs = t.getElementsByTagName("div");
 var i1 = null;
 var i2 = null;
 var i3 = null;
 for(var i=0; i < childs.length; i++){
  if(childs[i].className == "shopIteminner") i1 = childs[i];
  if(childs[i].className == "shopIteminner2") i2 = childs[i];
  if(childs[i].className == "shopItemInnerData") i3 = childs[i];
 }
 if(i1 && i2){
  startBlend(i2,100,0);
  startBlend(i1,0,100);
  if(i3)
  setTimeout(function(){ var c = getCurrentBlend(i2); if(c < 80) startBlend(i3,100,0);},1000);
 }
}

function getCurrentBlend(e){
 for(var i = 0; i < blends.length; i++){
  if(blends[i].e == e){
   return blends[i].current;
  }
 }
 return (e.style.opacity)*100;
}

function startBlend(e,from,to){
 for(var i = 0; i < blends.length; i++){
  if(blends[i].e == e){
   blends[i].to = to;
   return;
  }
 }
 setOpacity(e,from);
 var blend = new Object();
 blend.e = e;
 blend.from = from;
 blend.current = from;
 blend.to = to;
 blends.push(blend);
}

function calculateBlends(){
 for(var i = 0; i < blends.length; i++){
  if(blends[i].current == blends[i].to){
   // blend done, delete it
   blends.splice(i,1);
   i--;
   continue;
  }  
  if(blends[i].current > blends[i].to)
   blends[i].current -= 20;
  else
   blends[i].current += 20;

  setOpacity(blends[i].e,blends[i].current);
 }
}

function setOpacity(e,value) {
 if(value == 0) e.style.display = "none"; else e.style.display = "block";
 e.style.opacity = value/100;
 e.style.filter = 'alpha(opacity=' + value + ')';
}
