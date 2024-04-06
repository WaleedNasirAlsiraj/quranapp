import { produce } from "immer";
import { create } from "zustand";

const initialState = {
  playing: false,
  repeat: false,
  audioSrc: "",
  surahNumber: 0,
};

export const usePlayerStore = create((set) => ({
  ...initialState,
  setPlaying: (value) =>
    set(
      produce((state) => {
        state.playing = value;
      })
    ),
  setRepeat: (value) =>
    set(
      produce((state) => {
        state.repeat = value;
      })
    ),
  setAudioSrc: (value) =>
    set(
      produce((state) => {
        state.audioSrc = value;
      })
    ),
  setSurahNumber: (value) =>
    set(
      produce((state) => {
        state.surahNumber = value;
      })
    ),
}));
