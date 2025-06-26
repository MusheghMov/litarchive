"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "../ui/slider";

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
  className?: string;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (values: number[]) => {
    const [value] = values;
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(value.toString());
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (values: number[]) => {
    const [value] = values;
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(value.toString());
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const resetAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
    audio.pause();
  };

  return (
    <>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex w-fit items-center gap-2">
        <div className="flex items-center gap-x-2">
          <Button
            variant="ghost"
            className="h-min w-min p-0"
            size="icon"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause /> : <Play />}
          </Button>

          <Button
            variant="ghost"
            className="h-min w-min p-0"
            size="icon"
            onClick={resetAudio}
          >
            <RotateCcw />
          </Button>
        </div>

        <Slider
          className="w-[200px]"
          defaultValue={[currentTime]}
          value={[currentTime]}
          onValueChange={handleSeek}
          max={duration}
          step={1}
        />

        <div className="flex min-w-[100px] items-center space-x-2">
          <Button
            variant="ghost"
            className="h-min w-min p-0"
            size="icon"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX /> : <Volume2 />}
          </Button>
          <Slider
            defaultValue={[isMuted ? 0 : volume]}
            value={[isMuted ? 0 : volume]}
            onValueChange={handleVolumeChange}
            max={1}
            step={0.1}
          />
        </div>
      </div>
    </>
  );
}
