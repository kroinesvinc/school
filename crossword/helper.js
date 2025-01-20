//////////////////////////////////////////////////////////////////////////////////
if (typeof AppClientServerProtocol === "undefined") {
 AppClientServerProtocol = "";
}
//////////////////////////////////////////////////////////////////////////////////
if (!Array.prototype.indexOf) {
 // ie8 fix
 Array.prototype.indexOf = function(obj, start) {
     for (var i = (start || 0), j = this.length; i < j; i++) {
         if (this[i] === obj) { return i; }
     }
     return -1;
 }
}
//////////////////////////////////////////////////////////////////////////////////
function stopEvent(e) {
 if(!e) var e = window.event;
 e.cancelBubble = true;
 e.returnValue = false;
 
 if ( e.stopPropagation ) e.stopPropagation();
 if ( e.preventDefault ) e.preventDefault();		
 return false;
}
//////////////////////////////////////////////////////////////////////////////////
function openTargetURL(url){
  if(window.event && 
    (window.event.shiftKey || window.event.ctrlKey || window.event.metaKey)){
    window.open(url, "_blank");
  }else{
    pageLoadDisplay();
    window.location.href = url;
  }
}
//////////////////////////////////////////////////////////////////////////////////
function openNextSibling(e){
 var elem = e;
 do {
  elem = elem.nextSibling;
 } while (elem && elem.nodeType != 1);
 if(elem) elem.style.display = "block";
}
//////////////////////////////////////////////////////////////////////////////////
function openPreviousSibling(e){
 var elem = e;
 do {
  elem = elem.previousSibling;
 } while (elem && elem.nodeType != 1);
 if(elem) elem.style.display = "block";
}
//////////////////////////////////////////////////////////////////////////////////
function hideParentNode(e){
 if(e && e.parentNode) e.parentNode.style.display = "none";
}
//////////////////////////////////////////////////////////////////////////////////
var loadScriptStack = [];
var loadScriptStackLoading = false;
var loadScriptStackWorkerInterval = null;
function loadScript(sURL, onLoad) {
  loadScriptStack.push({url:sURL, callback:onLoad});
  if(loadScriptStackWorkerInterval == null){
     loadScriptStackWorkerInterval = setInterval(loadScriptStackWorker,10);
  }
}

function loadScriptStackWorker() {
  var body = document.getElementsByTagName("body");
  if (body.length == 0) return;

  if(loadScriptStackLoading) return; // still one file loading

  if(loadScriptStack.length == 0 && loadScriptStackWorkerInterval != null){
   clearInterval(loadScriptStackWorkerInterval);
   loadScriptStackWorkerInterval = null;
   return;
  }

  var s = loadScriptStack.shift();

  function loadScriptHandler() {
    var rs = this.readyState;
    if (rs == 'loaded' || rs == 'complete') {
      this.onreadystatechange = null;
      this.onload = null;
      s.callback();
      loadScriptStackLoading = false;
    }
  }

  var oS = document.createElement('script');
  oS.type = 'text/javascript';
  oS.onreadystatechange = loadScriptHandler;
  oS.onload = function(){
     this.onreadystatechange = null;
     this.onload = null;
     if (s.callback) window.setTimeout(s.callback,20);
     loadScriptStackLoading = false;
    };
  
  loadScriptStackLoading = true;
  oS.src = s.url;
  document.body.appendChild(oS);
}
//////////////////////////////////////////////////////////////////////////////////
function loadCSS(sURL, onLoad, withBody) {
  function loadCSSHandler() {
    var rs = this.readyState;
    if (rs == 'loaded' || rs == 'complete') {
      this.onreadystatechange = null;
      this.onload = null;
      if (onLoad) {
        onLoad();
      }
    }
  }

  function CSSOnload() {
    this.onreadystatechange = null;
    this.onload = null;
    window.setTimeout(onLoad,20);
  }

  var oS = document.createElement('link');
  oS.type = 'text/css';
  oS.rel = 'stylesheet';
  if (onLoad) {
    oS.onreadystatechange = loadCSSHandler;
    oS.onload = CSSOnload;
  }
  oS.href = sURL;
  var heads = document.getElementsByTagName("head");
  var bodys = document.getElementsByTagName("body");
  if(heads.length > 0 && (!withBody || bodys.length > 0))
     heads[0].appendChild(oS); else setTimeout(function(){loadCSS(sURL, onLoad, withBody);} ,50);
}
//////////////////////////////////////////////////////////////////////////////////
function loadCSSString(t,withBody,prepend){
  var oS = document.createElement('style');
  oS.type = 'text/css';
  if (oS.styleSheet){
    oS.styleSheet.cssText = t;
  } else {
    oS.appendChild(document.createTextNode(t));
  }
   
  var heads = document.getElementsByTagName("head");
  var bodys = document.getElementsByTagName("body");
  if(heads.length > 0 && (!withBody || bodys.length > 0)){
    if(prepend && heads[0].childNodes.length > 0)
     heads[0].insertBefore(oS,heads[0].childNodes[0]); 
    else
     heads[0].appendChild(oS); 
  } else setTimeout(function(){loadCSSString(t,withBody);} ,50);
}

