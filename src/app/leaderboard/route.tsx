import { HOST } from "@/consts";
import { fdk } from "@/lib/fdk";
import prisma from "@/lib/prisma";
import { Button, createFrames } from "frames.js/next";

const users = await prisma.user.findMany({
  orderBy: {
    points: "desc",
  },
  take: 10,
});

const promises = users.map(async (user) => {
  const username = (await fdk.getUserByFid(Number(user?.fid))).username;
  return {
    ...user,
    username,
  };
});

const newList = await Promise.all(promises);
const frames = createFrames();

const handleRequest = frames(async () => {
  return {
    image: (
      <div
        style={{
          backgroundImage: `url(${HOST}/bg.jpg)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          color: "white",
        }}
        tw="w-full h-full text-white justify-center items-center flex flex-col"
      >
        <div tw="flex flex-col items-center justify-center">
          <h2
            style={{
              fontWeight: "bold",
              fontFamily: "Inter",
            }}
            tw="text-[3.5rem] font-bold text-center text-gray-200"
          >
            chessmates Leaderboard
          </h2>

          <div tw="flex flex-row w-full">
            <div tw="flex flex-col w-[50%]">
              {newList.slice(0, 5).map((user, index) => (
                <div key={user.fid} tw="flex flex-row justify-center">
                  <p tw="text-[1.5rem] font-bold text-gray-200 leading-8 -my-[0.06rem]">
                    {index + 1}. {user.username} - {user.points}
                  </p>
                </div>
              ))}
            </div>
            <div tw="flex flex-col w-[50%]">
              {newList.slice(5, 10).map((user, index) => (
                <div key={user.fid} tw="flex flex-row justify-center">
                  <p tw="text-[1.5rem] font-bold text-gray-200 leading-8 -my-[0.06rem]">
                    {index + 6}. {user.username} - {user.points}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
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
