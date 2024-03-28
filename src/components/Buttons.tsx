import { HOST } from "@/consts";
import { Button } from "frames.js/next";

export const PlayButton = (
  <Button action="post" target={`${HOST}/play`} key="play">
    Play
  </Button>
);

export const InfoButton = (
  <Button action="post" target={`${HOST}/info`} key="info">
    Info
  </Button>
);

export const LeaderboardButton = (
  <Button action="post" target={`${HOST}/leaderboard`} key="leaderboard">
    Leaderboard
  </Button>
);

export const ProfileButton = (
  <Button action="post" target={`${HOST}/profile`} key="profile">
    Profile
  </Button>
);

export const HomeButton = (
  <Button action="post" target={`${HOST}/`} key="home">
    Home
  </Button>
);
