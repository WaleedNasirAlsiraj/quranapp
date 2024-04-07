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
  Bold,
  Italic,
  UnderlineIcon,
  Check,
  Plus,
  ImagePlus,
  ImageUp,
  Type,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { CheckboxItem } from "@radix-ui/react-dropdown-menu";
import { Separator } from "@radix-ui/react-select";
import { toast } from "./ui/use-toast";
import { Description } from "@radix-ui/react-dialog";

const ImageGenerator = (props) => {
  const constraintsRef = useRef(null);
  const [url, setUrl] = useState("");
  const [transTextAlign, setTransTextAlign] = useState("text-center");
  const [backdropColor, setBackdropColor] = useState("#000000");
  const [ayahAlign, setAyahAlign] = useState("text-center");
  const [image, setImage] = useState();
  const [isDownloading, setIsDownloading] = useState(false);
  const [textFont, setTextFont] = useState([25]);
  const [backdrop, setBackdrop] = useState([50]);
  const [transFont, setTransFont] = useState([16]);
  const [transWidth, setTransWidth] = useState([20]);
  const [ayahWidth, setAyahWidth] = useState([20]);
  const [transCheck, setTransCheck] = useState(true);
  const [transStyle, setTransStyle] = useState([]);
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
      // imageRef.current.src = imageUrl;
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

  const handleUrl = () => {
    if (url === "") {
      toast({
        variant: "destructive",
        title: `Something is wrong with the URL!`,
      });
    } else {
      // Create a new image object
      const img = new Image();
      // Set the URL to the image object
      img.src = url;

      // Add an event listener to check if the URL is valid and if it loads an image
      img.onload = function () {
        // If the image loads successfully, set the image URL and clear the input URL
        setImage(url);
        setUrl("");
      };

      // Add an event listener to handle errors if the image fails to load
      img.onerror = function () {
        // If the image fails to load, show an error message
        toast({
          variant: "destructive",
          title: `Something is wrong with the URL! It may not be a valid image.`,
        });
      };
    }
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
        setImage(dataURL);
        // imageRef.current.src = dataURL;
      };
      reader.readAsDataURL(file);
    }
  };



  return (
    <div className="">
      <div id="image-container" className="w-full h-fit " ref={constraintsRef}>
        <div
          style={{
            backgroundImage: `url(${image})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: `center center `,
          }}
          className="rounded-xl overflow-hidden relative  w-full h-[250px]"
        >
          <div
            className={`absolute top-0 left-0 w-full h-full`}
            style={{
              opacity: `${backdrop}%`,
              backgroundColor: `${backdropColor}`,
            }}
          ></div>
          <div className="flex flex-row item-center justify-center w-full h-full p-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <motion.p
              drag
              dragMomentum={false}
              initial={{ y: 20 }}
              dragConstraints={constraintsRef}
              whileDrag={{ scale: 1.03 }}
              style={{
                fontSize: `${textFont}px`,
                width: `0px ${ayahWidth}px`,
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
                initial={{ y: 60 }}
                className={`fixed text-white w-fit ${transTextAlign} ${transStyle.join(
                  " "
                )}`}
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
        <Tabs defaultValue="ayah" className="w-full">
          <TabsList className="w-full items-stretch my-1">
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

            <TabsTrigger className="w-full" value="background">
              Background
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ayah">
            {/* Ayat walay option ider */}

            <div className="flex flex-row gap-3 items-center justify-center">
              <p className="text-nowrap w-fit">Font Size:</p>
              <Slider
                onValueChange={(e) => setTextFont(e)}
                defaultValue={[textFont]}
                min={10}
                max={40}
                step={1}
              />
              <p>{`${textFont}px`}</p>
            </div>

            <div className="flex flex-row gap-3 items-center justify-center">
              <p className="text-nowrap w-fit">Line Width:</p>
              <Slider
                onValueChange={(e) => setAyahWidth(e)}
                defaultValue={[ayahWidth]}
                min={0}
                max={100}
                step={1}
              />
              <p>{`${ayahWidth}px`}</p>
            </div>
            <div className="flex flex-row gap-3 items-center justify-between">
              <div className="flex flex-row gap-3 items-center justify-start">
                <p className="text-nowrap w-fit">Alignment:</p>
                <ToggleGroup
                  defaultValue="text-center"
                  onValueChange={(e) => {
                    setAyahAlign(e);
                  }}
                  className="my-2 "
                  type="single"
                  variant="outline"
                  size="sm"
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
              </div>
            </div>
          </TabsContent>
          <TabsContent value="translation">
            {/* translation walay ider */}

            <>
              <div className="flex flex-row gap-3 items-center justify-center">
                <p className="text-nowrap w-fit">Font Size:</p>
                <Slider
                  onValueChange={(e) => setTransFont(e)}
                  defaultValue={[transFont]}
                  min={10}
                  max={40}
                  step={1}
                />
                <p>{`${transFont}px`}</p>
              </div>
              <div className="flex flex-row gap-3 items-center justify-center">
                <p className="text-nowrap w-fit">Line Width:</p>
                <Slider
                  onValueChange={(e) => setTransWidth(e)}
                  defaultValue={[transWidth]}
                  min={0}
                  max={100}
                  step={1}
                />
                <p>{`${transWidth}px`}</p>
              </div>
              <div className="flex flex-row gap-3 items-center justify-between">
                <div className="flex flex-row gap-3 items-center justify-center">
                  <p className="text-nowrap w-fit">Alignment:</p>
                  <ToggleGroup
                    size="sm"
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
                </div>
                <div className="">
                  <ToggleGroup
                    onValueChange={(e) => {
                      setTransStyle(e);
                    }}
                    className="my-3 "
                    type="multiple"
                    variant="outline"
                    size="sm"
                  >
                    <ToggleGroupItem value="font-semibold">
                      <Bold size={15} />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="italic">
                      <Italic size={15} />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="underline">
                      <UnderlineIcon size={15} />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </>
          </TabsContent>
          <TabsContent value="reference">
            {/* ref walay ider */}

            <div className="flex flex-row gap-3 items-center justify-center">
              <p className="text-nowrap w-fit">Font Size:</p>
              <Slider
                onValueChange={(e) => setRefFont(e)}
                defaultValue={[refFont]}
                min={10}
                max={40}
                step={1}
              />
              <p>{`${refFont}px`}</p>
            </div>

            <div className="flex flex-row gap-2 items-center mt-2">
              <p className="text-nowrap w-fit">Format:</p>
              <div className="">
                <Select
                  onValueChange={(e) => setFormatt(e)}
                  defaultValue={formatt}
                >
                  <SelectTrigger className="w-[230px]">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value={`Quran (${props.surah} : ${props.ayahNumber})`}
                    >{`Quran (${props.surah} : ${props.ayahNumber})`}</SelectItem>
                    <SelectItem
                      value={`[${props.surahName} : ${props.ayahNumber}]`}
                    >{`[${props.surahName} : ${props.ayahNumber}]`}</SelectItem>
                    <SelectItem
                      value={`${props.surahName} (${props.surah} : ${props.ayahNumber})`}
                    >{`${props.surahName} (${props.surah} : ${props.ayahNumber})`}</SelectItem>
                    <SelectItem
                      value={`Surah ${props.surahName} | Ayah ${props.ayahNumber}`}
                    >{`Surah ${props.surahName} | Ayah ${props.ayahNumber}`}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="background">
            <div className="justify-between items-center flex-row flex gap-2">
              <p className="text-nowrap w-fit">Opacity:</p>

              <Slider
                onValueChange={(e) => setBackdrop(e)}
                defaultValue={[backdrop]}
                min={0}
                max={100}
                step={1}
              />
              <p>{`${backdrop}%`}</p>
            </div>
            <div className="justify-between items-center flex-row flex gap-2 mt-2">
              <div className="justify-between items-center flex-row flex gap-2">
                <p className="text-nowrap w-fit">Color:</p>
                <Input
                  type="color"
                  className="w-[70px]"
                  value={backdropColor}
                  onChange={(e) => setBackdropColor(e.target.value)}
                />
              </div>
              <input
                type="file"
                accept="image/png, image/jpeg"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileInputChange}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <ImageUp size={18} className="mr-2" />
                    Change Image
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[300px]">
                  {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator /> */}

                  <div className="mb-2 p-2 flex flex-row gap-2">
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      type="url"
                      placeholder="Paste the image url here..."
                    />
                    <Button
                      onClick={() => handleUrl()}
                      className="w-[45px]"
                      size="smIcon"
                    >
                      <Check size={15} />
                    </Button>
                  </div>

                  <DropdownMenuItem
                    onClick={() => handleButtonClick()}
                    className="p-2"
                  >
                    <Upload size={15} className="mr-2" />
                    Upload Image
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="mt-2 flex flex-row items-center justify-center">
        <div className="flex flex-row gap-4 items-center justify-between">
          <div className="flex flex-row gap-3 items-center justify-between">
            <Select>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Content" />
              </SelectTrigger>
              <SelectContent>
                <div className="">
                  <div className="rounded hover:bg-muted p-2 flex flex-row gap-2 items-center justify-start">
                    <Checkbox
                      checked={refCheck}
                      onCheckedChange={(e) => setRefCheck(!refCheck)}
                      id="ref"
                    />
                    <label className="text-sm" htmlFor="item1">
                      Reference
                    </label>
                  </div>

                  <div className="rounded hover:bg-muted p-2 flex flex-row gap-2 items-center justify-start">
                    <Checkbox
                      checked={transCheck}
                      onCheckedChange={(e) => setTransCheck(!transCheck)}
                      id="trans"
                    />
                    <label className="text-sm" htmlFor="item2">
                      Translation
                    </label>
                  </div>
                </div>
              </SelectContent>
            </Select>
          </div>
          <div className="">
            <Button
              variant={isDownloading ? "ghost" : "outline"}
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download size={15} className="mr-2" />
              Download
            </Button>
          </div>
          <div className="">
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
    </div>
  );
};

export default ImageGenerator;
