"use client"
import makkahImage from '@/public/assets/imgs/makkah_dark.png'
import makkahImageLight from '@/public/assets/imgs/makkah.png'
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import AyahItem from '@/components/AyahItem.jsx';
import { Button } from '@/components/ui/button';
import { Pause, SkipBack, SkipForward, Play } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';


const Page = ({ params }) => {
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [transData, setTransData] = useState([]);
  const {theme} = useTheme()
  const [arabicData, setArabicData] = useState([]);
  const [data, setData] = useState()
  const {playing,audioSrc,setAudioSrc,setPlaying} = usePlayerStore((state)=>({
    playing: state.playing,
    audioSrc: state.audioSrc,
    setAudioSrc: state.setAudioSrc,
    setPlaying: state.setPlaying
  }))


  

  useEffect(() => {



    const fetchSurahData = async () => {
      try {

        const data = await fetch(`https://quran-endpoint.vercel.app/quran/${params.num}?imamId=4`)
        const dataJson = await data.json()
        setData(dataJson.data)


      } catch (err) {
        console.log(err);
      }
    };

    fetchSurahData();
  }, []);

  useEffect(()=>{
    if(!playing || audioSrc !== data.recitation.full){
      setIsPlaying(false)
    }
  },[playing,audioSrc])

  const showData = () => {
    const ayahs = data?.ayahs;


    return ayahs.map((ayah, index) => {

      return (
        <AyahItem surah={params.num} key={index} data={ayah}/>
      )
    });
  
  };

  return (
    <div className='p-3 flex flex-col gap-4 '>
        <Card className="bg-muted/40 relative overflow-hidden">
          <img className='absolute left-0' src={theme === "dark" || theme === "system" ? makkahImage?.src : makkahImageLight?.src} width={"135px"}/>
            <div className="p-4 flex flex-col justify-center items-center">
              <p className='text-lg'>{data?.asma.en.short} - {data?.asma.translation.en}</p>
              <p>Ayahs - {data?.ayahCount}, {data?.type.en}</p>
            </div>
        </Card>
        <Card className="bg-muted/40 flex flex-row justify-center items-center p-4 gap-3">
                <Button variant="outline" size="smIcon">
                  <SkipBack size={20} />
                </Button>
                <Button onClick={()=>{
                  isPlaying? setPlaying(false) : setPlaying(true)
                  setIsPlaying(true)
                  setAudioSrc(data.recitation.full)
                }} variant="secondary" size="iconRounded">
                  {isPlaying? <Pause size={20} /> :  <Play size={20} />} 
                </Button>
                <Button variant="outline" size="smIcon">
                  <SkipForward size={20} />
                </Button>
        </Card>
        <div className="flex flex-col gap-4 mb-4">
        {data && showData()}
        </div>
    </div>
  );
};

export default Page;