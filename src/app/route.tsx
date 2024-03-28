import {
  InfoButton,
  LeaderboardButton,
  PlayButton,
  ProfileButton,
} from "@/components/Buttons";
import { HOST } from "@/consts";
import { frameMiddleWares } from "@/middleware/frameMiddlewares";
import { createFrames } from "frames.js/next";

const frames = createFrames({
  middleware: frameMiddleWares,
});

const handleRequest = frames(async () => {
  return {
    image: `${HOST}/chessmates.png`,
    buttons: [
      <PlayButton key="play" />,
      <InfoButton key="info" />,
      <LeaderboardButton key="leaderboard" />,
      <ProfileButton key="profile" />,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
