#!/bin/bash
# chop off the quiet bits at the start and end of an audio file
#  they'll tell you to use `-af silenceremove`
#  but that re-encodes the file

SILENCE_FLOOR=-60dB

if [[ -z "$*" ]]; then
	echo >&2 "Usage: $0 audiofile.mp3 [ audiofile2.mp3 autofile3.mp3 ... ]"
	echo >&2 "  trims the file in-place, chanding its duration "
	echo >&2 "  does is without reencoding, lossless-ish"
	exit 1
fi

for infile in "$@"; do
	ext=${infile##*.}
	case $ext in
		mp3|wav|opus|m4a|aac)
			: "okay"
			;;
		*)
			echo >&2 "WARN unrecognized file \"$infile\"; skipping"
			continue
			;;
	esac
	tmpout=$(mktemp "./tmp.XXXXXX.${ext}")
	ss=""
	to=""
	while read -r line; do
		if [[ $line =~ silence_end= ]]; then
			ss=${line#*=}
		fi
		if [[ -n $ss ]] && [[ $line =~ silence_start= ]]; then
			to=${line#*=}
		fi
	done < <(ffmpeg -hide_banner -v "-8" -i "$infile" -af "silencedetect=n=${SILENCE_FLOOR}:d=1,ametadata=print:file=-" -f null -)
	if [[ -z "$ss" ]] && [[ -z "$to" ]]; then
		echo "INFO nothing quieter than ${SILENCE_FLOOR} to trim; skipping"
		continue;
	fi
	args=()
	[[ -n $ss ]] && args+=(-ss "$ss")
	[[ -n $to ]] && args+=(-to "$to")
	[[ -t 0 ]] && ls -l "$infile"
	[[ -t 0 ]] && echo "DBUG ffmpeg -hide_banner -v warning -i \"$infile\" -c copy ${args[*]} -y \"$tmpout\""
	if ffmpeg -hide_banner -v warning -i "$infile" -c copy "${args[@]}" -y "$tmpout"; then
		mv "$tmpout" "$infile"
		[[ -t 0 ]] && ls -l "$infile"
	else
		rm "$tmpout"
	fi
done

