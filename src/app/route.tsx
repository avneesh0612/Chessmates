import { HOST } from "@/consts";
import { frameMiddleWares } from "@/middleware/frameMiddlewares";
import { Button, createFrames } from "frames.js/next";

const frames = createFrames({
  middleware: frameMiddleWares,
});

const handleRequest = frames(async () => {
  return {
    image: `${HOST}/chessmates.png`,
    buttons: [
      <Button action="post" target="/play" key="play">
        Play
      </Button>,
      <Button action="post" target="/info" key="info">
        Information
      </Button>,
      <Button action="post" target="/leaderboard" key="leaderboard">
        Leaderboard
      </Button>,
      <Button action="post" target="/profile" key="profile">
        Profile
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
