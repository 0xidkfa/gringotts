import { providers, Contract } from 'ethers';
import { NextRequest, NextResponse } from 'next/server';
import marketLensAbi from '../../../abis/marketLensAbi.json';
import cauldronAbi from '../../../abis/cauldronAbi.json';
import { MARKET_LENS_ADDR } from '@/helpers/constants';

export async function POST(request: NextRequest) {
  const { chain, cauldronAddress } = await request.json();
  console.log(chain, cauldronAddress);

  let provider = new providers.JsonRpcProvider(process.env[`${chain?.chainName.toUpperCase()}_RPC_URL`]);

  let lensContract = new Contract(MARKET_LENS_ADDR, marketLensAbi, provider);
  let cauldronContract = new Contract(cauldronAddress, cauldronAbi, provider);

  let info = await lensContract.getMarketInfoCauldronV3(cauldronAddress);
  let degenboxAddress = await cauldronContract.bentoBox();
  let mimAddress = await cauldronContract.magicInternetMoney();

  return NextResponse.json({ mimAddress, degenboxAddress, ...fromStructToObject(info) });
}

function getCauldronContract(cauldronAddress: string) {}

export function fromStructToObject<T extends object>(struct: [] & T): T {
  struct = { ...struct };
  const keysNumber = Object.keys(struct).length;
  for (var i = 0; i < keysNumber / 2; i++) {
    delete struct[i];
  }

  return struct;
}
