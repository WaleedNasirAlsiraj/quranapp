"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import AyahItem from "@/components/AyahItem.jsx";
import { Button } from "@/components/ui/button";
import { Pause, SkipBack, SkipForward, Play } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { Download } from "lucide-react";
import { useTheme } from "next-themes";
import makkahImage from "@/public/assets/imgs/makkah_dark.png";
import makkahImageLight from "@/public/assets/imgs/makkah.png";

const Page = ({ params }) => {
  const router = useRouter();
  const [data, setData] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const {playing,audioSrc, setAudioSrc, setPlaying, setSurahNumber } = usePlayerStore(
    (state) => ({
      audioSrc: state.audioSrc,
      playing: state.playing,
      setAudioSrc: state.setAudioSrc,
      setPlaying: state.setPlaying,
      setSurahNumber: state.setSurahNumber,
    })
  );
  const { theme } = useTheme();

  useEffect(() => {
  

    // Fetch surah data
    const fetchSurahData = async () => {
      try {
        const data = await fetch(
          `https://quran-endpoint.vercel.app/quran/${params.num}?imamId=42`
        );
        const dataJson = await data.json();
        // Once data is fetched, set the data state
        setData(dataJson.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSurahData();
  }, []);


  useEffect(() => {
    setSurahNumber(params.num);
    if (!playing || audioSrc !== data?.recitation.full) {
      setIsPlaying(false);
    }
  }, [params.num, playing, audioSrc]);

  const showData = () => {
    const ayahs = data?.ayahs;

    return ayahs.map((ayah, index) => {
      return (
        <AyahItem
          surahName={data.asma.en.short}
          surah={params.num}
          key={parseInt(index) + 1}
          data={ayah}
          />
      );
    });
  };

  const handleDownload = () => {
    const url = data.recitation.full;
    const filename = "audio.mp3";
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-3 flex flex-col gap-4 ">
      <Card className="bg-muted/40 relative overflow-hidden">
        <img
          className="absolute left-0"
          src={
            theme === "dark" || theme === "system"
              ? makkahImage?.src
              : makkahImageLight?.src
          }
          width={"135px"}
        />
        <div className="p-4 flex flex-col justify-center items-center">
          <p className="text-lg">
            {data?.asma.en.short} - {data?.asma.translation.en}
          </p>
          <p>
            Ayahs - {data?.ayahCount}, {data?.type.en}
          </p>
        </div>
      </Card>
      <Card className="bg-muted/40 flex flex-row items-center justify-center gap-4 p-4">
        <div className="flex flex-row justify-center items-center  gap-2">
          {params.num > 1 && (
            <Button
              onClick={() => {
                router.push(`${parseInt(params.num) - 1}`);
              }}
              variant="outline"
              size="smIcon"
            >
              <SkipBack size={18} />
            </Button>
          )}
          <Button
            onClick={() => {
              isPlaying ? setPlaying(false) : setPlaying(true);
              setIsPlaying(true);
              setAudioSrc(data.recitation.full);
            }}
            variant="secondary"
            size="iconRounded"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          {params.num < 114 && (
            <Button
              onClick={() => {
                router.push(`${parseInt(params.num) + 1}`);
              }}
              variant="outline"
              size="smIcon"
            >
              <SkipForward size={18} />
            </Button>
          )}
        </div>
        <div className="">
          <Button
            onClick={() => handleDownload()}
            variant="secondary"
            size="smIcon"
          >
            <Download size={18} className="" />
          </Button>
        </div>
      </Card>
      <div className="flex flex-col gap-4 mb-4">{data && showData()}</div>
    </div>
  );
};

export default Page;
