"use client"

import React from 'react'
import { Toaster } from "@/components/ui/toaster"
import { usePlayerStore } from '@/store/playerStore'

const layout = ({children}) => {

  const {playing} = usePlayerStore((state)=>({playing:state.playing}))

  return (
    <div className={`transition-all duration-1000 ${playing ? "playing-height":"full-height" } `}>
    {children}
    <Toaster />
    </div>
  )
}

export default layout
