"use client";

import React, { useState, useEffect } from "react";
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
import { BookOpen, PersonStandingIcon } from "lucide-react";
import Link from "next/link";

const SearchDialog = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchSurahByName();

    const down = (e) => {
      if (e.keyCode == 32 && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
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

      let surahs = dataJson.data;

      const lowercaseInput = input.toLowerCase();

      let matchingSurahs = [];

      for (let surah of surahs) {
        const lowercaseSurahName = surah.asma.en.short.toLowerCase();

        if (lowercaseSurahName.includes(lowercaseInput)) {
          matchingSurahs.push(surah);
        }
      }
      setData(matchingSurahs);
    } catch (error) {
      console.error("Error fetching surahs:", error);
    }
  }

  const handleChange = async (e) => {
    console.log(e);
    setInput(e);
    fetchSurahByName();
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
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading={data.length >= 1 ? "Surahs" : ""}>
            {data &&
              data.map((surah, index) => (
                <Link
                  className=" w-full flex flex-row hover:bg-muted/40"
                  href={`/surah/${surah.number}`}
                >
                  <CommandItem
                    className=" w-full flex flex-row items-center justify-start"
                    key={index}
                  >
                    <BookOpen className="text-primary mr-2 h-4 w-4" />
                    <span>{surah.asma.en.short}</span>
                  </CommandItem>
                </Link>
              ))}
          </CommandGroup>
          {/* <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <PersonStandingIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <PersonStandingIcon className="mr-2 h-4 w-4" />
              <span>Mail</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <PersonStandingIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup> */}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchDialog;
