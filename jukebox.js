/* big ups to cats777 and FPGAminer */
/* check Readme.md for the TODO items there */

// GLOBAL vars are in ALL CAPS

/* -- defined outside this -- */
// object of {"playlist name": "relative_url"} pairs
// can I get this from gebi("playlists") instead of a global var?
var PLAYLISTS = PLAYLISTS||{};
// one playlist name, optional
var DEFAULT_PLAYLIST = DEFAULT_PLAYLIST||"";
// one colourscheme name, optional
var DEFAULT_SKIN = DEFAULT_SKIN||"";

/* -- global vars for jukebox state -- */
// list of track objects
var TRACKLIST = []
// the offset in playlist of current song
var TRACKNUM = 0
// where to jump when track ends; see toggleLoop for meaning
var LOOPING = 0
// user is dragging the scrubber? the audio.timeupdate event needs to know
var SCRUBBING = false
// state of tracklist sorting; see toggleSort for meaning
var SORTHOW = 0
// list of colour schemes
var SKINLIST = SKINLIST||{}
// current akin
var SKIN = ""

/* -- start functions -- */
// saves typing
var gebi = document.getElementById.bind(document)
function hash(r){let h=0;for(let t=0,e=r.length;t<e;t++){let n=r.charCodeAt(t);h=(h<<5)-h+n,h|=0}return h}
// because iOS (iPhone) only allows one special snowflake version of Safari
// and iOS (iPhone) can't do .ogg audio files
function _is_iOS(){return ["iPad Simulator","iPhone Simulator","iPod Simulator","iPad","iPhone","iPod"].includes(navigator.platform)||navigator.userAgent.includes("Mac")&&"ontouchend"in document;}
function mkrelhref(h,b){b=new URL(b,window.location).href;h=new URL(h,b).href;let i=0;for(;i<h.length&&h[i]==window.location.href[i];i++);return h.substr(i)}

// playlist management
function m3u_to_json(a){let b={annotation:"",track:[]},c={location:"",title:"",duration:0};for(let d of a.split("\n"))if(d=d.trim(),"#"!=d[0])d&&(c.location=d,c.title||(c.title=d.substr(d.lastIndexOf("/")+1).replaceAll("_"," ").substr(0,d.lastIndexOf("."))),b.track.push(c),c={location:"",title:"",duration:0});else if(d.startsWith("#PLAYLIST ")&&!b.annotation)b.annotation=d.substr(10).trimStart();else if(d.startsWith("#EXTIMG "))c.image=d.substr(8).trimStart();else if(d.startsWith("#EXTINF ")){let a=d.substr(8).trim();0<a.indexOf(",")?(c.duration=+a.substr(0,a.indexOf(",")).trim(),c.title=a.substr(a.indexOf(",")+1).trim()):c.duration=+a}return b}


function loadNewPlaylist(b,c){let d,e;for(b=b||localStorage.listname,d=PLAYLISTS[b],c=c||localStorage.trackid,document.querySelector("#td-list select").value=b,e=gebi("tracks-table");e.firstChild;)e.removeChild(e.lastChild);for(e=gebi("art");e.firstChild;)e.removeChild(e.lastChild);TRACKLIST=[],d=new URL(d,window.location).href,fetch(d,{cache:"no-cache"}).then(a=>{if("json"==d.substr(-4)||"jspf"==d.substr(-4))return a.json();return"m3u"==d.substr(-3)||"m3u8"==d.substr(-4)?a.text():void 0}).then(e=>{("m3u"==d.substr(-3)||"m3u8"==d.substr(-4))&&(e=m3u_to_json(e));let f=gebi("audio");f.pause(),TRACKLIST=e.track,e.annotation?gebi("pl-annotation").classList.remove("dis-none"):gebi("pl-annotation").classList.add("dis-none"),gebi("pl-annotation-2").textContent=e.annotation||"";for(let a=TRACKLIST.length-1;0<=a;a--)TRACKLIST[a].location=mkrelhref(TRACKLIST[a].location,d),TRACKLIST[a].image&&(TRACKLIST[a].image=mkrelhref(TRACKLIST[a].image,d)),TRACKLIST[a].id=""+b+":"+hash(TRACKLIST[a].location).toString(36),TRACKLIST[a].meta=TRACKLIST[a].meta||{},TRACKLIST[a].meta.loadorder=a;localStorage.playlist=b,refreshPlaylist(c),gebi("td-sort").firstChild.className="fa fa-arrow-down-1-9"})}

// redraw the tracklist, keeping trackid highlighted
function refreshPlaylist(a){let b,c,d,e;for(e=gebi("tracks-table");e.firstChild;)e.removeChild(e.lastChild);for(b=0;b<TRACKLIST.length;b++)c=document.createElement("div"),d=TRACKLIST[b],c.textContent="creator"in d?d.creator+" - "+d.title:d.title,"annotation"in d&&c.setAttribute("title",d.annotation),c.setAttribute("id",d.id),e.appendChild(c),function(a){c.addEventListener("click",function(){playTrack(a)},!1)}(b);highlightTrack(a)}

