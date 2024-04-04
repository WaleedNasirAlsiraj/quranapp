import { produce } from "immer";
import { create } from "zustand";

const initialState = {
  playing: false,
  repeat: false,
  audioSrc: "waleed",
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
}));
