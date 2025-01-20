///////////////////////////////////////////////////////////////////////////////
// Image licence auto discovery module
///////////////////////////////////////////////////////////////////////////////
var wikipediaThumbs = new Array();
var flickrThumbs = new Array();
///////////////////////////////////////////////////////////////////////////////
function ajaxRequest(){
 var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
 if (window.ActiveXObject){ 
  for (var i=0; i<activexmodes.length; i++){
   try{ return new ActiveXObject(activexmodes[i])}
   catch(e){}
  }
 }
 else if (window.XMLHttpRequest) return new XMLHttpRequest();
 else return false;
}

function strip_tags(input, allowed) {
  allowed = (((allowed || '') + '')
    .toLowerCase()
    .match(/<[a-z][a-z0-9]*>/g) || [])
    .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '')
    .replace(tags, function($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}
///////////////////////////////////////////////////////////////////////////////
function autoLicenceDiscovery(url,callback){
   if(url.indexOf("wikimedia.org") > 0 || url.indexOf("wikipedia.org") > 0) {
    var urlparts = url.split("/");
    if(urlparts[urlparts.length-1].indexOf(urlparts[urlparts.length-2]) > 0){
     urlparts.splice(urlparts.length-1,1);
    }
    for(var i=0; i < wikipediaThumbs.length; i++){
     if(wikipediaThumbs[i].file == urlparts[urlparts.length-1]) return; // already listed
    }  
    var s = document.createElement("script");
    s.src = "//commons.wikipedia.org/w/api.php?format=json&action=query&titles=File:"+urlparts[urlparts.length-1]+ 
            "&prop=imageinfo&iiprop=user|url|extmetadata&callback=jsonWikipediaApi";
    document.body.appendChild(s);
    wikipediaThumbs.push({file:urlparts[urlparts.length-1],thumb:url, callback:callback});
   }
   if(url.indexOf("flickr.com") > 0) {
    var urlparts = url.split("/");
    var ids = urlparts[urlparts.length-1];
    ids = ids.split("_");
    for(var i=0; i < flickrThumbs.length; i++){
     if(flickrThumbs[i].id == ids[0]) return; // already listed
    }  
    var s = document.createElement("script");
    s.src = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=522bf0b47da59e0d6ca2624d3cfd7b6c&photo_id='+ids[0]+'&secret='+ids[1]+'&format=json';

    document.body.appendChild(s);
    flickrThumbs.push({id:ids[0],thumb:url, callback:callback});
   }
/*
   if(url.indexOf("dbimg.eu") > 0){
    var ax = new ajaxRequest();
    var u = url.replace("http://dbimg.eu/i/","https://dbimg.eu/b/");
    u = u.replace("https://dbimg.eu/i/","https://dbimg.eu/b/");
    ax.open("GET", u, true);
    ax.onreadystatechange = function(){
	if(ax.readyState == 4) autoLicenceDiscovery(ax.responseText,callback);
    };
    ax.send(null);
   }
*/
}
///////////////////////////////////////////////////////////////////////////////
// JSONP Callback from Wikipedia API
///////////////////////////////////////////////////////////////////////////////
function jsonWikipediaApi(result){
 if(typeof result == "undefined") return;
 if(typeof result.query  == "undefined") return;
 if(typeof result.query.pages  == "undefined") return;
 for(p in result.query.pages){
  if(typeof result.query.pages[p].imageinfo  == "undefined") continue;
  var imageinfo = result.query.pages[p].imageinfo[0];
  var imagename = imageinfo.descriptionurl.split(":");
  imagename = decodeURIComponent(imagename[imagename.length-1]);

  for(var i=0; i < wikipediaThumbs.length; i++){
   if(wikipediaThumbs[i].file.indexOf(imagename) >= 0){
    var mediaAuthors = "";
    mediaAuthors += '<div class="imageAuthorInfo">';
    mediaAuthors += '<div class="imageAuthorInfo_previewContainer"><a target="_blank" href="'+imageinfo.descriptionurl+'"><img class="imageAuthorInfo_preview" src="'+wikipediaThumbs[i].thumb+'" alt="'+imagename+'" /></a></div> '; 
    if(!imageinfo.extmetadata.License)
     mediaAuthors += '<span class="imageAuthorInfo_licence"><a target="_blank" href="JavaScript:void(0)">licence</a></span> '; 
    else
    if(imageinfo.extmetadata.License.value == "pd")
     mediaAuthors += '<span class="imageAuthorInfo_licence"><a target="_blank" href="JavaScript:void(0)">Public Domain</a></span> ';
    else 
    if(imageinfo.extmetadata.LicenseUrl)
     mediaAuthors += '<span class="imageAuthorInfo_licence"><a target="_blank" href="'+imageinfo.extmetadata.LicenseUrl.value+'">'+ 
           imageinfo.extmetadata.License.value.toUpperCase()+'</a></span> ';
    mediaAuthors += '<span class="imageAuthorInfo_user"><a target="_blank" href="'+imageinfo.descriptionurl+'"> by '+imageinfo.user+(imageinfo.extmetadata.Artist ? ' <span class="imageAuthorInfo_userext" text="'+strip_tags(imageinfo.extmetadata.Artist.value).replace(/"/g,'\\"')+'"></span>':'')+'</a></span>';
    mediaAuthors += '</div>';
    if(wikipediaThumbs[i].callback) wikipediaThumbs[i].callback(mediaAuthors);
    break;
   }
  }
 }
}
///////////////////////////////////////////////////////////////////////////////
// JSONP Callback from Flickr API
///////////////////////////////////////////////////////////////////////////////
function jsonFlickrApi(r){
  var licence = "OTHER"; var licenceurl = "http://flickr.com/commons/usage/";
  if(r.photo.license == "1"){ licence = "CC-BY-NC-SA-2.0"; licenceurl = "http://creativecommons.org/licenses/by-nc-sa/2.0/"; }
  if(r.photo.license == "2"){ licence = "CC-BY-NC-2.0"; licenceurl = "http://creativecommons.org/licenses/by-nc/2.0/"; }
  if(r.photo.license == "3"){ licence = "CC-BY-NC-ND-2.0"; licenceurl = "http://creativecommons.org/licenses/by-nc-nd/2.0/"; }
  if(r.photo.license == "4"){ licence = "CC-BY-2.0"; licenceurl = "http://creativecommons.org/licenses/by/2.0/"; }
  if(r.photo.license == "5"){ licence = "CC-BY-SA-2.0"; licenceurl = "http://creativecommons.org/licenses/by-sa/2.0/"; }
  if(r.photo.license == "6"){ licence = "CC-BY-ND-2.0"; licenceurl = "http://creativecommons.org/licenses/by-nd/2.0/"; }

  if(typeof r.photo == "undefined") return;
  if(typeof r.photo.id == "undefined") return;
  if(typeof r.photo.urls == "undefined") return;

  var url = r.photo.urls.url[0]._content;

  for(var i=0; i < flickrThumbs.length; i++){
   if(flickrThumbs[i].id == r.photo.id){
    var mediaAuthors = "";

    mediaAuthors += '<div class="imageAuthorInfo">';
    mediaAuthors += '<div class="imageAuthorInfo_previewContainer"><a target="_blank" href="'+url+'"><img class="imageAuthorInfo_preview" src="'+flickrThumbs[i].thumb+'" alt="'+url+'" /></a></div> '; 
    mediaAuthors += '<span class="imageAuthorInfo_licence"><a target="_blank" href="'+licenceurl+'">'+licence+'</a></span> ';
    mediaAuthors += '<span class="imageAuthorInfo_user"><a target="_blank" href="'+url+'"> by '+r.photo.owner.username+'</a></span>';
    mediaAuthors += '</div>';

    if(flickrThumbs[i].callback) flickrThumbs[i].callback(mediaAuthors);
    break;
   }
  }
}
///////////////////////////////////////////////////////////////////////////////

