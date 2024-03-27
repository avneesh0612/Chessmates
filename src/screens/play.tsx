import prisma from "@/lib/prisma";
import { Chess } from "chess.js";
import { FrameButton, FrameInput } from "frames.js/next/server";
import { FrameActionDataParsedAndHubContext } from "node_modules/frames.js/dist/types";
import { votesScreen } from "./votes";
import { Game, User } from "@prisma/client";
import { FenImgGenerator } from "@/lib/fen-image-generator";

export const play = async (
  frameMessage: FrameActionDataParsedAndHubContext | null,
  user: User | null,
  gameP?: Game
) => {
  let valid = false;
  const move = frameMessage?.inputText;
  let game = gameP;

  console.log("finding game");

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

  console.log("generating image");

  const svg = new FenImgGenerator().generate(chess.fen());
  console.log("image generated");

  if (!move) {
    const info = {
      image: (
        <div
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_HOST}/bg.jpg)`,
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
                {/* <div tw="flex -my-[2rem]">
                  {chess
                    .moves()
                    .slice(5, 10)
                    .map((move) => (
                      <p key={move}>{move},</p>
                    ))}
                </div>{" "} */}
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

              {/* the chance changes at every 10 mins GMT time so calculate according to that */}
              <p tw="px-20 text-center text-gray-200 text-[2rem]">
                Come back in {10 - (new Date().getMinutes() % 10)} minutes to
                play your turn
              </p>
            </div>
          )}
        </div>
      ),
      input: turn ? <FrameInput text="Move (eg-Ne7)" /> : null,
      button: turn ? (
        <FrameButton action="post" target="/frames?page=play" key="vote">
          Vote
        </FrameButton>
      ) : (
        <FrameButton action="post" target="/frames?" key="home">
          Home
        </FrameButton>
      ),
    };

    return info;
  }

  console.log("finding vote");
  const vote1 = await prisma.vote.findFirst({
    where: {
      userId: String(frameMessage?.requesterFid),
      gameId: game.id,
      valid: true,
      success: false,
    },
  });

  console.log("vote found");

  if (move) {
    try {
      chess.move(move);
      valid = true;
    } catch {
      valid = false;
    }
  }

  if (valid && !vote1) {
    const vote = await prisma.vote.create({
      data: {
        vote: move,
        gameId: game.id,
        userId: String(frameMessage?.requesterFid),
      },
    });

    const votes = await votesScreen(game, vote, chess);
    return {
      image: votes.image,
      input: votes.input,
      button: votes.button,
    };
  }

  return {
    image: (
      <div
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_HOST}/bg.jpg)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          color: "white",
        }}
        tw="w-full h-full justify-center items-center flex flex-col"
      >
        <div tw="flex flex-col items-center justify-center">
          <h2 tw="text-[5rem] font-bold text-center text-gray-200">
            chessmates Leaderboard
          </h2>
          <h4 tw="text-[3rem] font-bold text-center text-gray-200 px-20">
            Invalid move!
          </h4>

          <h2 tw="text-[3rem] font-bold text-center text-gray-200">
            Some Possible moves:
          </h2>
          <div tw="flex">
            {chess
              .moves()
              .slice(0, 10)
              .map((move) => (
                <p key={move}>{move},</p>
              ))}
          </div>
        </div>
      </div>
    ),
    input: <FrameInput text="Move (eg-Ne7)" />,
    button: (
      <FrameButton action="post" target="/frames?page=play" key="abc">
        Vote
      </FrameButton>
    ),
  };
};
