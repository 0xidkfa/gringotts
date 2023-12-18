'use client';

import SubmitButton from '@/components/SubmitButton';
import { bn, expandDecimals, postData, safeJsonParse } from '@/helpers/utils';
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
import { useFlashMessage } from '@/helpers/UseFlashMessage';
import { MetaTransaction } from 'ethers-multisend';
import { BigNumber } from 'ethers';
import {
  getMimApproveTx,
  getMimDegenboxDepositTx,
  getMimRepayTx,
  getMimTopupTx,
  getMimTransferTx,
  getMimWithdrawTx,
} from '@/models/GnosisEncoder';
import { MIM_TREASURY_ADDR } from '@/helpers/constants';
import { handleChange, renderInputGroup } from '@/helpers/formUtils';
import _ from 'underscore';
import { Card } from '@/components/Card';
import { CauldronInfoCard } from '@/components/CauldronInfoCard';
import { getDegenBoxMimBalance } from '@/models/DistributionCalculator';

export default function Home() {
  return (
    <div>
      <div className="bg-gray-800 pb-32">
        <header className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">Cauldron Top-ups</h1>
          </div>
        </header>
      </div>
      <div className="-mt-32 container mx-auto bg-white min-h-64 rounded-3xl p-8">
        <div className="">
          <TopUpManager></TopUpManager>
        </div>
      </div>
    </div>
  );
}

interface CauldronInfo {
  mimAddress: string;
  degenboxAddress: string;
  cauldron: string;
  borrowFee: BigNumber;
  maximumCollateralRatio: BigNumber;
  collateralPrice: BigNumber;
  interestPerYear: BigNumber;
  liquidationFee: BigNumber;
  marketMaxBorrow: BigNumber;
  oracleExchangeRate: BigNumber;
  totalBorrowed: BigNumber;
  totalCollateral: [BigNumber, BigNumber];
  userMaxBorrow: BigNumber;
}

function TopUpManager(props: {}) {
  const { showFlashMessage } = useFlashMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cauldronAddress, setCauldronAddress] = useState('');
  const [cauldronInfo, setCauldronInfo] = useState<CauldronInfo>({});
  const [mimAmount, setMimAmount] = useState('0');

  const { sdk, safe } = useSafeAppsSDK();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        setIsSubmitting(true);
        let chain = await sdk.safe.getChainInfo();
        let response = await postData('/api/cauldronInfo', { cauldronAddress, chain });
        console.log(response);
        setCauldronInfo(response);
      } catch (error) {
        showFlashMessage({
          type: 'error',
          heading: 'Porcodillo!',
          message: `${error}`,
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    // Set a timeout to wait for 3 seconds
    timeoutId = setTimeout(() => {
      fetchData(); // Call the async function
    }, 3000);

    // Cleanup function to clear the timeout when the component unmounts or cauldronAddress changes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [cauldronAddress]);

  async function getSubmitHandler() {
    let txs = Array<MetaTransaction>();

    // This should be contained in the refund response...
    try {
      let mimAmountBn = bn(mimAmount).mul(expandDecimals(18));
      txs.push(
        getMimApproveTx({
          amount: mimAmountBn,
          mimAddress: cauldronInfo.mimAddress,
          degenboxAddress: cauldronInfo.degenboxAddress,
        })
      );
      txs.push(
        getMimTopupTx({
          cauldronAddress,
          safeAddress: safe.safeAddress,
          amount: mimAmountBn,
          mimAddress: cauldronInfo.mimAddress || '',
          degenboxAddress: cauldronInfo.degenboxAddress || '',
        })
      );

      const { safeTxHash } = await sdk.txs.send({ txs });
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <h2 className="text-base font-semibold leading-7 text-gray-900">Cauldron Top-up</h2>
      <div className="mb-5">
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <label htmlFor="cauldron" className="block text-sm font-medium leading-6 text-gray-900">
              Cauldron
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="cauldron"
                id="cauldron"
                className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(event) => setCauldronAddress(event.target.value)}
                value={cauldronAddress}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="amount" className="block text-sm font-medium leading-6 text-gray-900">
              Amount
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                name="price"
                id="price"
                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="0.00"
                onChange={(e) => setMimAmount(e.target.value)}
                value={mimAmount}
                aria-describedby="price-currency"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm" id="price-currency">
                  MIM
                </span>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="amount" className="block text-sm font-medium leading-6 text-gray-900">
              &nbsp;
            </label>
            <button
              className="rounded bg-indigo-600 px-4 py-1 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={getSubmitHandler}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <CauldronInfoCard info={cauldronInfo} mimAmount={mimAmount} isSubmitting={isSubmitting}></CauldronInfoCard>
    </div>
  );
}
