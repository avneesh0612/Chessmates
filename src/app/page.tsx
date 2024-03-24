import { fdk } from "@/lib/fdk";
import prisma from "@/lib/prisma";
import { info } from "@/screens/info";
import { leaderboard } from "@/screens/leaderboard";
import { play } from "@/screens/play";
import { profile } from "@/screens/profile";
import { votesScreen } from "@/screens/votes";
import { Chess } from "chess.js";
import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  FrameReducer,
  NextServerPageProps,
  getFrameMessage,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import { isXmtpFrameActionPayload } from "frames.js/xmtp";
import Link from "next/link";
import { ClientProtocolId } from "node_modules/frames.js/dist/types";
import { DEFAULT_DEBUGGER_HUB_URL, createDebugUrl } from "./debug";
import { currentURL } from "./utils";
import { createEmbeddedWallet } from "@/utils/createEmbeddedwallet";
import { ChainEnum } from "@dynamic-labs/sdk-api/models/ChainEnum";
import { mintNFT } from "@/utils/mintNFT";

type State = {
  active: string;
  total_button_presses: number;
};

const acceptedProtocols: ClientProtocolId[] = [
  {
    id: "xmtp",
    version: "vNext",
  },
  {
    id: "farcaster",
    version: "vNext",
  },
];

const initialState = { active: "1", total_button_presses: 0 };

const reducer: FrameReducer<State> = (state, action) => {
  return {
    total_button_presses: state.total_button_presses + 1,
    active: action.postBody?.untrustedData.buttonIndex
      ? String(action.postBody?.untrustedData.buttonIndex)
      : "1",
  };
};

