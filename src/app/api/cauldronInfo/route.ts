import { providers, Contract } from "ethers";
import { NextRequest, NextResponse } from "next/server";
import marketLensAbi from "../../../abis/marketLensAbi.json";
import cauldronAbi from "../../../abis/cauldronAbi.json";
import mimErc20Abi from "../../../abis/mimERC20Abi.json";
import { MARKET_LENS_ADDR } from "@/helpers/constants";

export async function POST(request: NextRequest) {
  const { chain, cauldronAddress } = await request.json();

  let provider = new providers.JsonRpcProvider(getProvider(chain?.chainId));

  let lensContract = new Contract(MARKET_LENS_ADDR, marketLensAbi, provider);
  let cauldronContract = new Contract(cauldronAddress, cauldronAbi, provider);

  let info;
  try {
    info = await lensContract.getMarketInfoCauldronV3(cauldronAddress);
  } catch (e) {
    info = await lensContract.getMarketInfoCauldronV2(cauldronAddress);
  }
  let degenboxAddress = await cauldronContract.bentoBox();
  let collateralAddress = await cauldronContract.collateral();
  let mimAddress = await cauldronContract.magicInternetMoney();

  let collateralContract = new Contract(
    collateralAddress,
    mimErc20Abi,
    provider,
  );
  let collateral = await collateralContract.name();

  return NextResponse.json({
    mimAddress,
    degenboxAddress,
    collateral,
    ...fromStructToObject(info),
  });
}

function fromStructToObject<T extends object>(struct: [] & T): T {
  struct = { ...struct };
  const keysNumber = Object.keys(struct).length;
  for (var i = 0; i < keysNumber / 2; i++) {
    delete struct[i];
  }

  return struct;
}

function getProvider(chainId: string) {
  return {
    "1": process.env.MAINNET_RPC_URL,
    "10": process.env.OPTIMISM_RPC_URL,
    "56": process.env.BSC_RPC_URL,
    "250": process.env.FANTOM_RPC_URL,
    "42161": process.env.ARBITRUM_RPC_URL,
    "137": process.env.POLYGON_RPC_URL,
    "43114": process.env.AVALANCHE_RPC_URL,
    "1285": process.env.MOONRIVER_RPC_URL,
    "2222": process.env.KAVA_RPC_URL,
    "59144": process.env.LINEA_RPC_URL,
    "8453": process.env.BASE_RPC_URL,
    "534352": process.env.SCROLL_RPC_URL,
    // Add more mappings as needed
  }[chainId];
}
