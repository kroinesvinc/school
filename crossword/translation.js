//////////////////////////////////////////////////////////////////////////////////
// App Client JavaScript Library
//  see http://LearningApps.org for further details
//////////////////////////////////////////////////////////////////////////////////
var AppClientTranslation = new Array();
//////////////////////////////////////////////////////////////////////////////////
function addAppClientTranslation(language,id,text){
 var i = findAppClientTranslation(language,id);
 if(i == -1){
  var o = new Object();
  o.language = language;
  o.id = id;
  o.text = text;
  AppClientTranslation.push(o);
 }else{
  AppClientTranslation[i].text = text;
 }
}
//////////////////////////////////////////////////////////////////////////////////
function findAppClientTranslation(language,id){
 if(!AppClientTranslation) AppClientTranslation = new Array();
 for(var i=0; i < AppClientTranslation.length; i++){
  var o = AppClientTranslation[i];
  if(o.id == id && o.language == language) return i;
 } 
 return -1;
}
//////////////////////////////////////////////////////////////////////////////////
function findAppClientTranslations(id){
 if(!AppClientTranslation) AppClientTranslation = new Array();
 var r = new Array();
 for(var i=0; i < AppClientTranslation.length; i++){
  var o = AppClientTranslation[i];
  if(o.id == id) r.push(o);
 } 
 return r;
}
//////////////////////////////////////////////////////////////////////////////////
function getAppClientTranslation(id,lang){
 var language = AppClientLanguage;
 if(lang) language = lang;
 var i = findAppClientTranslation(language,id);
 if(i != -1) return AppClientTranslation[i].text;
 var i = findAppClientTranslation("EN",id); // fallback EN
 if(i != -1) return AppClientTranslation[i].text;
 return id;
}
//////////////////////////////////////////////////////////////////////////////////

