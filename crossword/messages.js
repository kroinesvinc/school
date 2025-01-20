function openSendMessageFrameLoginNeeded(){
 window.location.href = "/login.php?requestPage="+encodeURIComponent(window.location.href);
}

function openSendMessageFrame(sendto,app,reply,event){
 if(event) setSendMessageFramePosition(event);

 var s = '<iframe id="SendMessageFrameI" scrolling="no" frameborder="0" style="width:100%;height:100%" src="/message.php?sendto='+sendto+'&app='+app+'&reply='+reply+'"></iframe>';

 document.getElementById("SendMessageFrame").innerHTML=s;
 document.getElementById("SendMessageFrame").style.display="block";
}

function closeSendMessageFrame(){
 d = document.getElementById("SendMessageFrameI");
 if(d) d.src = "";
 d = document.getElementById("SendMessageFrame");
 d.style.display = "none";  
}

function setSendMessageFramePosition(event) {
 var p = 0;
 if (event.pageY) p = event.pageY;
 else if (event.clientY)
   p = event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
 var d = document.getElementById("SendMessageFrame");
 if(browserSupportsFixed()){
   d.style.position = "fixed";
   d.style.top = "50%";
   d.style.marginTop = (-parseInt(d.style.height)/2)+"px";
 } else {
   d.style.position = "absolute";
   d.style.top = (p-(p > 300 ? 300 : 100))+"px";
 }
}

