import { PinataFDK } from "pinata-fdk";

export const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_JWT!,
  pinata_gateway: "",
});
