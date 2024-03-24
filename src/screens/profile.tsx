import { fdk } from "@/lib/fdk";
import prisma from "@/lib/prisma";
import { FrameButton } from "frames.js/next/server";

export const profile = async (fid: number) => {
  const user = await fdk.getUserByFid(fid);

  const userData = await prisma.user.findUnique({
    where: {
      fid: String(fid),
    },
  });

  return {
    image: (
      <div
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_HOST}/bg.jpg)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          color: "white",
        }}
        tw="w-full h-full text-white justify-center items-center flex flex-col"
      >
        <div tw="flex flex-col items-center justify-center">
          <h2 tw="text-[4rem] font-bold text-center text-gray-200">
            chessmates
          </h2>
          {userData ? (
            <div tw="flex w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.pfp}
                tw="w-[150px] h-[150px] rounded-full"
                alt=""
              />
              <div tw="flex flex-col justify-center ml-[80px]">
                <h1 tw="text-[3rem] font-bold text-gray-200 -my-[0.25rem] items-start justify-start">
                  {user.username}
                </h1>
                <p tw="text-[2rem] text-gray-400 max-w-[70%] -my-[0.25rem]">
                  {user.bio}
                </p>

                <p>{userData?.points} Points</p>
              </div>
            </div>
          ) : (
            <div tw="flex w-full">
              <h1 tw="text-[3rem] font-bold text-gray-200 -my-[0.25rem] items-start justify-start max-w-[90%]">
                Please create your account first by clicking on Play!
              </h1>
            </div>
          )}
        </div>
      </div>
    ),
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
