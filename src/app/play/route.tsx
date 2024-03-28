import { HomeButton, PlayButton } from "@/components/Buttons";
import { HOST } from "@/consts";
import { FenImgGenerator } from "@/lib/fen-image-generator";
import prisma from "@/lib/prisma";
import { play } from "@/screens/play";
import { createEmbeddedWallet } from "../../utils/createEmbeddedWallet";
import { mintNFT } from "@/utils/mintNFT";
import { ChainEnum } from "@dynamic-labs/sdk-api/models/ChainEnum";
import { Chess } from "chess.js";
import { getAddressForFid } from "frames.js";
import { Button, createFrames } from "frames.js/next";

const frames = createFrames();
const handleRequest = frames(async (payload) => {
  try {
    const { message, searchParams } = payload;
    const fid = message?.requesterFid;

    const user = await prisma.user.findFirst({
      where: {
        fid: String(fid),
      },
    });

    if (user) {
      const game = await prisma.game.findFirst({
        where: {
          completed: false,
        },
      });

      const vote = await prisma.vote.findFirst({
        where: {
          userId: String(fid),
          gameId: game?.id,
          valid: true,
          success: false,
        },
      });

      const chess = new Chess(game?.fen || undefined);

      if (vote) {
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
                </div>
              </div>
            </div>
          ),
          buttons: [HomeButton],
          textInput: undefined,
        };
      }

      const { image, textInput, button } = await play(user, game!);

      return {
        image,
        buttons: [button],
        textInput: textInput || undefined,
      };
    }

    let team = searchParams.team as string;

    if (!user && team) {
      const addressF = await getAddressForFid({
        fid: 1214,
        options: { fallbackToCustodyAddress: true },
      });

      const address = (addressF || searchParams?.address) as string;

      if (!address) {
        if (message?.inputText) {
          let newWallets = await createEmbeddedWallet(
            message?.inputText as string,
            fid!,
            [ChainEnum.Evm]
          );

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
                <div tw="flex flex-row">Your wallet has been created!</div>
              </div>
            ),
            buttons: [
              <Button
                action="post"
                target={`/play?team=${team}&address=${newWallets![0]}`}
                key="confirm"
              >
                Continue
              </Button>,
              <Button
                action="link"
                target="https://demo.dynamic.xyz/?use-environment=Farcaster"
                key="login"
              >
                Log in to dynamic to access your wallets
              </Button>,
            ],
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
              tw="w-full h-full text-white justify-center items-center flex flex-col"
            >
              <div tw="flex flex-row max-w-[80%] text-center text-[2rem]">
                You need a wallet address to join the {team} team. Don&apos;t
                have one? Create one using your email
              </div>
            </div>
          ),
          textInput: "Enter your email",
          buttons: [
            <Button action="post" target={`/play?&team=${team}`} key="create">
              Create wallet
            </Button>,
          ],
        };
      }

      if (address) {
        await prisma.user.create({
          data: {
            points: 0,
            fid: String(fid),
            team: team,
            address,
          },
        });

        await mintNFT(fid!, address);

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
              <div tw="flex flex-row">
                You have joined the {team} team! Welcome to comm chess!
              </div>
            </div>
          ),
          buttons: [PlayButton],
        };
      }
    }

    const blackTeam = await prisma.user.count({
      where: {
        team: "black",
      },
    });

    const whiteTeam = await prisma.user.count({
      where: {
        team: "white",
      },
    });

    return {
      image: team ? (
        <div
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_HOST}/bg.jpg)`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            color: "white",
          }}
          tw="w-full h-full text-white justify-center items-center flex flex-col"
        >
          <div tw="flex flex-row">
            Are you sure you want to join the {team} team?
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_HOST}/bg.jpg)`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
          tw="w-full h-full text-white justify-center items-center flex flex-col"
        >
          <h1 tw="flex flex-row text-[4rem]">Choose your team!</h1>

          <div tw="flex flex-row w-[100%]">
            <div tw="flex flex-col w-[50%] justify-center items-center">
              <p>White team</p>
              <p>{whiteTeam} members</p>
            </div>
            <div tw="flex flex-col w-[50%] justify-center items-center">
              <p>Black team</p>
              <p>{blackTeam} members</p>
            </div>
          </div>
        </div>
      ),

      buttons: [
        <Button action="post" target="/play?team=white" key="white">
          White
        </Button>,
        <Button action="post" target="/play?team=black" key="black">
          Black
        </Button>,
      ],
    };
  } catch (e) {
    console.error(e);
    return {
      image: `${HOST}/bg.jpg`,
      buttons: [HomeButton],
    };
  }
});

export const GET = handleRequest;
export const POST = handleRequest;
