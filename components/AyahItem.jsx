import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Bookmark, Ellipsis, Play, Link, Copy, Download, BookmarkCheck, Pause } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { usePlayerStore } from "@/store/playerStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageGenerator from "./ImageGenerator";
import copy from "copy-to-clipboard";
import { handleBookmarks } from "@/utils/handleBookmarks";

const AyahItem = (props) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState()
  
  const [isBookmarked, setIsBookmarked] = useState()
  const {audioSrc, setAudioSrc, playing, setPlaying} = usePlayerStore((state)=>({
    audioSrc: state.audioSrc,
    setAudioSrc: state.setAudioSrc,
    playing: state.playing,
    setPlaying: state.setPlaying
  }))

  useEffect(()=>{
    if(!playing || audioSrc !== props.data.audio.url){
      setIsPlaying(false)
    }
  },[playing,audioSrc])


  const handleShare = () =>{

    const share = `https://waleedquranapp.netlify.app/share/${props.surah}-${props.data.number.insurah}`

    try{

      copy(share)

      toast({
        title: `Share Link is copied to your clipboard!`,
      });

    }catch(err){
      console.log(err)
      toast({
        variant: "destructive",
        title: "Uh Oh! Something went wrong",
      });
    }
  }

  const handleCopy = () => {
    const copyText = `Translation: ${props.data.translation.en} - Ayah: ${props.data.text.ar}`;

    try {
      copy(copyText);
      toast({
        title: "Text copied to clipboard!",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh Oh! Something went wrong",
      });
    }
  };


  let surahNumber = props.surah;
  let ayahNumber = props.data.number.insurah;

  useEffect(()=>{
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    const index = bookmarks.findIndex(bookmark => bookmark.surah === surahNumber && bookmark.ayah === ayahNumber);
  
    if (index !== -1) {
      setIsBookmarked(true)
    } else {
      setIsBookmarked(false)
    }


  },[])

  const bookmark = () => {

   setIsBookmarked( handleBookmarks(surahNumber, ayahNumber))
  };


  return (
    <Card className="p-5 bg-muted/40 opacity-70 transition-all hover:opacity-100 scale">
      <div className="flex flex-row justify-between items-center gap-5">
        <div className="flex flex-col gap-2">
          <Button onClick={()=>{
            isPlaying? setPlaying(false) : setPlaying(true)
            setIsPlaying(true)
            setAudioSrc(props.data.audio.url)
            }} variant="outline" size="smIcon">
            {isPlaying? <Pause size={15} />:<Play size={15} />}
          </Button>
          <Button
              onClick={() =>bookmark()}
              variant={isBookmarked? "secondary":"outline"}
              size="smIcon"
            >
             
              {isBookmarked? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
            </Button>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" size="smIcon">
                  <Ellipsis size={15} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={()=> handleShare()}>
                  <Link className="mr-2" size={15} />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy()}>
                  <Copy className="mr-2" size={15} />
                  Copy
                </DropdownMenuItem>

                <DialogTrigger className="w-full">
                  <DropdownMenuItem className="w-full ">
                    <Download className="mr-2" size={15} />
                    Download
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-5">Download</DialogTitle>
                <ImageGenerator
                  ayah={props.data.text.ar}
                  translation={props.data.translation.en}
                  audio={props.data.audio.url}
                />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <h1 className="text-2xl text-right">{props.data.text.ar} </h1>
          <div className="">
            <p className="text-xs">Translation :</p>
            <p className="text-left text-sm">{props.data.translation.en}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AyahItem;
