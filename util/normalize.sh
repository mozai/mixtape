#!/bin/bash
# linear boost in volume so the peak is 100% aka +0.0dB
# reduces bandwidth to 64kB because this is a mixtape not a CD

if [[ -z "$1" ]]; then
	echo >&2 "Usage; $0 somefile.mp3"
	echo >&2 "Does a linear volume boost so it peaks at +0.0dB"
	echo >&2 "!! WARNING this overwrites the file in-place !!"
	exit 1
fi
for f in "$@"; do
	boost=""
	if [[ ! -e "$f" ]]; then
		echo >&2 "$f : file missing";
		continue
	elif [[ ! "${f##*.}" != .mp3 ]]; then
		echo >&2 "$f : not an .mp3 file";
		continue
	fi
	boost=$(ffmpeg -hide_banner -i "$f" -map 0:a:0 -filter:a volumedetect -f null /dev/null 2>&1 |grep Parsed |sed -n -r 's/.* max_volume: -(.*?) dB/\1/p')
	if [[ -n "$boost" ]] && [[ "$(bc -l <<<"$boost > 1")" == 1 ]]; then
		verbosity=(-v warning)
		if [[ -t 0 ]]; then
			echo "$f : boosting by +$boost dB"
			verbosity+=(-stats)
		fi
		ffmpeg "${verbosity[@]}" -i "$f" -vn -b:a 64k -af "volume=${boost}dB" "tmp.$f" && mv -f "tmp.$f" "$f"
	else
		[[ -t 0 ]] && echo "$f : no boost needed (${boost:-n/a})"
	fi
done
