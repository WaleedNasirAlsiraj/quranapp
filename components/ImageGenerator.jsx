"use client";
import { Checkbox } from "@/components/ui/checkbox"

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Download, RefreshCcw } from "lucide-react";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";
import { Slider } from "./ui/slider";

const ImageGenerator = (props) => {
  const [image, setImage] = useState();
  const [isDownloading, setIsDownloading] = useState(false);
  const [textFont, setTextFont] = useState([16]);
  const [transCheck, setTransCheck] = useState(false);

  useEffect(() => {
    fetchRandomNatureImage("1500", "1000");
  }, []);

  const fetchRandomNatureImage = async (width, height) => {
    try {
      const response = await fetch(
        `https://source.unsplash.com/featured/${width}x${height}/?nature`
      );
      const imageUrl = response.url;
      setImage(imageUrl);
    } catch (error) {
      console.error("Error fetching random nature image:", error);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    const node = document.getElementById("image-container");
    const dataUrl = await htmlToImage.toPng(node); // Ensure toPng method is accessed properly
    download(dataUrl, "nature_image.png");
    setIsDownloading(false);
  };

  return (
    <div className="">
      <div
        className=" rounded-xl overflow-hidden image relative"
        id="image-container"
      >
        <img className="" src={image} alt="Nature" />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
        <div className="w-4/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p style={{fontSize: `${textFont}px`}} className=" text-white">{props.ayah}</p>
          {transCheck ? <p style={{fontSize: `${textFont}px`}} className=" text-white">{props.translation}</p> : ""}
        </div>
      </div>
      <div className="settings py-4 gap-4">
        <div className="flex flex-row items-center justify-start gap-2">
        <Checkbox checked={transCheck} onCheckedChange={(e)=> setTransCheck(!transCheck)} id="trans"/>
        <label htmlFor="trans">Translation Text</label>
        </div>
        <p className="text-lg">Text Font:</p>
        <div className="flex flex-row gap-3 items-center justify-center">
          <Slider
            onValueChange={(e) => setTextFont(e)}
            defaultValue={[16]}
            min={10}
            max={40}
            step={1}
          />
          <p>{`${textFont}px`}</p>

        </div>
      </div>
      <div className=" mt-5 flex flex-row gap-4 items-center justify-end">
        <Button
          variant={isDownloading ? "ghost" : "outline"}
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <Download size={15} className="mr-2" />
          Download
        </Button>
        <Button
          onClick={() => fetchRandomNatureImage("1500", "1000")}
          variant="outline"
        >
          <RefreshCcw size={15} className="mr-2" />
          Regenerate
        </Button>
      </div>
    </div>
  );
};

export default ImageGenerator;
