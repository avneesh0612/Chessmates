import { HomeButton } from "@/components/Buttons";
import { HOST } from "@/consts";
import { FenImgGenerator } from "@/lib/fen-image-generator";
import prisma from "@/lib/prisma";
import { Game, User } from "@prisma/client";
import { Chess } from "chess.js";
import { Button } from "frames.js/next";

export const play = async (user: User | null, gameP?: Game) => {
  let game = gameP;

  if (!game) {
    // @ts-ignore
    game = await prisma.game.findFirst({
      where: {
        completed: false,
      },
    });
  }

  if (!game) {
    throw new Error("No game found");
  }

  const chess = new Chess(game.fen || undefined);

  const turn =
    (chess.turn() === "w" && user?.team === "white") ||
    (chess.turn() === "b" && user?.team === "black");

  const svg = new FenImgGenerator().generate(chess.fen());

  const info = {
    image: (
      <div
        style={{
          backgroundImage: `url(${HOST}/bg.jpg)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          color: "white",
        }}
        tw="w-full h-full text-white items-center flex p-0 m-0"
      >
        <div tw="w-[50%] h-[95%] flex items-center justify-center px-6 text-gray-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={svg} alt="chess board" />
        </div>

        {turn ? (
          <div tw="flex flex-col items-center w-[50%]">
            <h4 tw="text-[3rem] font-bold text-center text-white px-20">
              It&apos;s your turn!
            </h4>
            <h2 tw="text-[3rem] font-bold text-center text-gray-100">
              Some Possible moves:
            </h2>
            <div tw="flex flex-col justify-start items-start p-0">
              <div tw="flex -my-[2rem]">
                {chess
                  .moves()
                  .slice(0, 5)
                  .map((move) => (
                    <p key={move}>{move},</p>
                  ))}
              </div>
              <div tw="flex -my-[2rem]">
                {chess
                  .moves()
                  .slice(5, 10)
                  .map((move) => (
                    <p key={move}>{move},</p>
                  ))}
              </div>{" "}
              <div tw="flex -my-[2rem]">
                {chess
                  .moves()
                  .slice(10, 15)
                  .map((move) => (
                    <p key={move}>{move},</p>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div tw="flex flex-col items-center justify-center max-w-[50%]">
            <h4 tw="text-[3rem] font-bold text-center text-gray-100 px-20">
              It&apos;s not your turn!
            </h4>

            <p tw="px-20 text-center text-gray-200 text-[2rem]">
              Come back in {10 - (new Date().getMinutes() % 10)} minutes to play
              your turn
            </p>
          </div>
        )}
      </div>
    ),
    textInput: turn && "Move (eg-Ne7)",
    button: turn ? (
      <Button action="post" target={`${HOST}/vote`} key="vote">
        Vote
      </Button>
    ) : (
      HomeButton
    ),
  };

  return info;
};
