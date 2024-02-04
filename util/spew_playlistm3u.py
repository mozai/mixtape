#!/usr/bin/env python3
" give me a dir of music files, I will spew the M3U file "
# ref  Ha, nullsort wrote one text file decades ago
import os
import json
import sys
import mutagen


def file_to_trackobj(infile):
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


def dir_to_playlist_obj(dirname):
    " spew json at you "
    # How does it feel to treat me like you do
    # When you lay your hands upon me and tell me who you are
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
            playlist['track'].append(file_to_trackobj(i.path))
    playlist['track'] = sorted(playlist['track'], key=lambda x: x['location'])
    return playlist


def playlist_to_jspf(plist):
    " spew jspf to stdout "
    json.dump(plist, sys.stdout)


def playlist_to_m3u(plist):
    " spew m3u to stdout "
    print("#EXTM3U")
    print("#EXTENG utf-8")
    if plist["annotation"]:
        print(f"""#PLAYLIST {plist["annotation"]}""")
    for track in plist["track"]:
        if track.get("image"):
            print(f"""#EXTIMG {track["image"]}""")
        title = ""
        if track.get("creator"):
            title = f"""{track["creator"]} - {track["title"]}"""
            # if track.get("creator") and track.get("album"):
            #    title = f"""{track["creator"]} - {track["title"]} - {track["album"]}"""
        elif track.get("title"):
            title = f"""{track["title"]}"""
        if not title:
            title = track["location"]
            if '/' in title:
                title = title[title.rfind('/')+1:]
            if '.' in title:
                title = title[:title.rfind('.')]
            title = title.replace('_', ' ')
        print(f"""#EXTINF {track["duration"]},{title}""")
        print(f"""{track["location"]}""")


def main():
    " Zhu Li!  Do the thing! "
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} dir_of_music_files", file=sys.stderr)
        print(
            "  give me a dir of music files, I will spew the jukebox JSPF", file=sys.stderr)
        sys.exit(1)
    plist = dir_to_playlist_obj(sys.argv[1])
    playlist_to_m3u(plist)


main()