// current song ended
// beware: if <audio loop="anystring"> the "ended" event never happens
function audioEnded(){let b=gebi("art");for(;b.firstChild;)b.removeChild(b.lastChild);if(b.classList.add("dis-none"),null===TRACKLIST||0==TRACKLIST.length)return!1;let c=gebi("audio");if(b=TRACKNUM,2!=LOOPING&&(b+=1,b>=TRACKLIST.length)){if(0==LOOPING)return c.pause(),!1;b=0}playTrack(b)}

// there is a problem in the AE35 unit
function audioError(){const m=["unknown","MEDIA_ERR_ABORTED","MEDIA_ERR_NETWORK","MEDIA_ERR_DECODE","MEDIA_ERR_SRC_NOT_SUPPORTED"];let a=gebi("audio"),c=a.error.code;alert("Audio Error: ("+c+") "+m[c<m.length&&c||0]);a.pause()}

// update UI to make one track special-er
function highlightTrack(a){let b,c;if(a===void 0)a=TRACKNUM;else if("string"==typeof a){for(b=0;b<TRACKLIST.length&&!(TRACKLIST[b].id==a);b++);b>=TRACKLIST.length&&(b=0),a=b}else(0>a||a>=TRACKLIST.length)&&(a=0);for(TRACKNUM=a,c=TRACKLIST[TRACKNUM],document.title=c.title+" | Jukebox";b=document.querySelector("#tracks-table .selected");)b.classList.remove("selected");trackelem=document.querySelectorAll("#tracks-table div")[a],trackelem.classList.add("selected"),window.location.hash=trackelem.id,controlelem=gebi("div-con"),window.scroll(0,trackelem.offsetTop-controlelem.offsetHeight),localStorage.trackid=TRACKLIST[a].id}

// do the thing and update the UI
function playTrack(b){var c,d,e,f,g,h;if(e=TRACKNUM<=TRACKLIST.length?TRACKLIST[TRACKNUM].id:"","string"==typeof b){for(c=0;c<TRACKLIST.length&&TRACKLIST[c].id!=b;c++);b=c}if((b>=TRACKLIST.length||0>b)&&(b=0),b>=TRACKLIST.length&&(b=TRACKLIST.length-1),f=TRACKLIST[b].id,g=gebi("audio"),e==f&&!g.paused)return!1;for(TRACKNUM=b,d=TRACKLIST[TRACKNUM],highlightTrack(),c=gebi("art");c.firstChild;)c.removeChild(c.lastChild);return void 0!==d.image&&(h=document.createElement("img"),h.src=d.image.replaceAll("#","%23"),c.appendChild(h)),c.classList.remove("dis-none"),g.setAttribute("src",d.location.replaceAll("#","%23")),g.play(),!0}

// the control buttons
function togglePlaypause(e){let a=gebi("audio");a.paused&&a.play()||a.pause()}
function buttonPrevTrack(){if(null===TRACKLIST||0==TRACKLIST.length)return!1;let b=gebi("audio");if(.1>b.currentTime/b.duration)return b.currentTime=0,!0;let a=TRACKNUM-1;return 0>a&&(a=TRACKLIST.length-1),playTrack(a)}
function buttonNextTrack(){if(null===TRACKLIST||0==TRACKLIST.length)return!1;let a=TRACKNUM+1;return a>=TRACKLIST.length&&(a=0),playTrack(a)}
function toggleLooping(){let c=gebi("audio"),a=gebi("td-loop").firstChild;LOOPING=(LOOPING+1)%3,0==LOOPING?(a.className="fa fa-long-arrow-right",c.removeAttribute("loop")):1==LOOPING?(a.className="fa fa-rotate-right",c.removeAttribute("loop")):2==LOOPING&&(a.className="fa fa-rotate-left",c.setAttribute("loop",1)),localStorage.looping=LOOPING}
function toggleSort(){function c(b){return(b.creator||"")+(b.title||"")||a.location}let d=TRACKLIST[TRACKNUM].id,e=gebi("td-sort").firstChild;SORTHOW=(SORTHOW+1)%3,1==SORTHOW?(function(b){for(let c=b.length-1;0<c;c--){let d=Math.floor(Math.random()*(c+1)),e=b[c];b[c]=b[d],b[d]=e}}(TRACKLIST),e.className="fa fa-shuffle"):2==SORTHOW?(TRACKLIST.sort((d,e)=>c(d)>c(e)),e.className="fa fa-arrow-down-a-z"):(TRACKLIST.sort((c,d)=>c.meta.loadorder>d.meta.loadorder),e.className="fa fa-arrow-down-1-9"),refreshPlaylist(d)}
function toggleVolume(){let b=gebi("audio");b.volume=.67<b.volume?.67:.33<b.volume?.33:0<b.volume?0:1,localStorage.volume=b.volume}
function setVolumeButton(){let c=gebi("audio"),a=gebi("td-loud").firstChild;a.className=.67<c.volume?"fa fa-volume-high":.33<c.volume?"fa fa-volume-low":0<c.volume?"fa fa-volume-off":"fa fa-volume-xmark"}
function toggleInfo(){gebi("info").classList.toggle("dis-none")}
function hideShowtimes(a){a?(gebi("time-now").classList.remove("dis-none"),gebi("time-end").classList.remove("dis-none")):(gebi("time-now").classList.add("dis-none"),gebi("time-end").classList.add("dis-none"))}
function toggleShowtimes(){localStorage["cfg-showtimes"]=this.checked,hideShowtimes(this.checked)}

