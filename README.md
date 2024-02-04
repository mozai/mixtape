Jukebox
=======
A webpage that just plays music, no muss no fuss,
and it'll work on your smartphone too.

Remember to have website security so people can't deeplink
to your audio and image files.

### Inspiration
I started with an old version of "player" made by FPGAminer, who in turn
credits "Cats777" for making a Macromedia Flash player.
Cats777's version at [VIP Video Game Music](https://vipvgm.net).

### Requirements
* webserver, duh, but it's static files so no need for a LAMP stack.
* Python for what's in the utils/ subfolder
* ffmpeg (includes ffprobe) really helps for transcoding to .mp3

### TODOs
* dismiss the '?' box when user clicks outside it.
* normalizing audio; can be jarring when next track is +4.0dB louder
* bug: if you try clicking on scrubber before the first song plays you
  get "value is not floating-point" or weird no-mouseup event
* bug: clicking on the play/pause button before clicking on any
  of the tracks will toggle the button but not start the audio element.
* wrap it all in a class so we don't have global vars
* minifiy the html+css+js. have a human-readable version for
  working/learning, but publish the minified version.
* click on the cover art to get a larger pop-in, click anywhere to dismiss
* variable line-height based on # of tracks and window height?
  Some mixtapes are only a dozen songs, which makes for a big unused
  space.
