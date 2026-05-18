import { randomWords } from "./random-words";
import { reactWords } from "./react-words";
import { goWords } from "./go-words";
import { pythonWords } from "./python-words";
import { cssWords } from "./css-words";
import { linuxWords } from "./linux-words";
import { csWords } from "./cs-words";
import { tailwindWords } from "./tailwind-words";

import { Category } from "@/types";

export const wordMap: Record<Category, string[]> = {
  random: randomWords,
  react: reactWords,
  go: goWords,
  python: pythonWords,
  css: cssWords,
  linux: linuxWords,
  cs: csWords,
  tailwind: tailwindWords,
};