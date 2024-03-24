import prisma from "@/lib/prisma";
import { Chess } from "chess.js";

const main = async () => {
  try {
    const game = await prisma.game.findFirst({
      where: {
        completed: false,
      },
    });

    if (!game) {
      return new Response("No game found", { status: 404 });
    }

    const votes = await prisma.vote.findMany({
      where: {
        valid: true,
        success: false,
        gameId: game.id,
      },
    });

    if (votes.length === 0) {
      return new Response("No votes found", { status: 404 });
    }

    const topVotes = votes.reduce((acc, vote) => {
      if (!acc[vote.vote]) {
        acc[vote.vote] = 0;
      }

      acc[vote.vote] += 1;

      return acc;
    }, {} as Record<string, number>);
    const chess = new Chess(game.fen || undefined);

    const topVote = Object.keys(topVotes).reduce((a, b) =>
      // @ts-ignore
      topVotes[a] > topVotes[b] ? a : b
    );

    chess.move(topVote);

    await prisma.game.update({
      where: {
        id: game.id,
      },
      data: {
        fen: chess.fen(),
        winner: "",
      },
    });

    await prisma.vote.updateMany({
      where: {
        gameId: game.id,
        valid: true,
        success: false,
        vote: topVote,
      },
      data: {
        valid: false,
        success: true,
      },
    });

    await prisma.vote.updateMany({
      where: {
        gameId: game.id,
        valid: true,
        success: false,
      },
      data: {
        valid: false,
      },
    });

    if (chess.isDraw() || chess.isStalemate()) {
      await prisma.game.update({
        where: {
          id: game.id,
        },
        data: {
          completed: true,
          winner: "draw",
        },
      });

      const Uvotes = await prisma.vote.findMany({
        where: {
          gameId: game.id,
          valid: false,
          success: true,
        },
      });

      Uvotes.map(async (vote) => {
        await prisma.user.update({
          where: {
            fid: vote.userId,
          },
          data: {
            points: {
              increment: 1,
            },
          },
        });
      });

      return new Response("Success", { status: 200 });
    }

    let winner = "";

    if (chess.turn() === "w" && chess.isCheckmate()) {
      winner = "black";
    }

    if (chess.turn() === "b" && chess.isCheckmate()) {
      winner = "white";
    }

    if (winner) {
      await prisma.game.update({
        where: {
          id: game.id,
        },
        data: {
          completed: true,
          winner,
        },
      });

      await prisma.game.create({
        data: {
          completed: false,
          fen: "",
        },
      });

      const Uvotes = await prisma.vote.findMany({
        where: {
          gameId: game.id,
          valid: false,
          success: true,
        },
      });

      Uvotes.map(async (vote) => {
        await prisma.user.update({
          where: {
            fid: vote.userId,
            team: winner,
          },
          data: {
            points: {
              increment: 1,
            },
          },
        });
      });
    }

    return new Response("Success", { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response("Internal err", { status: 500 });
  }
};

export async function GET(request: Request) {
  return main();
}

export async function POST(request: Request) {
  return main();
}