function switchSkin(a){let b="";if("string"==typeof a)b=a;else{let a=Object.keys(SKINLIST);b=a[(a.indexOf(SKIN)+1)%a.length]}!b in SKINLIST&&(b=skinnames[0]),gebi("cfg-skin").textContent=localStorage["cfg-skin"]=SKIN=b;let c=document.querySelector(":root").style;for(k in SKINLIST[SKIN])c.setProperty("--"+k,SKINLIST[SKIN][k])}

// main()
window.addEventListener("load",function(){function b(a){return("00"+Math.floor(a/60)).substr(-2)+":"+("00"+Math.floor(a%60)).substr(-2)}function c(a){let b=gebi("scrubber-track").offsetWidth,c=100*((a.pageX-gebi("scrubber-track").getBoundingClientRect().left)/b);return 0>c?c=0:100<c&&(c=100),gebi("scrubber-progress").style.width=""+c+"%",c}function d(b){let e=c(b),f=gebi("audio");f.currentTime=e/100*f.duration,SCRUBBING=!1,document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",d)}let e=document.querySelector("#td-list select");for(let a in PLAYLISTS){let b=document.createElement("option");b.text=b.value=a,e.append(b)}let f=gebi("audio");f.pause(),f.volume=1,f.addEventListener("ended",audioEnded),f.addEventListener("error",audioError),f.addEventListener("pause",()=>{gebi("td-play").firstChild.className="fa fa-play"}),f.addEventListener("play",()=>{gebi("td-play").firstChild.className="fa fa-pause"}),gebi("time-now").textContent="00:00",gebi("time-end").textContent="00:00",f.addEventListener("timeupdate",function(){isNaN(this.duration)||(!SCRUBBING&&(gebi("scrubber-progress").style.width=100*(this.currentTime/this.duration)+"%"),gebi("time-now").textContent=b(this.currentTime),gebi("time-end").textContent=b(this.duration))}),f.addEventListener("volumechange",setVolumeButton),gebi("td-loop").addEventListener("click",toggleLooping),gebi("td-next").addEventListener("click",buttonNextTrack),gebi("td-play").addEventListener("click",togglePlaypause),gebi("td-prev").addEventListener("click",buttonPrevTrack),gebi("td-sort").addEventListener("click",toggleSort),gebi("td-skin").addEventListener("click",switchSkin),_is_iOS()?gebi("td-loud").classList.add("dis-none"):gebi("td-loud").addEventListener("click",toggleVolume),gebi("td-info").addEventListener("click",toggleInfo),document.querySelector("#td-list select").addEventListener("change",a=>loadNewPlaylist(a.target.value)),gebi("cfg-showtimes").addEventListener("change",toggleShowtimes),document.addEventListener("keydown",a=>{" "==a.key?(a.preventDefault(),togglePlaypause()):a.ctrlKey&&"ArrowRight"==a.key?(a.preventDefault(),buttonNextTrack()):a.ctrlKey&&"ArrowLeft"==a.key?(a.preventDefault(),buttonPrevTrack()):"l"==a.key?(a.preventDefault(),toggleLooping()):"v"==a.key&&(a.preventDefault(),toggleVolume())}),gebi("time-bar").addEventListener("mousedown",function(a){return!(1!=a.which)&&void(SCRUBBING=!0,c(a),document.addEventListener("mousemove",c),document.addEventListener("mouseup",d))});let a=DEFAULT_PLAYLIST;null!==localStorage.getItem("volume")&&(f.volume=localStorage.getItem("volume")),null===localStorage.getItem("looping")?toggleLooping(LOOPING):toggleLooping(localStorage.getItem("looping")),null!==localStorage["cfg-showtimes"]&&hideShowtimes(gebi("cfg-showtimes").checked=localStorage.getItem("cfg-showtimes")),null!==localStorage["cfg-skin"]&&(SKIN=localStorage["cfg-skin"]);let g="";null!==localStorage.getItem("playlist")&&localStorage.getItem("playlist")in PLAYLISTS&&(a=localStorage.getItem("playlist"));let h=decodeURI(window.location.hash.substr(1));h&&(a=h.substr(0,h.indexOf(":")),a?g=h:a=h),a in PLAYLISTS||(a=function(a){return a[a.length*Math.random()<<0]}(Object.keys(PLAYLISTS)),g=""),switchSkin(SKIN),loadNewPlaylist(a,g)});