export default async function Home({ searchParams }: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(searchParams);
  const [state, dispatch] = useFramesReducer<State>(
    reducer,
    initialState,
    previousFrame
  );

  if (
    previousFrame.postBody &&
    isXmtpFrameActionPayload(previousFrame.postBody)
  ) {
    <FrameContainer
      postUrl={`/frames`}
      pathname="/"
      state={state}
      previousFrame={previousFrame}
      accepts={acceptedProtocols}
    >
      <FrameImage
        src={`${process.env.NEXT_PUBLIC_HOST}/chessmates.png`}
        aspectRatio="1.91:1"
      />

      <FrameButton action="post" target="/frames?page=start">
        Play
      </FrameButton>

      <FrameButton action="post" target="/frames?page=info">
        Information
      </FrameButton>

      <FrameButton action="post" target="/frames?page=leaderboard">
        Leaderboard
      </FrameButton>
    </FrameContainer>;
  } else {
    try {
      const page = searchParams?.page || "home";
      const url = currentURL("/");
      const frame_id = "checkmates";

      const frameMessage = await getFrameMessage(previousFrame.postBody, {
        hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
      });

      if (frameMessage && !frameMessage?.isValid) {
        throw new Error("Invalid frame payload");
      }

      const fid = frameMessage?.requesterFid;

      const user = await prisma.user.findFirst({
        where: {
          fid: String(fid),
        },
      });

      if (page === "profile") {
        const { image, button1, button2 } = await profile(fid!);

        return (
          <FrameContainer
            postUrl="/frames"
            pathname="/"
            state={state}
            previousFrame={previousFrame}
            accepts={acceptedProtocols}
          >
            <FrameImage aspectRatio="1.91:1">{image}</FrameImage>

            {button1}
            {button2}
          </FrameContainer>
        );
      }

      if (page === "info") {
        const { button1, button2 } = info();

        return (
          <FrameContainer
            postUrl="/frames"
            pathname="/"
            state={state}
            previousFrame={previousFrame}
            accepts={acceptedProtocols}
          >
            <FrameImage
              aspectRatio="1.91:1"
              src={`${process.env.NEXT_PUBLIC_HOST}/info.png`}
            />

            {button1}
            {button2}
          </FrameContainer>
        );
      }

      if (page === "leaderboard") {
        const { image, button1, button2 } = await leaderboard();

        return (
          <FrameContainer
            postUrl="/frames"
            pathname="/"
            state={state}
            previousFrame={previousFrame}
            accepts={acceptedProtocols}
          >
            <FrameImage aspectRatio="1.91:1">{image}</FrameImage>

            {button1}
            {button2}
          </FrameContainer>
        );
      }

      if (page === "play") {
        const { image, input, button } = await play(frameMessage, user);

        return (
          <FrameContainer
            postUrl={`/frames`}
            pathname="/"
            state={state}
            previousFrame={previousFrame}
            accepts={acceptedProtocols}
          >
            <FrameImage aspectRatio="1.91:1">{image}</FrameImage>

            {input}
            {button}
          </FrameContainer>
        );
      }

      if (page === "start") {
        let team = searchParams?.team as string;

        if (user) {
          let game = await prisma.game.findFirst({
            where: {
              completed: false,
            },
          });

          if (!game) {
            game = await prisma.game.create({
              data: {
                completed: false,
                fen: "",
              },
            });
          }

          const vote = await prisma.vote.findFirst({
            where: {
              userId: String(frameMessage?.requesterFid),
              gameId: game.id,
              valid: true,
              success: false,
            },
          });

          const chess = new Chess(game.fen || undefined);
          const toPlay = chess.turn() === "w" ? "white" : "black";

          if (vote) {
            const votes = await votesScreen(game, vote, chess);

            return (
              <div className="p-4">
                <Link href={createDebugUrl(url)} className="underline">
                  Debug
                </Link>
                <FrameContainer
                  postUrl="/frames"
                  pathname="/"
                  state={state}
                  previousFrame={previousFrame}
                  accepts={acceptedProtocols}
                >
                  <FrameImage aspectRatio="1.91:1">{votes.image}</FrameImage>
                  {votes.input}
                  {votes.button}
                </FrameContainer>
              </div>
            );
          }

          const { image, input, button } = await play(frameMessage, user);

          return (
            <div className="p-4">
              <Link href={createDebugUrl(url)} className="underline">
                Debug
              </Link>
              <FrameContainer
                postUrl={`/frames`}
                pathname="/"
                state={state}
                previousFrame={previousFrame}
                accepts={acceptedProtocols}
              >
                <FrameImage aspectRatio="1.91:1">{image}</FrameImage>

                {input}
                {button}
              </FrameContainer>
            </div>
          );
        }

        if (!user && team && searchParams?.confirm) {
          const address = (frameMessage?.requesterVerifiedAddresses[0] ||
            searchParams?.address) as string;

          if (!address) {
            if (frameMessage?.inputText) {
              let newWallets = await createEmbeddedWallet(
                frameMessage?.inputText as string,
                fid!,
                [ChainEnum.Evm]
              );

              return (
                <FrameContainer
                  postUrl={`/frames`}
                  pathname="/"
                  state={state}
                  previousFrame={previousFrame}
                  accepts={acceptedProtocols}
                >
                  <FrameImage>
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
                        Your wallet has been created!
                      </div>
                    </div>
                  </FrameImage>
                  <FrameButton
                    action="post"
                    target={`/frames?page=start&team=${team}&confirm=true&address=${newWallets[0]}`}
                  >
                    Continue
                  </FrameButton>
                  <FrameButton
                    action="link"
                    target="https://demo.dynamic.xyz/?use-environment=Farcaster"
                  >
                    Log in to dynamic to access your wallets
                  </FrameButton>
                </FrameContainer>
              );
            }

            return (
              <FrameContainer
                postUrl={`/frames`}
                pathname="/"
                state={state}
                previousFrame={previousFrame}
                accepts={acceptedProtocols}
              >
                <FrameImage>
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
                      You need a wallet address to join the {team} team.
                      Don&apos;t have one? Create one using your email
                    </div>
                  </div>
                </FrameImage>

                <FrameInput text="Enter your email" />

                <FrameButton
                  action="post"
                  target={`/frames?page=start&team=${team}&confirm=true`}
                >
                  Create wallet
                </FrameButton>
              </FrameContainer>
            );
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

            if (previousFrame.postBody) {
              const custom_id = `${team}-join`;
              await fdk.sendAnalytics(
                frame_id,
                previousFrame.postBody,
                custom_id
              );
            }

            return (
              <FrameContainer
                postUrl={`/frames`}
                pathname="/"
                state={state}
                previousFrame={previousFrame}
                accepts={acceptedProtocols}
              >
                <FrameImage>
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
                </FrameImage>

                <FrameButton action="post" target="/frames?page=play">
                  Start playing
                </FrameButton>
              </FrameContainer>
            );
          }
        }

        const options = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
          },
        };

        const reqW = await fetch(
          "https://api.pinata.cloud/farcaster/frames/interactions?custom_id=white-join&frame_id=checkmates&start_date=2024-03-22%2000%3A00%3A00&end_date=2024-03-24%2000%3A00%3A00",
          options
        );

        const reqB = await fetch(
          "https://api.pinata.cloud/farcaster/frames/interactions?custom_id=black-join&frame_id=checkmates&start_date=2024-03-22%2000%3A00%3A00&end_date=2024-03-24%2000%3A00%3A00",
          options
        );

        const analyticsW = await reqW.json();
        const analyticsB = await reqB.json();

        return (
          <FrameContainer
            postUrl="/frames"
            pathname="/"
            state={state}
            previousFrame={previousFrame}
            accepts={acceptedProtocols}
          >
            {team ? (
              <FrameImage aspectRatio="1.91:1">
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
              </FrameImage>
            ) : (
              <FrameImage aspectRatio="1.91:1">
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
                      <p>{analyticsW.total_unique_interactions} members</p>
                    </div>
                    <div tw="flex flex-col w-[50%] justify-center items-center">
                      <p>Black team</p>
                      <p>{analyticsB.total_unique_interactions} members</p>
                    </div>
                  </div>
                </div>
              </FrameImage>
            )}

            {!team ? (
              <FrameButton action="post" target="/frames?page=start&team=white">
                White
              </FrameButton>
            ) : (
              <FrameButton
                action="post"
                target={`/frames?page=start&confirm=true&team=${team}`}
              >
                Yes
              </FrameButton>
            )}

            {!team ? (
              <FrameButton action="post" target="/frames?page=start&team=black">
                Black
              </FrameButton>
            ) : (
              <FrameButton action="post" target="/frames?page=start">
                No
              </FrameButton>
            )}
          </FrameContainer>
        );
      }

      return (
        <FrameContainer
          postUrl={`/frames`}
          pathname="/"
          state={state}
          previousFrame={previousFrame}
          accepts={acceptedProtocols}
        >
          <FrameImage
            src={`${process.env.NEXT_PUBLIC_HOST}/chessmates.png`}
            aspectRatio="1.91:1"
          />

          <FrameButton action="post" target="/frames?page=start">
            Play
          </FrameButton>

          <FrameButton action="post" target="/frames?page=info">
            Information
          </FrameButton>

          <FrameButton action="post" target="/frames?page=leaderboard">
            Leaderboard
          </FrameButton>

          <FrameButton action="post" target="/frames?page=profile">
            Profile
          </FrameButton>
        </FrameContainer>
      );
    } catch (e) {
      console.error(e);
    }
  }
}
