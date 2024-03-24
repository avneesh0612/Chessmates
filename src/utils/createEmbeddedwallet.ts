import { configDotenv } from "dotenv";
import { ChainEnum } from "@dynamic-labs/sdk-api/models/ChainEnum";
import { UserResponse } from "@dynamic-labs/sdk-api/models/UserResponse";

configDotenv();

const key = process.env.KEY;
const environmentId = process.env.ENVIRONMENT_ID;
let newWallets: string[];

export const createEmbeddedWallet = async (
  email: string,
  fid: number,
  chains: ChainEnum[]
) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      fid,
      chains,
    }),
  };

  const response = await fetch(
    `https://app.dynamic.xyz/api/v0/environments/${environmentId}/embeddedWallets/farcaster`,
    options
  ).then((r) => r.json());

  // @ts-ignore
  newWallets = (response as UserResponse)?.user?.wallets.map(
    (wallet: any) => wallet.publicKey
  );

  return newWallets;
};
