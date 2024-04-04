"use client";

import AyahItemShare from "@/components/AyahItemShare";
import { handleBookmarks } from "@/utils/handleBookmarks";
import React, { useEffect, useState } from "react";

const page = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarksData, setBookmarksData] = useState([]);

  

  useEffect(() => {
    let localBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarks(localBookmarks);

    const fetchData = async () => {
      try {
        const bookmarkData = await Promise.all(
          localBookmarks.map(async (bookmark) => {
            const response = await fetch(
              `https://quran-endpoint.vercel.app/quran/${bookmark.surah}/${bookmark.ayah}`
            );
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            const jsonData = await response.json();
            return {
              surah: bookmark.surah,
              ayah: bookmark.ayah,
              data: jsonData,
            };
          })
        );
        setBookmarksData(bookmarkData);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchData();
  },[]);

  return (
    <div className="p-4 mb-4 flex flex-col gap-3">
      {bookmarksData &&
        bookmarksData.map((bookmark, index) => {
          return (
            <AyahItemShare
              key={index}
              data={bookmark.data.data}
              surah={bookmark.surah}
            />
          );
        })}
    </div>
  );
};

export default page;
