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
each record.  Records marked with "(1)" can only appear once in the
entire file.  These two are always supported, what follows are extentions
that may not be recognized by other software.

* `#EXTM3U` (1) must be first record
* `#EXTINF:` duration in seconds, comma, display text

The IPTV addtions were:

* `#EXTINF:` duration in seconds, comma, _key=value pairs, comma,_ display text
* `#PLAYLIST:` (1) display text for the playlist as a whole
* `#EXTGRP:` start of a named group _(how do I end a group?)_

The Winamp additions for Albumlist (seems it assumes only one album per playlist):

* `#EXTALB:` (1) display text for the album/grouping of the next location
* `#EXTART:` (1) display text for the "albumartist", the performer of all tracks
* `#EXTGENRE:` (1) catalogue text for genre

The Birdcagesoft additions:

* `#EXTM3A:` "playlist for tracks or chapters of an album in a single file"
* `#EXTBYT:` size of what's at the next location, in bytes
* `#EXTBIN:` binary data follows, usually concatenated MP3s

These next two are rarely supported:

* `#EXTENC:` (1) text encoding, must be second line. i.e. "UTF-8"
* `#EXTIMG:` location of artwork to display while playing this media

There are twenty more `#EXT-X-...` types added by Apple, described
in RFC8216 for use in video streams, but I won't bother mentioning them.  

I ended up using this instead of JSPF/XSPF and I prefer it.

