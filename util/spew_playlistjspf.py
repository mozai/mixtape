#!/usr/bin/env python3
" give me a dir of music files, I will spew the JSPF file "
# ref  https://www.xspf.org/jspf
import os
import json
import sys
import mutagen


def file_to_track_obj(infile):
    " what it say on the tin"
    bname = os.path.basename(infile)
    tags1 = mutagen.File(infile)
    tags2 = {}
    if infile[:2] == "./":
        infile = infile[2:]
    tags2["location"] = infile
    tags2["duration"] = str(int(tags1.info.length * 1000))
    # vorbis, id3v1: "album", id3v2.2: "TAL", id3v2.3: "TALB"
    i = tags1.get("album") or tags1.get("TALB") or tags1.get("TAL")
    if i:
        # oggvorbis does all their tags as array for some reason
        if isinstance(i, list):
            i = i[0]
        tags2["album"] = str(i)
    i = tags1.get("artist") or tags1.get("TPE1") or tags1.get("TP1")
    if i:
        if isinstance(i, list):
            i = i[0]
        tags2["creator"] = str(i)
    i = tags1.get("title") or tags1.get("TIT2") or tags1.get("TT2")
    if i:
        if isinstance(i, list):
            i = i[0]
        tags2["title"] = str(i)
    else:
        tags2["title"] = bname[:-4]
    i = tags1.get("comment") or tags1.get("COMM") or tags1.get("COM")
    if i:
        if isinstance(i, list):
            i = i[0]
        tags2["annotation"] = str(i)
    # find cover art; don't try digging in the file expect it's nearby
    left = infile[:infile.rfind('.')]
    cover = os.path.join(os.path.dirname(infile), 'cover')
    for image in (left + '.jpg', left + '.png', cover + '.jpg', cover + '.png'):
        if os.path.exists(image):
            tags2["image"] = image
            break
    return tags2


def mk_playlist(dirname):
    " spew json at you "
    # KLF is gonna rock y'all
    # Ancients of Mu-mu
    playlist = {}
    playlist['title'] = dirname[dirname.rfind('/')+1:].replace("_", " ")
    playlist['track'] = []
    playlist['annotation'] = ""  # what should this be?
    for i in os.scandir(dirname):
        if not i.is_file():
            continue
        ext = i.path.lower()
        ext = ext[ext.rfind('.')+1:]
        if ext in ('mp3', 'm4a', 'ogg'):
            playlist['track'].append(file_to_track_obj(i.path))
    playlist['track'] = sorted(playlist['track'], key=lambda x: x['location'])
    return playlist


def main():
    " Zhu Li!  Do the thing! "
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} dir_of_music_files", file=sys.stderr)
        print(
            "  give me a dir of music files, I will spew the jukebox JSPF", file=sys.stderr)
        sys.exit(1)
    plist = mk_playlist(sys.argv[1])
    json.dump(plist, sys.stdout)


main()