//////////////////////////////////////////////////////////////////////////////////
var autoTextArea_List = new Array();

function refreshAutoExpandTextareas(){
 for(var i=0; i < autoTextArea_List.length; i++){
  autoTextArea_List[i].resize(autoTextArea_List[i].element);
 }
}

function makeAutoExpandTextarea(id){
 var t = document.getElementById(id);
 if(!t) {setTimeout(function(){makeAutoExpandTextarea(id);},10); return; }

 // check if already in list
 for(var i=0; i < autoTextArea_List.length; i++){
  if(autoTextArea_List[i].element == t) {
   autoTextArea_List[i].resize(autoTextArea_List[i].element);
   return;
  }
 }

 var offset= !window.opera ? (t.offsetHeight - t.clientHeight) : (t.offsetHeight + parseInt(window.getComputedStyle(t, null).getPropertyValue('border-top-width'))) ;
 t.style.overflow = "hidden";
 var resize = function(t) {
  var dy = t.offsetHeight - t.clientHeight;
  t.style.height = (27-dy)+'px';
  if(t.scrollHeight > 0) 
     t.style.height = (t.scrollHeight  + offset ) + 'px';	
 };
 autoTextArea_List.push({element:t, resize:resize});
 setTimeout(function(){resize(t);},100);
 setTimeout(function(){resize(t);},1000);
 t.addEventListener && t.addEventListener('input', function(event) {resize(t);});
 t.addEventListener && t.addEventListener('keyup', function(event) {resize(t);});
 t['attachEvent'] && t.attachEvent('onkeyup', function() {resize(t);});
}
//////////////////////////////////////////////////////////////////////////////////
function browserSupportsFixed() {
  var container = document.body;
  if (document.createElement &&
      container && container.appendChild && container.removeChild) {
      var el = document.createElement("div");
      if (!el.getBoundingClientRect) {
          return null;
      }
      el.innerHTML = "x";
      el.style.cssText = "position:fixed;top:100px;";
      container.appendChild(el);
      var originalHeight = container.style.height, originalScrollTop = container.scrollTop;
      container.style.height = "3000px";
      container.scrollTop = 500;
      var elementTop = el.getBoundingClientRect().top;
      container.style.height = originalHeight;
      var isSupported = elementTop === 100;
      container.removeChild(el);
      container.scrollTop = originalScrollTop;
      return false; // isSupported;
  }
  return null;
}
//////////////////////////////////////////////////////////////////////////////////
function htmlEncode(source) {
	var result = source;
	result = result.replace(/\n/g,'<br/>');
	result = result.replace(/\&/g,'&amp;');
	result = result.replace(/\</g,'&lt;');
	result = result.replace(/\>/g,'&gt;');
	result = result.replace(new RegExp('"','g'), '&quot;');
	return result;
}
//////////////////////////////////////////////////////////////////////////////
function getFlexApp(movieName) {
  if (navigator.appName.indexOf("Microsoft Internet")==-1)
  {
    if (document.embeds && document.embeds[movieName])
      return document.embeds[movieName]; 
  }

  if (navigator.appName.indexOf("Microsoft Internet")!=-1)
  return document.getElementById(movieName);

  if (window.document[movieName]) 
  {
      return window.document[movieName];
  }

  return document.getElementById(movieName);
}
//////////////////////////////////////////////////////////////////////////////
function addEvent(el, eType, fn, uC) {
	if (el.addEventListener) {
		el.addEventListener(eType, fn, uC);
		return true;
	} else if (el.attachEvent) {
		return el.attachEvent('on' + eType, fn);
	} else {
		el['on' + eType] = fn;
	}
} 
//////////////////////////////////////////////////////////////////////////////
function getIFrameHeight(){
    var height = document.body.scrollHeight;
    var c = document.body.offsetHeight;
    if(c && c < height) height = c;

    return parseInt(height);
}
//////////////////////////////////////////////////////////////////////////////
function getURLParam(strParamName){
 var strReturn = "";
 strParamName = strParamName.toLowerCase();
 var strHref = window.location.href;
 if ( strHref.indexOf("?") > -1 ){
  var strQueryString = strHref.substr(strHref.indexOf("?")+1);
  var a = strQueryString.split("&");
  for ( var i = 0; i < a.length; i++ ){
   var b = a[i].split("=");
   if (b[0].toLowerCase() == strParamName){
    strReturn = b[1];
    break;
   }
  }
 }
 return strReturn;
}
//////////////////////////////////////////////////////////////////////////////
function getYouTubeID(u){
  u = u.split("/");
  u = u[u.length-1];
  if(u.indexOf("?")>= 0){
    if(u.indexOf("v=") >= 0){
      u = u.split("?");
      u = u[1];
      u = u.split("&");
      for(var i=0; i< u.length; i++){
        var d = u[i];
        d = d.split("=");
        if(d[0] == "v") return d[1];
      }
    }else{
      u = u.split("?");
      return u[0];
    }
  }else{
    return u;
  }
  return "";
}
//////////////////////////////////////////////////////////////////////////////
function timeToSeconds(s){
    if(s == "" || s == undefined) return 0;
    s = s.replace(".",":");
    var ta = s.split(":");
    t = 0;
    for(var i=0; i < ta.length; i++){
     while(ta[i] != "" && ta[i][0] == "0") ta[i] = ta[i].substring(1);
     if(ta[i] == "") ta[i] = "0";
    }
    if(ta.length == 3){
       t += parseInt(ta[0])*60*60;
       t += parseInt(ta[1])*60;
       t += parseInt(ta[2]);
    }
    if(ta.length == 2){
       t += parseInt(ta[0])*60;
       t += parseInt(ta[1]);
    }
    if(ta.length == 1){
       t += parseInt(ta[0]);
    }
    return t;
}
//////////////////////////////////////////////////////////////////////////////
function secondsToTime(i){
 return ((i - i % 60)/60)+":"+(i % 60 < 10 ? "0":"")+(i % 60);
}
//////////////////////////////////////////////////////////////////////////////
function trim(str, chars) {
 return ltrim(rtrim(str, chars), chars);
}

