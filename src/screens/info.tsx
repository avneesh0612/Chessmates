import { FrameButton } from "frames.js/next/server";

export const info = () => {
  return {
    input: null,
    button1: (
      <FrameButton action="post" target="/frames">
        Home
      </FrameButton>
    ),
    button2: (
      <FrameButton action="post" target="/frames?page=start">
        Play
      </FrameButton>
    ),
  };
};
