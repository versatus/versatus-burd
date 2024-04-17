import axios from "axios";
import { ParsedProgram, Program } from "@/lib/types";
import { ETH_PROGRAM_ADDRESS } from "@versatus/versatus-javascript";
import { BURD_PROGRAM_ADDRESS } from "@/lib/consts";

export const fetchAddressDetails = async ({ address }: { address: string }) => {
  if (!address) return;
  return await axios.get(`/api/addresses/${address}`).then((res) => res.data);
};

export const fetchProgramDetails = async ({
  programAddress,
}: {
  programAddress: string;
}) => {
  return await axios
    .get(`/api/programs/${programAddress}`)
    .then((res: { data: any }) => res.data);
};

export function parseProgramDetailsToArray(
  programs: Record<string, Program> | null,
): ParsedProgram[] {
  if (!programs) return [];
  const parsedProgramsArray: ParsedProgram[] = [];

  for (const [programId, program] of Object.entries(programs)) {
    const balance = parseInt(program.balance, 16) / 1e18;
    const totalSupply = program.metadata.totalSupply
      ? parseInt(program.metadata.totalSupply, 16)
      : undefined;

    parsedProgramsArray.push({
      programId: program.programId,
      address: program.programId,
      ownerId: program.ownerId,
      ownerAddress: program.ownerId,
      balance,
      metadata: {
        name: program.metadata.name,
        symbol: program.metadata.symbol,
        totalSupply,
      },
      tokenIds: program.tokenIds,
      allowance: program.allowance,
      approvals: program.approvals,
      data: program.data,
      status: program.status,
    });
  }

  return parsedProgramsArray;
}

export const fetchAccount = async (address: string) => {
  return await fetchAddressDetails({ address });
};

export const parseTweetsFromAccount = (account: any) => {
  if (!BURD_PROGRAM_ADDRESS) return [];
  if (!account?.programs) return [];
  return Object.entries(account?.programs[BURD_PROGRAM_ADDRESS].data)
    .filter(([key, _]) => key.indexOf("tweet-") > -1)
    .map(([key, value]) => {
      const date = key.replace("tweet-", "");
      return { id: key, date, tweet: value };
    });
};

export const parseLikesFromAccount = (
  account: any,
  tweetId: string,
  address: string,
) => {
  if (!BURD_PROGRAM_ADDRESS) return [];
  if (!account?.programs) return [];

  return Object.entries(account?.programs[BURD_PROGRAM_ADDRESS].data)
    .filter(([key, _]) => key.indexOf("like-") > -1)
    .filter(([key, value]) =>
      key.replace("like-", "tweet-").startsWith(tweetId),
    )
    .map(([key, value]) => {
      const parts = key.split("-");
      console.log({ liker: parts?.[parts.length - 1] });
      return { id: key, liker: parts?.[parts.length - 1] };
    });
};
