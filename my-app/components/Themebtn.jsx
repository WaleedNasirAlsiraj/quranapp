"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import { Moon, Sun } from "lucide-react";

const themebtn = () => {
  const { theme, setTheme } = useTheme();
  
  const [isChecked, setIsChecked] = useState();

  useEffect(() => {
    if (theme == "dark") {
      setIsChecked(true);
    } else if (theme == "light") {
      setIsChecked(false);
    }
  }, []);

  const toggleMode = (e) => {
    console.log(e);
    if (e) {
      setTheme("dark");
      setIsChecked(true);
    } else {
      setTheme("light");
      setIsChecked(false);
    }
  };

  return (
    <div>
          <Button
              onClick={(e) => toggleMode(!isChecked)}
              variant="outline"
              size="full"
            >
              {!isChecked && <Sun size={20} className="m-2" />}
              {isChecked && <Moon size={20} className="m-2" />}
            </Button>
    </div>
  );
};

export default themebtn;