* improve `spew_playlist`
  * javascript (nodejs) versions
  * parse .ogg, .m4a and .webm(audio) files
  * accept multiple subfolders or descend into subfolders or both
  * all-at-once thing to rebuild the playlist in each subfolder then
    rewrite config.js (It'll be fragile but convenient)
* more skins / colourschemes

How to make a playlist
----------------------
I prefer one folder = one playlist, and naming the track art files
the same as the associated audio file (ie. a.mp3 a.jpg).

I was using jspf for correctness, but it's easier and faster to
make m3u files, see [Readme-m3u](doc/Readme-m3u.md).  It can
be as simple as just a text file with one path to an mp3 file
per line; remember the paths are relative to the playlist.m3u file.
I included `util/spew_playlistm3u.py` to make it super-easy.

```
#EXTM3U
#EXTENG utf-8

#EXTIMG 1007-Darkness.jpg
#EXTINF 93120,George Buzinkai - Darkness - Mahou Neko sountrack
1007-Darkness.mp3
```

A more correct but not better method is JSPF files (JSON verions of XSPF).
See [Readme-jspf](doc/Readme-jspf.md).
I included `util/spew_playlistjspf.py` that I use for my own stuff. 

To pull out album art from the tracks:
```bash
cd foldername
for f in *.mp3 *.m4a; do
  g=${f%.*}.jpg;
  ffmpeg -loglevel error -n -i "$f" "$g"
  mogrify -strip -resize '300x300' "$g";
done
cd ..
```

If your album art is 1280x720 or 16:9 because you got it from a video
instead of ripping a CD like god intended:
```
convert 0102-BabyShark.webp -gravity Center -crop 720x720+0+0 \
  -resize 300x300 0102-BabyShark.jpg && rm 0102-BabyShark.webp
```

Once you have track art next to each music file,
`cd foldername; ../util/spew_playlistm3u.py . >playlist.m3u`
then edit config.js to add the new playlist.


Reading tags in music files
---------------------------
Easy because there's one standard right?  Okay, but at least MP3's "id3"
is consistent, yes? ... no.

**Vorbis** (.ogg) files have arbitrary key-value "tag" pairs.  The key
names always match /^[A-Z\/-]+$/.  The standard tags that can appear
once (and I care about) are:
ALBUM, ARTIST, PUBLISHER, COPYRIGHT (holder not date), DISCNUMBER,
LABEL, SOURCEMEDIA, TITLE, TRACKNUMBER, ENCODED-BY (who ripped it).
Standard tags (I care about) that can appear more than once are:
PERFORMER, GENRE, DATE (iso8601 format), COMMENT.

**MP3** have five different methods.  The ones called "V1" and "V1.1"
aren't tags, they're byte-ranges in some non-audio data appended on the
end of the file.  The ones called "V2", "V2.3" and "V2.4" are key-value pairs.
Here's a list of the ones I care about:

* GENREID (only in V1 and V1.1, a number in a look-up table, good luck)
* TITLE (V1), TT1 (V2), TIT1(V2.3)
* ARTIST, TP1, TPE1
* ALBUM, TAL, TALB
* TRACKNUM, TRK, TRCK
* YEAR, TYE, TYER
* COMMENT, COM, COMM

Mapping each of the Voribs tags and three types of MP3 tags to the XSPF
or JSPF track properties is an exercise for the reader.


Save disk space
---------------
If they're listening through a webbrowser or on a smartphone, they ain't
using quality speakers, we can smash the audio.

I left a bash script here: `util/smash_audiofiles.sh *.mp3` will do the needful.

Casette tapes have sample rates around 22050... can I use `-ar 32000`
for more savings?  (Answer: it saves 200 bytes, whoop-de-doo,
bitrate is where it's at).

What file format can I use?

* [Can I use .opus](https://caniuse.com/opus) ?  It tests better than
  .aac, .ogg and .mp3 in human listening tests.  (Answer: Opus doesn't
  work on Safari in macos nor in ios, and ios can only use Safari,
  and too many people own iPhones.)

* [Can I use .aac](https://caniuse.com/aac) ?  Would that mangle the
  metadata?  (Answer: Firefox only supports AAC when it's a channel in
  a .mp4 container.)

* [Can I use .ogg](https://caniuse.com/ogg) ?  It's unencumbered by
  the Frauhofer patents, blah blah interpol.  (Answer: same answer
  as for .opus)

* [Can I use .mp3](https://caniuse.com/mp3) ?  Everybody else does
  and peer pressure is a thing.  (Answer: yes, its supposed by Chrome,
  Chromium, Firefox, Macos Safari, ios Safari, MS Edge.)


Example-mixtape
---------------
I won't include my own mixtapes (duh) but an example is useful so here's
some royalty-free music from pixabay.  Technically I don't have to give
credit for non-commercial use but I will anyways:  the songs are by
Christoph Scholl aka [TuesdayNight](https://pixabay.com/users/tuesdaynight-24999875/)


Fontawesome
-----------
Until I replace it, I feel I'm obliged to mention the licensing terms
that FontAwesome offers me for use of their work.

> Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com
> License - https://fontawesome.com/license/free 
> (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
> Copyright 2023 Fonticons, Inc.

### Removing FontAwesome
It's not bad it's just heavy.  The stanard icon sets on the web are
- Font Awesome http://fortawesome.github.io/Font-Awesome/icons/#video-player
- Google Material Icons https://github.com/google/material-design-icons/
... but what if we could use Unicode instead?

```html
  <td id="btn-play" class="control-button">&#x23EF;</td>
  <td id="btn-prev" class="control-button">&#x23EE;</td>
  <td id="btn-next" class="control-button">&#x23ED;</td>
  <td id="btn-loop" class="control-button">&#x1F501;</td>
  <!-- ... -->
  <td id='btn-volume' class="control-button">&#x1F50A;</td>
```

Here's a list of Unicode; lighter, but risky because not everone's
computer has fonts with full Unicode support.

- Information "i" &#x2139; 
- Eject &#x23CF;
- Fast forward &#x23E9;
- Rewind, Fast backward &#x23EA;
- Fast increase &#x23EB;
- Fast decrease &#x23EC;
- Skip forward, Next track &#x23ED;
- Skip backward, Previous track &#x23EE;
- Play/pause toggle &#x23EF;
- Hourglass &#x23F3;
- Backward &#x23F4; unsupported?
- Forward, Play &#x23F5; unsupported?
- Increase, Volume up &#x23F6; unupported?
- Decrease, Volume down &#x23F7; unsupported?
- Pause &#x23F8;
- Stop &#x23F9;
- Standby/Power toggle &#x23FB; unsupported?
- Power on/off toggle &#x23FC; unsupported?
- (there's nothing in Unicode for sorting lists.  Use fancy "A" or "N" ?)

Unicode "Astral Plane" characters above xFFFF are less likely to be supported

- Shuffle &#x1F500;
- Repeat indefinitely &#x1F501;
- Speaker with cancellation stroke &#x1F507;
- Speaker with three sound waves &#x1F50A;

