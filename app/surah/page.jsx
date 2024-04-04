"use client";

import SurahItem from "@/components/SurahItem";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SearchDialog from "@/components/SearchDialog";

const Page = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://quran-endpoint.vercel.app/quran");
        const jsonData = await response.json();
        setData(jsonData.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const addSurahCards = () => {
    return data.map((surah) => {
      return <SurahItem key={surah.number} data={surah} />;
    });
  };

  return (
    <div className="flex flex-col gap-5 p-3 ">
      <div className="flex flex-row justify-between">
        <div className="relative flex-1 md:grow-0">
          <p>Press CTRL + SPACE to search</p>
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          />
        </div>
      </div>
      <div className="surahs flex flex-col gap-3 w-full">{addSurahCards()}</div>
    </div>
  );
};

export default Page;
