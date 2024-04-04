"use client";

import SurahItem from "@/components/SurahItem";
import React, { useEffect, useState } from "react";

const SurahComp =  () => {
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

  const addSurahCards =  () => {
    return data.map((surah) => {
      return <SurahItem key={surah.number} data={surah} />;
    });
  };

  return (
    <div className="flex flex-row gap-2 p-3 ">
      <div className="surahs flex flex-col gap-4 w-full">
        {addSurahCards()}
        </div>
    </div>
  );
};

export default SurahComp;
