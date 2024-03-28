import { HOST } from "@/consts";
import { createFrames, Button } from "frames.js/next";

const frames = createFrames();
const handleRequest = frames(async () => {
  return {
    image: `${HOST}/info.png`,
    buttons: [
      <Button action="post" target="/" key="home">
        Home
      </Button>,
      <Button action="post" target="/play" key="play">
        Play
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
