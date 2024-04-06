"use client";

import AyahItemShare from "@/components/AyahItemShare";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const page = ({ params }) => {
  const [data, setData] = useState();

  // const [transData, setTransData] = useState([]);
  // const [arabicData, setArabicData] = useState([]);
  const id = params.id;
  useEffect(() => {
    

    const fetchSurahData = async () => {
      try {
        const data = await fetch(
          `https://quran-endpoint.vercel.app/quran/${id.replace("-","/")}`
        );
        const dataJson = await data.json();
        // console.log("data :", dataJson.data)
        setData(dataJson.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchSurahData();
  }, []);

  return (
    <div className="p-4 flex flex-col justify-center h-full">
      <div className=""></div>
      <div className="">
        {data && <AyahItemShare
          data={data}
          surah={id.split("-")[0]}
        />}
      </div>
      <div className="text-center mt-5">
        <Link href={"/"}>
          <Button
            className="flex flex-row text-center justify-center items-center gap-2"
            variant="outline"
          >
            <Home size={15} />
            Go To Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
