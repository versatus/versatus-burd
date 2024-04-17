import process from "process";

export const BURD_PROGRAM_ADDRESS = String(
  process.env["NEXT_PUBLIC_BURD_PROGRAM_ADDRESS"],
);
export const BURD_OWNER_ADDRESS = String(
  process.env["NEXT_PUBLIC_BURD_OWNER_ADDRESS"],
);

export const ETH_PROGRAM_ADDRESS = "0x0000000000000000000000000000000000000000";
