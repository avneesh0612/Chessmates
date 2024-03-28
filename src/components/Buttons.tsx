import { Button } from "frames.js/next";

export const PlayButton = () => {
  return (
    <Button action="post" target="/play" key="play">
      Play
    </Button>
  );
};

export const InfoButton = () => {
  return (
    <Button action="post" target="/info" key="info">
      Info
    </Button>
  );
};

export const LeaderboardButton = () => {
  return (
    <Button action="post" target="/leaderboard" key="leaderboard">
      Leaderboard
    </Button>
  );
};

export const ProfileButton = () => {
  return (
    <Button action="post" target="/profile" key="profile">
      Profile
    </Button>
  );
};

export const HomeButton = () => {
  return (
    <Button action="post" target="/" key="home">
      Home
    </Button>
  );
};
