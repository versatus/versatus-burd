import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import process from "process";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { address: string };
  },
) {
  const LASR_RPC_URL = process.env["LASR_RPC_URL"];
  if (!LASR_RPC_URL) {
    return NextResponse.json(
      { error: "lasr rpc url missing from ENV" },
      { status: 404 },
    );
  }

  const response = await axios.post(LASR_RPC_URL, {
    jsonrpc: "2.0",
    method: "lasr_getAccount",
    params: [params.address],
    id: 1,
  });

  return NextResponse.json(JSON.parse(response.data.result));
}