function ltrim(str, chars) {
 chars = chars || "\\s";
 return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
 
function rtrim(str, chars) {
 chars = chars || "\\s";
 return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}
//////////////////////////////////////////////////////////////////////////////
var textToSpeechAudioCounter = -3;
var soundManagerReady = false;
var textToSpeechHtml5 = false;

function soundManagerReadyCallback(){
 if(textToSpeechAudioCounter == -1) return; // already on the way
 textToSpeechAudioCounter = -1; 
 soundManager.setup({
  url: AppClientServerProtocol+'//learningapps.org/text-to-speech/',
  debugMode : false,
  noSWFCache: true,
  useHTML5Audio: true,
  preferFlash: false, //!textToSpeechHtml5,
  flashLoadTimeout:0,
  onready: function() {
   soundManagerReady = true;	
   textToSpeechAudioCounter = 0; 
  },
  ontimeout: function() {
   soundManagerReady = true;	
   textToSpeechAudioCounter = 0; 
  }
 });
 setTimeout(function(){ 
   soundManager.beginDelayedInit();
 },500);
}

window.speechSynthesisVoices = [ // default voices - ios hack
  { name: "Zuzana", voiceURI: "com.apple.ttsbundle.Zuzana-compact", lang: "cs-CZ", localService: true, "default": true },
  { name: "Anna", voiceURI: "com.apple.ttsbundle.Anna-compact", lang: "de-DE", localService: true, "default": true },
  { name: "Daniel", voiceURI: "com.apple.ttsbundle.Daniel-compact", lang: "en-GB", localService: true, "default": true },
  { name: "Samantha (Enhanced)", voiceURI: "com.apple.ttsbundle.Samantha-premium", lang: "en-US", localService: true, "default": true },
  { name: "Samantha", voiceURI: "com.apple.ttsbundle.Samantha-compact", lang: "en-US", localService: true, "default": true },
  { name: "Monica", voiceURI: "com.apple.ttsbundle.Monica-compact", lang: "es-ES", localService: true, "default": true },
  { name: "Thomas", voiceURI: "com.apple.ttsbundle.Thomas-compact", lang: "fr-FR", localService: true, "default": true },
  { name: "Mariska", voiceURI: "com.apple.ttsbundle.Mariska-compact", lang: "hu-HU", localService: true, "default": true },
  { name: "Alice", voiceURI: "com.apple.ttsbundle.Alice-compact", lang: "it-IT", localService: true, "default": true },
  { name: "Xander", voiceURI: "com.apple.ttsbundle.Xander-compact", lang: "nl-NL", localService: true, "default": true },
  { name: "Zosia", voiceURI: "com.apple.ttsbundle.Zosia-compact", lang: "pl-PL", localService: true, "default": true },
  { name: "Joana", voiceURI: "com.apple.ttsbundle.Joana-compact", lang: "pt-PT", localService: true, "default": true },
  { name: "Milena", voiceURI: "com.apple.ttsbundle.Milena-compact", lang: "ru-RU", localService: true, "default": true },
  { name: "Yelda", voiceURI: "com.apple.ttsbundle.Yelda-compact", lang: "tr-TR", localService: true, "default": true }
];
window.speechSynthesisVoicesSet = false;

function getSpeechSynthesisVoices() {
  if(typeof speechSynthesis == "undefined") return;
  if(window.speechSynthesisVoicesSet) return;
  var v = speechSynthesis.getVoices(); 
  if(v.length > 0) {
    window.speechSynthesisVoices = v;
    window.speechSynthesisVoicesSet = true;
  }else
    setTimeout(getSpeechSynthesisVoices,200);
}
getSpeechSynthesisVoices();

function textToSpeechInit(){
 if(textToSpeechAudioCounter == -3){
  textToSpeechAudioCounter = -2;

  //loadScript(AppClientServerProtocol+"//learningapps.org/text-to-speech/soundmanager2.js?r="+Math.random()+".mp3", soundManagerReadyCallback);

  textToSpeechAudioCounter = -1;
  soundManagerReady = true;	
  textToSpeechAudioCounter = 0; 
 }
}

var textToSpeechRetryCounter = 0;
var lastTextToSpeechPlayer = null;

var textToSpeechHTML5FirstLoad = true;
var textToSpeechHTML5FirstChange = true;

function textToSpeechHTML5(s,lang){
  if(window.speechSynthesisVoices.length == 0) return;
  try{
    var utterance = new SpeechSynthesisUtterance(s);

    var voices = window.speechSynthesisVoices;
    var v = null;
    var en = null;
    for(var i=0; i < voices.length; i++){
      var a = voices[i].lang.split("-");
      if(a[0] == "en" && en == null) en = voices[i];
      if(voices[i]["default"] && a[0] == "en") en = voices[i];
      if(a[0] == lang && v == null) v = voices[i];
      if(voices[i]["default"] && a[0] == lang) v = voices[i];
    } 

    utterance.voice = v ? v : en;
    if(lang == 'en') utterance.lang = 'en-US';
    if(lang == 'fr') utterance.lang = 'fr-FR';
    if(lang == 'de') utterance.lang = 'de-DE';
    if(lang == 'it') utterance.lang = 'it-IT';
    if(lang == 'ru') utterance.lang = 'ru-RU';
    if(lang == 'es') utterance.lang = 'es-ES';
    utterance.volume = 1;
    utterance.rate = 0.9;
  //  if(navigator.platform && ( /iPad|iPhone|iPod/.test(navigator.platform))) utterance.rate = 0.1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }catch(e){};
}

var text2speechDebounceTimer = null;
var startUpTime = new Date().getTime();
var firstPlayText2SpeechAudio = true;
var text2speechAudioPlayer = new Audio();
function textToSpeech(s,lang,html5){
  function unlockAudio() {
    text2speechAudioPlayer.src = 'https://learningapps.org/silence.mp3';
    text2speechAudioPlayer.play();
    document.body.removeEventListener('click', unlockAudio);
    document.body.removeEventListener('touchstart', unlockAudio);
  }
 if(firstPlayText2SpeechAudio){
   setTimeout(function(){
     document.body.addEventListener('click', unlockAudio);
     document.body.addEventListener('touchstart', unlockAudio);
   },10);
   firstPlayText2SpeechAudio = false;
 }
 if(!lang) lang = "de";
 lang = lang.toLowerCase();
 try{
   textToSpeechAudioCounter = 0;
   if(text2speechAudioPlayer) { 
    text2speechAudioPlayer.pause(); 
   }
 }catch(e){};
 try{
   text2speechAudioPlayer.src = AppClientServerProtocol+"//learningapps.org/text-to-speech/t2s.php?tl="+lang+"&txt="+encodeURIComponent(s)+ "&rnd="+startUpTime;
   var promise = text2speechAudioPlayer.play();
   if(promise) promise.then(function(){
     text2speechAudioPlayer.play();
   },function(e){ console.log(e); });
 }catch(e){};
}
//////////////////////////////////////////////////////////////////////////////
var MathJaxEnabled = true;
function addMathJax(){
 var body = document.getElementsByTagName("body");
 if (body.length == 0) {
  setTimeout("addMathJax()", 150);
  return;
 }

 if(!MathJaxEnabled) return;
 var script= document.createElement('script');
 script.type= 'text/x-mathjax-config';
 script.text = 'MathJax.Hub.Config({showMathMenu:false,showProcessingMessages:false, tex2jax: {inlineMath: [["$$","$$"]], displayMath: [["$$$","$$$"]], processEnvironments:false}});';
 // adding a special \rand{1}{6} random generator to display a number between 1 and 6 (including)
 script.text += 'MathJax.Hub.Register.StartupHook("TeX Jax Ready",function () { MathJax.InputJax.TeX.prefilterHooks.Add(function (data) { data.math = data.math.replace(/\\\\rand\\{([^\\}]*?)\\}\\{([^\\}]*?)\\}/g,function(n,min,max){ return Math.floor(Math.random()*(parseInt(max) - parseInt(min) + 1)) + parseInt(min); }); }); });'; 
 
 document.body.appendChild(script);

 var script= document.createElement('script');
 script.type= 'text/javascript';
 script.src= AppClientServerProtocol+'//learningapps.org/MathJax/MathJax.js?config=TeX-AMS-MML_HTMLorMML&v=2.75';
 document.body.appendChild(script);

 MathJaxRefresh = setInterval("refreshMathJax()",1000);
}
function refreshMathJax(){
 if(!MathJaxEnabled) return;
 if(typeof(MathJax) != "undefined" && MathJax.Hub)
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

var checkForMathJax = function(){
 var body = document.getElementsByTagName("body");
 if (body.length == 0) {
  setTimeout("checkForMathJax()", 150);
  return;
 }

 setTimeout(function(){
   MathJaxEnabled = false;
   if(typeof AppClient != "undefined"){
    var params = AppClient.getParameters();
    var hasLatex = false;
    for(var i=0; i < params.length; i++){
     if(params[i].value.indexOf("$$") >= 0) {hasLatex = true; break;} 
     if(params[i].hint && params[i].hint.indexOf && params[i].hint.indexOf("$$") >= 0) {hasLatex = true; break;} 
    }
    if(!hasLatex){ 
     if(document.body && document.body.innerHTML.indexOf("$$") < 0) return; // no MathJax
    }
   }
   MathJaxEnabled = true;
   addMathJax();
 },250);
}
checkForMathJax();

//////////////////////////////////////////////////////////////////////////////
function makeIETouchWork(){
  loadCSSString(".ui-draggable {-ms-touch-action:none;}",false,true);
  /*
  var css = document.styleSheets[0];
  if(css){
   if(css.insertRule) 
    css.insertRule(".ui-draggable {-ms-touch-action:none;}",0); else
    css.addRule(".ui-draggable", "-ms-touch-action:none;");
  }
  */
}

setTimeout(makeIETouchWork,250);

//////////////////////////////////////////////////////////////////////////////
function _getElementOffset(elm, height) {
	var cStyle = elm.ownerDocument && elm.ownerDocument.defaultView && elm.ownerDocument.defaultView.getComputedStyle
		&& elm.ownerDocument.defaultView.getComputedStyle(elm, null),
		ret = cStyle && cStyle.getPropertyValue(height ? 'height' : 'width') || '';
	if (ret && ret.indexOf('.') > -1) {
		ret = parseFloat(ret)
			+ parseInt(cStyle.getPropertyValue(height ? 'padding-top' : 'padding-left'))
			+ parseInt(cStyle.getPropertyValue(height ? 'padding-bottom' : 'padding-right'))
			+ parseInt(cStyle.getPropertyValue(height ? 'border-top-width' : 'border-left-width'))
			+ parseInt(cStyle.getPropertyValue(height ? 'border-bottom-width' : 'border-right-width'));
	} else {
		ret = height ? elm.offsetHeight : elm.offsetWidth;
	}
	return ret;
}
function getOffsetWidth(elm) {
	return _getElementOffset(elm);
}
function getOffsetHeight(elm) {
	return _getElementOffset(elm, true);
}

/*
var lightBox = new Object();
lightBox.body = null;
lightBox.overlay = null;
lightBox.container = null;
lightBox.close = null;
lightBox.description = null;

lightBox.lightbox = function (imageurl, text, desc){
 if(this.container) return;
 this.body = document.getElementsByTagName("body")[0];
 var isImage = imageurl || imageurl != "" ? true : false;
 this.createOverlay();
 this.createContainer(isImage); // autoadded to body
 this.createCloseButton(this.container); // added to container
 this.createDescription(desc); // initialize
 if(isImage) {
   this.container.appendChild(this.description);
   this.createImageLoader(imageurl);
 }else{ 
    if(!text) return;
    this.createTextLoader(text);
    if(desc) {
     var divider = document.createElement('hr');
     var dividerCSS = 'width:80%;color:#000;';
     divider.setAttribute("style", dividerCSS);
     this.container.appendChild(divider);
     this.container.appendChild(this.description);
    }
  } 
}

lightBox.createOverlay = function(){
 this.overlay = document.createElement('div');
 var overlayCSS = 'position:absolute;width:100%;top:0;left:0;height:100%;background:#000;opacity:0.6;filter:alpha(opacity=0);-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=0);z-index:10000;cursor:pointer';
 this.overlay.setAttribute('style',overlayCSS);
 var self = this;
 this.overlay.onclick = function closeLightBox(){
   self.fadeOut(self.container, 0, 100);
   self.body.removeChild(self.overlay);
   self.body.removeChild(self.container); 
   self.container = null;
 }
 this.body.appendChild(this.overlay);
}

lightBox.createContainer = function(image){
 this.container = document.createElement('div');
 var containerCSS = '';
 if(image)containerCSS = 'background:white;position:absolute;opacity:0.01;filter:alpha(opacity=0);-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=0);z-index:10001;border:10px solid #fff;text-align:center;';
 else containerCSS = 'width:400px;display:block;position:absolute;opacity:0;filter:alpha(opacity=0);-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=0);z-index:10001;border:10px solid #fff;background-color:#fff;';
 this.container.setAttribute('style',containerCSS);
 this.body.appendChild(this.container);
}

lightBox.createCloseButton = function(){
 var close = document.createElement('div');
 var closeCSS = 'position:absolute;right:-24px;top:-24px;z-index:10003;cursor:pointer;color:#fff;border:2px solid #AEAEAE;border-radius:30px;background:#000;font-size:32px;font-weight:bold;display:inline-block;line-height:0px;padding:11px 3px;'; 
 close.setAttribute("style", closeCSS);
 close.innerHTML = '&times;';
 this.container.appendChild(close);
 close.onclick = this.overlay.onclick;
 this.container.appendChild(close);
}

lightBox.createDescription = function(desc){
 this.description = document.createElement('div');
 var descriptionCSS = 'text-align:center;border-bottom:10px solid #fff;border-top:10px solid #fff;background:#fff;';
 this.description.setAttribute("style", descriptionCSS);
 if(!desc) desc = "";
 this.description.innerHTML = '<small>' + desc + '</small>';
}

lightBox.createImageLoader = function(imageurl){
 var imageToDisplay = document.createElement('img');
 imageToDisplayCSS = 'max-height:' + (this.body.clientHeight * 0.80 -20)+'px;';
 imageToDisplay.setAttribute("style", imageToDisplayCSS);
 
 imageToDisplay.setAttribute('alt', ""); 
 this.container.appendChild(imageToDisplay);
 var self = this;
 imageToDisplay.onload = function onload (){
   var width = imageToDisplay.clientWidth;
   var height = imageToDisplay.clientHeight;
   self.container.style.top = "50%";
   self.container.style.left = "50%";
   self.container.style.width = Math.max(200,width) + 'px';
   var mTop = -height/2;
   var mLeft = -width/2;
   self.container.style.marginTop = mTop + 'px';
   self.container.style.marginLeft = mLeft + 'px'
 
   self.fadeIn(self.container, 1, 100);

   setTimeout(function() {
	var height = self.container.clientHeight+40;
	var width = self.container.clientWidth+20;
	if(height > self.body.clientHeight || width > self.body.clientWidth){
         if(width > self.body.clientWidth) self.container.style.width = "";
         imageToDisplay.style.maxWidth = self.body.clientWidth * 0.9 + "px";
	 imageToDisplay.style.maxHeight =(self.body.clientHeight * 0.80 - 
                                          self.description.clientHeight -20) + 'px';
	 height = self.container.clientHeight;
	}
	self.container.style.marginTop = - self.container.clientHeight / 2 + 'px';
	self.container.style.marginLeft = (- self.container.clientWidth / 2 -10) + 'px';
  }, 100);
 }
 imageToDisplay.setAttribute('src', imageurl); 
}

lightBox.createTextLoader = function(text){
 var contentTextDiv = document.createElement('div');
 contentTextDiv.setAttribute("style", "font-size:120%");
 contentTextDiv.innerHTML = text;
 this.container.style.maxHeight = (this.body.clientHeight*0.8-40)+"px";
 this.container.style.overflowX = "hidden"; 
 this.container.style.overflowY = "auto"; 

 var height = this.container.offsetHeight;
 this.container.appendChild(contentTextDiv);
 this.container.style.top = "20%";
 this.container.style.left = "50%";
 var mTop = -(height/2);
 var mLeft = -(this.container.offsetWidth/2);
 this.container.style.marginLeft = mLeft + 'px';
 this.fadeIn(this.container, 1, 100);
}

lightBox.fadeIn = function(element, targetOpacity, timeToFade){
  var currentOpacity = window.getComputedStyle(element, null).opacity;
  var interval = false,
	interval = setInterval(function() {	   
	   currentOpacity = parseFloat(element.style.opacity);
	   if (currentOpacity <= targetOpacity) {
		  currentOpacity += .1;
		  element.style.opacity = currentOpacity;
		  element.style.filter = 'alpha(opacity=' + currentOpacity * 100 + ')';
	   } else {
		  clearInterval(interval);
	   }
	}, timeToFade);
}

lightBox.fadeOut = function(element, targetOpacity, timeToFade){
  var currentOpacity = window.getComputedStyle(element, null).opacity;
  var interval = false,
        
	interval = setInterval(function() {	   
	   currentOpacity = parseFloat(element.style.opacity);
	   if (currentOpacity > targetOpacity) {
		  currentOpacity -= .1;
		  element.style.opacity = currentOpacity;
		  element.style.filter = 'alpha(opacity=' + currentOpacity * 100 + ')';
	   } else {
		  clearInterval(interval);
	   }
	}, timeToFade);
}

*/

