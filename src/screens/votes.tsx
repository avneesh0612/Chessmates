import { FenImgGenerator } from "@/lib/fen-image-generator";
import { Chess } from "chess.js";
import { Button } from "frames.js/next";

export const votesScreen = async (
  game: { id: string },
  vote: {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    userId?: string;
    gameId?: string;
    vote: any;
    valid?: boolean;
    success?: boolean;
  },
  chess: Chess
) => {
  // const votes = await prisma.vote.findMany({
  //   where: {
  //     gameId: game.id,
  //     valid: true,
  //     success: false,
  //   },
  // });

  // const topVotes = votes.reduce((acc, vote) => {
  //   if (!acc[vote.vote]) {
  //     acc[vote.vote] = 0;
  //   }

  //   acc[vote.vote] += 1;

  //   return acc;
  // }, {} as Record<string, number>);

  const svg = new FenImgGenerator().generate(chess.fen());

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
        <div tw="w-full h-full text-white items-center flex">
          <div tw="w-[50%] h-[95%] flex items-center justify-center px-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={svg} alt="chess board" />
          </div>

          <div tw="flex flex-col items-center justify-center max-w-[50%]">
            <h4 tw="text-[3rem] font-bold text-center text-gray-200 px-20">
              You&apos;ve voted for {vote.vote}!
            </h4>
            {/* <h1>Top votes:</h1>
            <ul tw="flex flex-col">
              {Object.entries(topVotes).map(([move, votes]) => (
                <li key={move}>
                  {move}: {votes}
                </li>
              ))}
            </ul> */}
          </div>
        </div>
      </div>
    ),
    input: null,
    button: (
      <Button action="post" target="/" key="home">
        Home
      </Button>
    ),
  };
};
