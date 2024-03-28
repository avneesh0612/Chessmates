import { HomeButton, PlayButton } from "@/components/Buttons";
import { HOST } from "@/consts";
import { createFrames } from "frames.js/next";

const frames = createFrames();
const handleRequest = frames(async () => {
  return {
    image: `${HOST}/info.png`,
    buttons: [HomeButton, PlayButton],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
