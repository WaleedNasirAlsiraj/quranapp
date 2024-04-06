"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { BookOpen, PersonStandingIcon, User, Settings, NotebookPen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SearchDialog = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [data, setData] = useState([]);
  const [ayahData, setAyahData] = useState([])

  const router = useRouter();

  useEffect(() => {
    fetchSurahByName();

    const down = (e) => {
      if (e.keyCode == 32 && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      } else if (e.key == "s" && e.altKey) {
        e.preventDefault();
        router.push("/setting");
      } else if (e.key == "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/surah");
      } else if (e.key == "d" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/");
      }
    };

    const touch = (e) => {
      if (e.touches.length >= 2) {
        e.preventDefault(); // Prevent default behavior
        setOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    document.addEventListener("touchstart", touch); // Use touchstart instead of touchmove
    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("touchstart", touch);
    };
  }, []);

  async function fetchSurahByName() {
    try {
      let dataFetching = await fetch(`https://quran-endpoint.vercel.app/quran`);
      let dataJson = await dataFetching.json();

      


      setData(dataJson.data);
    } catch (error) {
      console.error("Error fetching surahs:", error);
    }
  }

  const fetchAyah = async (e) =>{
    try{
      let userInput = e.replace("-","/")
      let dataFetching = await fetch(
        `https://quran-endpoint.vercel.app/quran/${userInput.slice(1)}`
      );
      let dataJson = await dataFetching.json();


      setAyahData([e , dataJson.data])

      linkRef.current?.focus();


    }catch(err){
      console.log(err)
    }
  }

  const handleChange = async (e) => {
    setInput(e);
    if (e.startsWith("#") && e.includes('-') && !e.endsWith('-')) {
      fetchAyah(e)
    }
    
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          value={input}
          onValueChange={(e) => {
            handleChange(e);
          }}
          placeholder="Enter the surah name..."
        />
        <CommandList>
          <CommandEmpty className="p-2">
            {ayahData.length > 0 && (
              <>
                <Link
                  className=" rounded-sm w-full flex flex-row hover:bg-muted/40"
                  href={`/share/${ayahData[0]?.slice(1)}`}
                  onClick={()=>{
                    // router.push(`/share/${ayahData[0].slice(1)}`);
                    setOpen(!open)}}
                >
                  <div
                    className="relative flex cursor-pointer select-none items-center
                    rounded-sm px-4 py-3 text-sm outline-none
                    aria-selected:bg-accent aria-selected:text-accent-foreground
                    opacity-50  w-full  flex-row justify-start"
                  >
                    <NotebookPen className="mr-2 h-4 w-4" />
                    <div className="w-full flex flex-row justify-between items-center">
                      <span>
                        {ayahData[1]?.surah.en.short} | Verse{" "}
                        {ayahData[1]?.ayah.number.insurah}
                      </span>
                      <span className="arabic">
                        {ayahData[1]?.surah.ar.short}
                      </span>
                    </div>
                  </div>
                </Link>
              </>
            )}
          </CommandEmpty>

          <CommandGroup heading={data.length >= 1 ? "Surahs" : ""}>
            {data &&
              data.map((surah, index) => {
                return (
                  <Link
                    className=" w-full flex flex-row hover:bg-muted/40"
                    onClick={() => setOpen(!open)}
                    href={`/surah/${surah.number}`}
                    key={index}
                    prefetch={true}
                  >
                    <CommandItem
                      className=" w-full flex flex-row items-center justify-start"
                      key={index}
                      onSelect={() => {
                        router.push(`/surah/${surah.number}`);
                        setOpen(!open);
                      }}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>{surah.asma.en.short}</span>
                    </CommandItem>
                  </Link>
                );
              })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <Link
              className=" w-full flex flex-row hover:bg-muted/40"
              href={`/setting/profile`}
            >
              <CommandItem className=" w-full flex flex-row items-center justify-start">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <CommandShortcut>Ctrl+P</CommandShortcut>
              </CommandItem>
            </Link>
            <Link
              className=" w-full flex flex-row hover:bg-muted/40"
              href={`/setting`}
            >
              <CommandItem className=" w-full flex flex-row items-center justify-start">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <CommandShortcut>Ctrl+S</CommandShortcut>
              </CommandItem>
            </Link>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchDialog;
