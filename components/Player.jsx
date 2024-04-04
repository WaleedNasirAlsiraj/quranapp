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

const Player = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef();

  const { playing, audioSrc, repeat, setPlaying, setRepeat } = usePlayerStore(
    (state) => ({
      playing: state.playing,
      audioSrc: state.audioSrc,
      repeat: state.repeat,
      setPlaying: state.setPlaying,
      setRepeat: state.setRepeat,
    })
  );

  useEffect(() => {
    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [playing, audioSrc]);

  var audioProgress = (currentTime / audioRef?.current?.duration) * 100;

  useEffect(() => {
    // Update current time state when audio time updates
    const updateTime = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    audioProgress = (currentTime / audioRef.current.duration) * 100;

    audioRef.current?.addEventListener("timeupdate", updateTime);

    return () => {
      audioRef.current?.removeEventListener("timeupdate", updateTime);
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
                <Button variant="outline" size="smIcon">
                  <Bookmark size={15} />
                </Button>
                <Button variant="outline" size="smIcon">
                  <SkipBack size={20} />
                </Button>
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
                <Button variant="outline" size="smIcon">
                  <SkipForward size={20} />
                </Button>
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
                value={[audioProgress]}
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
