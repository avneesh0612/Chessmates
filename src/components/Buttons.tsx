import { Button } from "frames.js/next";

export const PlayButton = (
  <Button action="post" target="/play" key="play">
    Play
  </Button>
);

export const InfoButton = (
  <Button action="post" target="/info" key="info">
    Info
  </Button>
);

export const LeaderboardButton = (
  <Button action="post" target="/leaderboard" key="leaderboard">
    Leaderboard
  </Button>
);

export const ProfileButton = (
  <Button action="post" target="/profile" key="profile">
    Profile
  </Button>
);

export const HomeButton = (
  <Button action="post" target="/" key="home">
    Home
  </Button>
);
