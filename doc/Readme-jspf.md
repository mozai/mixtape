JSPF is JSON XSPF. The definitions of JSPF fields follow from the XSPF
specification, but the expression uses Javascript.

This is documented by example, per the JSON below. The example below was
engineered by (in order of how many contributions they made) Sebastian
Pipping, Chris Anderson and Ivo Emanuel Gonçalves.

A simplified version, without the full range of features:

```json
 {
   "playlist" : {
     "title"         : "Two Songs From Thriller", // name of the playlist
     "creator"       : "MJ Fan", // name of the person who created the playlist
     "track"         : [
       {
         "location"      : ["http://example.com/billiejean.mp3"], 
         "title"         : "Billie Jean",
         "creator"       : "Michael Jackson",
         "album"         : "Thriller"
       }, 
       {
       "location"      : ["http://example.com/thegirlismine.mp3"], 
       "title"         : "The Girl Is Mine",
       "creator"       : "Michael Jackson",
       "album"         : "Thriller"
       }
     ]
   }
 }
```

Comprehensive example:

```json
 {
   "playlist" : {
     "title"         : "JSPF example",
     "creator"       : "Name of playlist author",
     "annotation"    : "Super playlist",
     "info"          : "http://example.com/",
     "location"      : "http://example.com/",
     "identifier"    : "http://example.com/",
     "image"         : "http://example.com/",
     "date"          : "2005-01-08T17:10:47-05:00",
     "license"       : "http://example.com/",
     "attribution"   : [
       {"identifier"   : "http://example.com/"},
       {"location"     : "http://example.com/"}
     ],
     "link"          : [
       {"http://example.com/rel/1/" : "http://example.com/body/1/"},
       {"http://example.com/rel/2/" : "http://example.com/body/2/"}
     ],
     "meta"          : [
       {"http://example.com/rel/1/" : "my meta 14"},
       {"http://example.com/rel/2/" : "345"}
     ],
     "extension"     : {
       "http://example.com/app/1/" : [ARBITRARY_EXTENSION_BODY, ARBITRARY_EXTENSION_BODY],
       "http://example.com/app/2/" : [ARBITRARY_EXTENSION_BODY]
     },
     "track"         : [
       {
         "location"      : ["http://example.com/1.ogg", "http://example.com/2.mp3"],
         "identifier"    : ["http://example.com/1/", "http://example.com/2/"],
         "title"         : "Track title",
         "creator"       : "Artist name",
         "annotation"    : "Some text",
         "info"          : "http://example.com/",
         "image"         : "http://example.com/",
         "album"         : "Album name",
         "trackNum"      : 1,
         "duration"      : 0,
         "link"          : [
           {"http://example.com/rel/1/" : "http://example.com/body/1/"},
           {"http://example.com/rel/2/" : "http://example.com/body/2/"}
         ],
         "meta"          : [
           {"http://example.com/rel/1/" : "my meta 14"},
           {"http://example.com/rel/2/" : "345"}
         ],
         "extension"     : {
           "http://example.com/app/1/" : [ARBITRARY_EXTENSION_BODY, ARBITRARY_EXTENSION_BODY],
           "http://example.com/app/2/" : [ARBITRARY_EXTENSION_BODY]
         }
       }
     ]
   }
 }
```

One way to convert XSPF to JSPF is to use
github.com/jchris/xspf-to-jspf-parser

The Xiph OSC and XSPF logos are trademarks of Xiph.Org.

These pages © 1994 - 2021 Xiph.Org. All rights reserved.

