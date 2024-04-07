import React from "react";
import { Card } from "./ui/card";
import num from "@/public/assets/imgs/number.svg";
import Link from "next/link";
import { motion } from "framer-motion";

const surahItem = (props) => {
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
      <Card className="scale transition-all opacity-80 hover:opacity-100">
        <Link className="carditem" href={`/surah/${props.data.number}`}>
          <div className="bg-muted/40 carditem cursor-pointer content p-3 flex flex-row justify-between items-center ">
            <div className="  content-left flex flex-row gap-3 items-center ">
              <div className="  number relative w-fit items-center">
                {/* <img width={"40px"} src={num.src} alt="" /> */}
                <div className="numberholder bg-primary/50"></div>
                <p className="text-white text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  {props.data.number}
                </p>
              </div>
              <div className="detail flex justify-center items-start flex-col">
                <p className="text-base">{props.data.asma.en.short}</p>
                <p className="text-xs">
                  {props.data.type.en} : {props.data.ayahCount} Verses
                </p>
              </div>
            </div>
            <div className="content-right">
              <div className="detail flex justify-center items-end flex-col">
                <p className="text-lg">{props.data.asma.ar.short}</p>
                <p className="text-xs">{props.data.asma.translation.en}</p>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
};

export default surahItem;
