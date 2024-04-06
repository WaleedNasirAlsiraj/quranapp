"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import React, { useEffect, useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "./ui/button";
import {
  Download,
  RefreshCcw,
  Upload,
  AlignLeft,
  AlignRight,
  AlignCenter,
} from "lucide-react";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";
import { Slider } from "./ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "./ui/skeleton";

const ImageGenerator = (props) => {
  const constraintsRef = useRef(null);
  const imageRef = useRef();
  const [transTextAlign, setTransTextAlign] = useState("text-center");
  const [ayahAlign, setAyahAlign] = useState("text-center");
  const [image, setImage] = useState();
  const [isDownloading, setIsDownloading] = useState(false);
  const [textFont, setTextFont] = useState([25]);
  const [backdrop, setBackdrop] = useState([50]);
  const [transFont, setTransFont] = useState([20]);
  const [transWidth, setTransWidth] = useState([20]);
  const [ayahWidth, setAyahWidth] = useState([20]);
  const [transCheck, setTransCheck] = useState(false);
  const [refCheck, setRefCheck] = useState(true);
  const [refFont, setRefFont] = useState([16]);
  const [formatt, setFormatt] = useState(
    `Quran (${props.surah} : ${props.ayahNumber})`
  );

  useEffect(() => {
    fetchRandomNatureImage("2000", "1500");
  }, []);

  const fetchRandomNatureImage = async (width, height) => {
    try {
      const response = await fetch(
        `https://source.unsplash.com/featured/${width}x${height}/?nature`
      );
      const imageUrl = response.url;
      imageRef.current.src = imageUrl;
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

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataURL = reader.result;
        imageRef.current.src = dataURL;
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="">
      <div id="image-container" className="w-full h-fit " ref={constraintsRef}>
        <div className=" rounded-xl overflow-hidden image relative w-full">
          <img width={"100%"} ref={imageRef} className="relative" alt="" />
          <div
            className={`absolute top-0 left-0 w-full h-full bg-black`}
            style={{ opacity: `${backdrop}%` }}
          ></div>
          <div className="w-full h-full p-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <motion.p
              drag
              dragMomentum={false}
              dragConstraints={constraintsRef}
              whileDrag={{ scale: 1.03 }}
              style={{
                fontSize: `${textFont}px`,
                margin: `0px ${ayahWidth}px`,
              }}
              className={`fixed arabic text-white w-fit ${ayahAlign}`}
            >
              {props.ayah}
            </motion.p>
            {transCheck ? (
              <motion.p
                style={{
                  fontSize: `${transFont}px`,
                  margin: `0px ${transWidth}px`,
                }}
                className={`fixed text-white w-fit ${transTextAlign}`}
                drag
                dragMomentum={false}
                dragConstraints={constraintsRef}
                whileDrag={{ scale: 1.03 }}
              >
                {props.translation}
              </motion.p>
            ) : (
              ""
            )}
            {refCheck && (
              <motion.p
                drag
                className="fixed text-white w-fit"
                // dragElastic={false}
                dragMomentum={false}
                dragConstraints={constraintsRef}
                whileDrag={{ scale: 1.03 }}
                style={{ fontSize: `${refFont}px` }}
              >
                {formatt}
              </motion.p>
            )}
          </div>
        </div>

        {/* {!image && <Skeleton className="w-full h-[300px]" />} */}
      </div>

      <div className="settings py-4 gap-4">
        <div className="flex flex-row gap-4">
          <div className="flex flex-row items-center justify-start gap-2 mb-4">
            <Checkbox
              checked={transCheck}
              onCheckedChange={(e) => setTransCheck(!transCheck)}
              id="trans"
            />
            <label htmlFor="trans">Translation Text</label>
          </div>
          <div className="flex flex-row items-center justify-start gap-2 mb-4">
            <Checkbox
              checked={refCheck}
              onCheckedChange={(e) => setRefCheck(!refCheck)}
              id="ref"
            />
            <label htmlFor="ref">Reference</label>
          </div>
        </div>
        <p className="">Backdrop Opacity:</p>
        <div className="flex flex-row gap-3 mb-4 items-center justify-center">
          <Slider
            onValueChange={(e) => setBackdrop(e)}
            defaultValue={[16]}
            min={0}
            max={100}
            step={1}
          />
          <p>{`${backdrop}%`}</p>
        </div>
        <Tabs defaultValue="ayah" className="w-full">
          <TabsList className="w-full items-stretch">
            <TabsTrigger className="w-full" value="ayah">
              Ayah
            </TabsTrigger>
            {transCheck && (
              <TabsTrigger className="w-full" value="translation">
                Translation
              </TabsTrigger>
            )}
            {refCheck && (
              <TabsTrigger className="w-full" value="reference">
                Reference
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="ayah">
            {/* Ayat walay option ider */}

            <p className="">Ayah Font:</p>
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

            <p className="">Width:</p>
            <div className="flex flex-row gap-3 items-center justify-center">
              <Slider
                onValueChange={(e) => setAyahWidth(e)}
                defaultValue={[16]}
                min={0}
                max={100}
                step={1}
              />
              <p>{`${ayahWidth}px`}</p>
            </div>

            <ToggleGroup
              defaultValue="text-center"
              onValueChange={(e) => {
                setAyahAlign(e);
              }}
              className="my-3 "
              type="single"
              variant="outline"
            >
              <ToggleGroupItem value="text-left">
                <AlignLeft size={15} />
              </ToggleGroupItem>
              <ToggleGroupItem value="text-center">
                <AlignCenter size={15} />
              </ToggleGroupItem>
              <ToggleGroupItem value="text-right">
                <AlignRight size={15} />
              </ToggleGroupItem>
            </ToggleGroup>
          </TabsContent>
          <TabsContent value="translation">
            {/* translation walay ider */}

            <>
              <p className="">Translation Font:</p>
              <div className="flex flex-row gap-3 items-center justify-center">
                <Slider
                  onValueChange={(e) => setTransFont(e)}
                  defaultValue={[16]}
                  min={10}
                  max={40}
                  step={1}
                />
                <p>{`${transFont}px`}</p>
              </div>
              <p className="">Translation Width:</p>
              <div className="flex flex-row gap-3 items-center justify-center">
                <Slider
                  onValueChange={(e) => setTransWidth(e)}
                  defaultValue={[16]}
                  min={0}
                  max={100}
                  step={1}
                />
                <p>{`${transWidth}px`}</p>
              </div>
              <ToggleGroup
                defaultValue="text-center"
                onValueChange={(e) => {
                  setTransTextAlign(e);
                }}
                className="my-3 "
                type="single"
                variant="outline"
              >
                <ToggleGroupItem value="text-left">
                  <AlignLeft size={15} />
                </ToggleGroupItem>
                <ToggleGroupItem value="text-center">
                  <AlignCenter size={15} />
                </ToggleGroupItem>
                <ToggleGroupItem value="text-right">
                  <AlignRight size={15} />
                </ToggleGroupItem>
              </ToggleGroup>
            </>
          </TabsContent>
          <TabsContent value="reference">
            {/* ref walay ider */}

            <p className="">Reference Font:</p>
            <div className="flex flex-row gap-3 items-center justify-center">
              <Slider
                onValueChange={(e) => setRefFont(e)}
                defaultValue={[16]}
                min={10}
                max={40}
                step={1}
              />
              <p>{`${refFont}px`}</p>
            </div>

            <p className="mb-2">Reference Formatt:</p>
            <Select onValueChange={(e) => setFormatt(e)} defaultValue={formatt}>
              <SelectTrigger className="w-[230px]">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value={`Quran (${props.surah} : ${props.ayahNumber})`}
                >{`Quran (${props.surah} : ${props.ayahNumber})`}</SelectItem>
                <SelectItem
                  value={`[${props.surahName} : ${props.ayahNumber}]`}
                >{`${props.surahName} (${props.surah} : ${props.ayahNumber})`}</SelectItem>
                <SelectItem
                  value={`Surah ${props.surahName} | Ayah ${props.ayahNumber}`}
                >{`Surah ${props.surahName} | Ayah ${props.ayahNumber}`}</SelectItem>
              </SelectContent>
            </Select>
          </TabsContent>
        </Tabs>
      </div>
      <div className="mt-5 flex flex-row items-center justify-between">
        <div className="">
          <input
            type="file"
            accept="image/png, image/jpeg"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />
          <Button variant="secondary" size="icon" onClick={handleButtonClick}>
            <Upload size={15} />
          </Button>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <Button
            variant={isDownloading ? "ghost" : "outline"}
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download size={15} className="mr-2" />
            Download
          </Button>
          <Button
            onClick={() => {
              setImage(null);
              fetchRandomNatureImage("2000", "1500");
            }}
            variant="outline"
          >
            <RefreshCcw size={15} className="mr-2" />
            Regenerate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
