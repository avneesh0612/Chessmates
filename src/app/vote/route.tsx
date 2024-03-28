import prisma from "@/lib/prisma";
import { votesScreen } from "@/screens/votes";
import { Chess } from "chess.js";
import { createFrames } from "frames.js/next";

const frames = createFrames();
const handleRequest = frames(async (payload) => {
  const game = await prisma.game.findFirst({
    where: {
      completed: false,
    },
  });

  const chess = new Chess(game?.fen || undefined);

  const vote = await prisma.vote.findFirst({
    where: {
      userId: String(payload.message?.requesterFid),
      gameId: game?.id,
      valid: true,
      success: false,
    },
  });

  const votes = await votesScreen(game!, vote!, chess);

  return {
    image: votes.image,
    input: votes.input,
    buttons: [votes.button],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
