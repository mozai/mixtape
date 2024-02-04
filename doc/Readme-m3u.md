M3U
---
It was invented by Nullsoft for use with Winamp.  Any official
document definition has been lost, the following paragraph is
about as official as it gets.

It will be a list of records separted by '\n' newline bytes.
Each record is a location: relative path, absolute path, or URL, 
that is the location of a media file to be played sequentially.
Records that start with '#' are ignored.  If the file ends in
.m3u8 instead of .m3u, then the content bytes should be interpreted
as UTF-8 Unicode instead of 7-bit ASCII.

Start the file with a `#EXTM3U` record and you can add metadata before
each record.  Some metadata must only appear once (1) in each file:

* `#EXTM3U` (1) must be first record
* `#EXTINF:` duration in seconds, comma, display text

The rest are not always supported.  The IPTV addtions were

* `#EXTINF:` duration in seconds, comma, key=value pairs, comma, display text
* `#PLAYLIST:` (1) display text for the playlist as a whole
* `#EXTGRP:` start of a named group

Then the Albumlist additions by Winamp 

* `#EXTALB:` (1) display text for the album/grouping of the next location
* `#EXTART:` (1) display text for the "albumartist", the performer of all tracks
* `#EXTGENRE:` (1) catalogue text for genre

Then some stuff added by birdcagesoft

* `#EXTM3A:` "playlist for tracks or chapters of an album in a single file"
* `#EXTBYT:` size of what's at the next location, in bytes
* `#EXTBIN:` binary data follows, usually concatenated MP3s

These ones are really not supported

* `#EXTENC:` (1) text encoding, must be second line. i.e. "UTF-8"
* `#EXTIMG:` location of artwork to display while playing this media

There are twenty more `#EXT-X-...` types added by Apple, described
in RFC8216 for use in video streams, but I won't bother mentioning them.  

I noticed similarity with XSPF / JSPF.  Maybe could make an m3u interpreter.
Update 2023-12-17: I did in Javascript.

