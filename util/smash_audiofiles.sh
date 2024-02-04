#!/bin/bash
# give me one or more music files, I will smash them down to 64kbs
#  unless they're already 64kps or worse
# yeah yeah, loss of fidelity; the skeumorph is casette mixtapes,
#   and the intended viewing platform is something with crap speakers
#   so 384kbps 48kHz FLAC would be a waste.

# Requires: ffmpeg, ffprobe

function smash(){
	# hulk smash
	local -A attribs
	local src dostats dst tempfile
	if [[ ! -e "$1" ]]; then
		echo >&2 "No such file: $1"
		return 1
	fi
	src="$1"
	while IFS='=' read -r k v ; do
		attribs[$k]=$v
	done < <(ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate,bit_rate,duration -of default=noprint_wrappers=1 "$src")
	if [[ -z "${attribs["bit_rate"]}" ]]; then
		echo "ERR no bitrate found for $src"
		return 1
	fi
	attribs["duration"]=$(printf "%.0f" "${attribs["duration"]}")  # round to nearest integer
	if [[ ${attribs["bit_rate"]} -le 64000 ]]; then
		printf "INFO bitrate %.0fk<=64k for %s\n" "$(( attribs["bit_rate"] / 1000 ))" "$src"
		return 0
	fi
	printf "smashing \"%s\" from %.0fk to 64k\n" "$src" "$(( attribs["bit_rate"] / 1000 ))"
	tempfile=$(mktemp --suffix .mp3)
	[[ -t 0 ]] && dostats="-stats"
	if ffmpeg -v error "$dostats" -i "$src" -ar 44100 -vn -b:a 64k -y "$tempfile"; then
		dst="${src%.*}.mp3"
		rm -f "$src"
		mv "$tempfile" "$dst" && chmod +r "$dst" && echo "INFO updated $dst"
	else
		rm -f "$tempfile"
	fi
}

if [[ -z "$*" ]]; then
	echo >&2 "I need some files to smash, dude"
	exit 1
fi
for i in "$@"; do
	if [[ ! -f "$i" ]]; then
		echo >&2 "not a file, skipping $i"
		continue
	fi
	smash "$i"
done
