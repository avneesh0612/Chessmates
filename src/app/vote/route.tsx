import { HOST } from "@/consts";
import { FenImgGenerator } from "@/lib/fen-image-generator";
import prisma from "@/lib/prisma";
import { votesScreen } from "@/screens/votes";
import { Chess } from "chess.js";
import { Button, createFrames } from "frames.js/next";

const frames = createFrames();
// @ts-ignore
const handleRequest = frames(async (payload) => {
  const game = await prisma.game.findFirst({
    where: {
      completed: false,
    },
  });

  const chess = new Chess(game?.fen || undefined);
  let valid;
  const fid = payload.message?.requesterFid;
  const move = payload.message?.inputText;

  const vote1 = await prisma.vote.findFirst({
    where: {
      userId: String(fid),
      gameId: game?.id!,
      valid: true,
      success: false,
    },
  });

  if (move && game) {
    try {
      chess.move(move);
      valid = true;
    } catch {
      valid = false;
    }

    if (valid && !vote1) {
      const vote = await prisma.vote.create({
        data: {
          vote: move,
          gameId: game?.id,
          userId: String(fid),
        },
      });

      const votes = await votesScreen(game, vote, chess);
      return {
        image: votes.image,
        textInput: votes.textInput || undefined,
        buttons: votes.buttons,
      };
    }

    const svg = new FenImgGenerator().generate(chess.fen());

    return {
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

          <div tw="flex flex-col items-center w-[50%]">
            <h4 tw="text-[3rem] font-bold text-center text-gray-200 px-20">
              Invalid move!
            </h4>
            <h2 tw="text-[3rem] font-bold text-center text-gray-200">
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
        </div>
      ),
      textInput: "Move (eg-Ne7)",
      buttons: [
        <Button action="post" target={`${HOST}/vote`} key="vote">
          Vote
        </Button>,
      ],
    };
  }

  const votes = await votesScreen(game!, vote1!, chess);

  return {
    image: votes.image,
    textInput: votes.textInput || undefined,
    buttons: votes.buttons,
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
