"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import {
  Bookmark,
  Pause,
  Play,
  Repeat,
  Repeat1,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "./ui/button";
import { usePlayerStore } from "@/store/playerStore";
import { useRouter } from "next/navigation";

const Player = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef();
  const router = useRouter()

  const { playing, audioSrc, repeat, setPlaying, setRepeat, surahNumber } =
    usePlayerStore((state) => ({
      playing: state.playing,
      audioSrc: state.audioSrc,
      repeat: state.repeat,
      setPlaying: state.setPlaying,
      setRepeat: state.setRepeat,
      surahNumber: state.surahNumber,
    }));

  useEffect(() => {

    repeat ? (audioRef.current.loop = true) : (audioRef.current.loop = false);

    

    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [playing, audioSrc, repeat]);

  useEffect(() => {
    // Update current time state when audio time updates
    const updateTime = () => {
      const newTime = audioRef?.current?.currentTime;
      setCurrentTime(newTime);
    };

    audioRef?.current?.addEventListener("timeupdate", updateTime);

    return () => {
      audioRef?.current?.removeEventListener("timeupdate", updateTime) || null
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div
      className={`transition-all duration-1000 absolute bottom-0 w-full ${
        playing ? "show_player" : "hidden_player"
      }`}
    >
      <Card>
        <div className="audio absolute hidden">
          <audio
            ref={audioRef}
            onEnded={() => setPlaying(!playing)}
            src={audioSrc}
          ></audio>
        </div>
        <div className="p-5 pb-8 flex flex-row w-full m-auto justify-center bg-muted/15 items-center">
          <div className="flex flex-col w-[90vw] justify-center items-center gap-4">
            <div className="w-full flex flex-row justify-between items-center">
              <div className="flex flex-row justify-center items-center gap-2 w-full">
                {parseInt(surahNumber) > 1 && (
                  <Button
                    onClick={() => {
                      router.push(`/surah/${parseInt(surahNumber) - 1}`);
                    }}
                    variant="outline"
                    size="smIcon"
                  >
                    <SkipBack size={20} />
                  </Button>
                )}
                <Button
                  onClick={() => {
                    audioRef.current.pause();
                    setPlaying(!playing);
                  }}
                  variant="secondary"
                  size="iconRounded"
                >
                  {playing ? <Pause size={20} /> : <Play size={20} />}
                </Button>
                {parseInt(surahNumber) < 114 && (
                  <Button
                    onClick={() => {
                      router.push(`/surah/${parseInt(surahNumber) + 1}`);
                    }}
                    variant="outline"
                    size="smIcon"
                  >
                    <SkipForward size={20} />
                  </Button>
                )}
                <Button
                  onClick={() => setRepeat(!repeat)}
                  variant="outline"
                  size="smIcon"
                >
                  {repeat ? <Repeat1 size={15} /> : <Repeat size={15} />}
                </Button>
              </div>
            </div>
            <div className="w-full flex flex-row gap-3">
              <Slider
                onValueChange={(newValue) => {
                  const newTime =
                    (newValue / 100) * audioRef?.current?.duration;
                  setCurrentTime(newTime);
                  audioRef.current.currentTime = newTime;
                }}
                value={[(currentTime / audioRef?.current?.duration) * 100]}
                defaultValue={[0]}
                max={100}
                step={1}
                variant="soft"
              />{" "}
              {formatTime(currentTime)}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Player;
