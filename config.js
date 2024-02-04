var PLAYLISTS = {
"Example mixtape":"example-mixtape/playlist.m3u",
}

/* con-bg1, con-bg2 : controls, top-bottom gradient
   con-fg, con-fg2 : controls, idle and hover
   con-font : controls and infobox font
   scrub-bg, scrub-bg2, scrub-fg : scrubber top-bottom gradient and thumb outline
   track-null, track-hr : unused track space, track item dividers 
   track-bg,  track-fg  : track idle
   track-bg2, track-fg2 : track hover
   track-bg3, track-fg3 : track playing
   track-font : track title font
   there is no styling for the track tooltips
*/
var SKINLIST = {
"Crab": { /* 626262 and f42123 */ "con-bg1":"#666", "con-bg2":"#333", "con-fg":"#fff", "con-fg2":"#000", "con-font":"Verdana, Arial, sans-serif", "scrub-bg":"#666", "scrub-bg2":"#333", "scrub-fg":"#c00", "track-null":"#000", "track-hr":"#000", "track-bg":"#999", "track-fg":"#000", "track-bg2":"#c99", "track-fg2":"#000", "track-bg3":"#f42123", "track-fg3":"#fff", "track-font":"Verdana, Arial, sans-serif" },
"Gh0st": { /* a10000 */ "con-bg1":"#c00", "con-bg2":"#900", "con-fg":"#fff", "con-fg2":"#999", "con-font":"Georgia, Times New Roman, serif", "scrub-bg":"#c00", "scrub-bg2":"#900", "scrub-fg":"#000", "track-null":"#000", "track-hr":"#000", "track-bg":"#330000", "track-fg":"#666", "track-bg2":"#6b000", "track-fg2":"#999", "track-bg3":"#a10000", "track-fg3":"#fff", "track-font":"Georgia, Times New Roman, serif" },
"Bees": { /* a1a100 */ "con-bg1":"#cc0", "con-bg2":"#990", "con-fg":"#000", "con-fg2":"#fff", "con-font":"Courier New, Courier, monospaced", "scrub-bg":"#cc0", "scrub-bg2":"#990", "scrub-fg":"#ff0", "track-null":"#ff0", "track-hr":"#ff0", "track-bg":"#660", "track-fg":"#ccc", "track-bg2":"#cc0", "track-fg2":"#333", "track-bg3":"#a1a100", "track-fg3":"#000", "track-font":"Courier New, Courier, monospaced" },
"Taurus": { /* a15000 */ "con-bg1":"#c60", "con-bg2":"#930", "con-fg":"#000", "con-fg2":"#fff", "con-font":"Verdana, Arial, sans-serif", "scrub-bg":"#c60", "scrub-bg2":"#930", "scrub-fg":"#a10000", "track-null":"#333", "track-hr":"#333", "track-bg":"#630", "track-fg":"#ccc", "track-bg2":"#c60", "track-fg2":"#000", "track-bg3":"#a15000", "track-fg3":"#000", "track-font":"Verdana, Arial, sans-serif" },
"Feline": { /* 416600 */ "con-bg1":"#690", "con-bg2":"#360", "con-fg":"#fff", "con-fg2":"#000", "con-font":"Georgia, Times New Roman, serif", "scrub-bg":"#690", "scrub-bg2":"#360", "scrub-fg":"#33f", "track-null":"#360", "track-hr":"#9c0", "track-bg":"#360", "track-fg":"#ccc", "track-bg2":"#690", "track-fg2":"#fff", "track-bg3":"#416600", "track-fg3":"#fff", "track-font":"Georgia, Times New Roman, serif" },
"Moth": { /* 008141 */ "con-bg1":"#093", "con-bg2":"#060", "con-fg":"#fff", "con-fg2":"#000", "con-font":"Georgia, Times New Roman, serif", "scrub-bg":"#093", "scrub-bg2":"#060", "scrub-fg":"#b536da", "track-null":"#030", "track-hr":"#000", "track-bg":"#360", "track-fg":"#ccc", "track-bg2":"#b536da", "track-fg2":"#fff", "track-bg3":"#416600", "track-fg3":"#fff", "track-font":"Georgia, Times New Roman, serif" },
"Libra": {  /* 008282 */ "con-bg1":"#099", "con-bg2":"#066", "con-fg":"#fff", "con-fg2":"#000", "con-font":"Georgia, Times New Roman, serif", "scrub-bg":"#0cc", "scrub-bg2":"#066", "scrub-fg":"#f00", "track-null":"#333", "track-hr":"#333", "track-bg":"#0cc", "track-fg":"#000", "track-bg2":"#0ff", "track-fg2":"#c0c", "track-bg3":"#008282", "track-fg3":"#fff", "track-font":"Georgia, Times New Roman, serif" },
"Spider": { /* 005682 */ "con-bg1":"#069", "con-bg2":"#036", "con-fg":"#fff", "con-fg2":"#000", "con-font":"Georgia, Times New Roman, serif", "scrub-bg":"#069", "scrub-bg2":"#036", "scrub-fg":"#f00", "track-null":"#000", "track-hr":"#000", "track-bg":"#003", "track-fg":"#ccc", "track-bg2":"#f90", "track-fg2":"#000", "track-bg3":"#005682", "track-fg3":"#fff", "track-font":"Georgia, Times New Roman, serif" },
"Strongbow": { /* 000056 */ "con-bg1":"#009", "con-bg2":"#006", "con-fg":"#fff", "con-fg2":"#999", "con-font":"Courier New, Courier, monospaced", "scrub-bg":"#009", "scrub-bg2":"#006", "scrub-fg":"#416600", "track-null":"#333", "track-hr":"#333", "track-bg":"#000", "track-fg":"#ccc", "track-bg2":"#a10000", "track-fg2":"#fff", "track-bg3":"#000056", "track-fg3":"#fff", "track-font":"Courier New, Courier, monospaced" },
"Clown": { /* 2b0057 */ "con-bg1":"#306", "con-bg2":"#003", "con-fg":"#fff", "con-fg2":"#0f0", "con-font":"Verdana, Arial, sans-serif", "scrub-bg":"#306", "scrub-bg2":"#003", "scrub-fg":"#0f0", "track-null":"#333", "track-hr":"#333", "track-bg":"#2b0057", "track-fg":"#ccc", "track-bg2":"#391e71", "track-fg2":"#0f0", "track-bg3":"#391e71", "track-fg3":"#9c4dad", "track-font":"Verdana, Arial, sans-serif", },
"Emperor": { /* 610061 */ "con-bg1":"#606", "con-bg2":"#303", "con-fg":"#fff", "con-fg2":"#333", "con-font":"Verdana, Arial, sans-serif", "scrub-bg":"#606", "scrub-bg2":"#303", "scrub-fg":"#b11262", "track-null":"#000", "track-hr":"#333", "track-bg":"#303", "track-fg":"#ccc", "track-bg2":"#ffe094", "track-fg2":"#333", "track-bg3":"#610061", "track-fg3":"#fff", "track-font":"Verdana, Arial, sans-serif", },
"Coral": { /* 77003c */ "con-bg1":"#3ff", "con-bg2":"#09f", "con-fg":"#000", "con-fg2":"#666", "con-font":"Georgia, Times New Roman, serif", "scrub-bg":"#3ff", "scrub-bg2":"#0f9", "scrub-fg":"#d121c1", "track-null":"#09c", "track-hr":"#36c", "track-bg":"#09c", "track-fg":"#fff", "track-bg2":"#d121c1", "track-fg2":"#fff", "track-bg3":"#b11262", "track-fg3":"#ccc", "track-font":"Georgia, Times New Roman, serif" }
/* "Near": { b536da & ffff01 } */
/* "Far":  { 9700e4 & ff01fe } */
}
