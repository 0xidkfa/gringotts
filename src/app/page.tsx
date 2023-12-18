'use client';

import SubmitButton from '@/components/SubmitButton';
import { bn, expandDecimals, postData, safeJsonParse } from '@/helpers/utils';
import { useEffect, useState } from 'react';
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
import { useFlashMessage } from '@/helpers/UseFlashMessage';
import { MetaTransaction } from 'ethers-multisend';
import { BigNumber } from 'ethers';
import { getMimApproveTx, getMimTopupTx } from '@/models/GnosisEncoder';
import _ from 'underscore';
import { Card } from '@/components/Card';
import { CauldronInfoCard } from '@/components/CauldronInfoCard';
import { getDegenBoxMimBalance } from '@/models/DistributionCalculator';
import QuickNode from '@quicknode/sdk';

export default function Home() {
  return (
    <div className=" container mx-auto px-8 py-4">
      <TopUpManager></TopUpManager>
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
  const [cauldronInfo, setCauldronInfo] = useState<CauldronInfo | undefined>(undefined);
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
    if (cauldronAddress !== '') {
      timeoutId = setTimeout(() => {
        fetchData(); // Call the async function
      }, 1000);
    }

    // Cleanup function to clear the timeout when the component unmounts or cauldronAddress changes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [cauldronAddress]);

  async function getSubmitHandler() {
    if (cauldronInfo === undefined) {
      return;
    }

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
      <div className="mt-5 flex flex-row gap-24">
        <div className="flex flex-col w-1/3 gap-6">
          <div>
            <div className="mt-2 relative">
              <label htmlFor="cauldron" className="block text-xs font-medium text-zinc-600">
                Cauldron Address
              </label>
              <input
                type="text"
                name="cauldron"
                id="cauldron"
                className="peer block w-full bg-transparent py-1.5 text-gray-200 pl-3 focus:outline-none sm:text-sm sm:leading-6"
                placeholder="0x..."
                onChange={(event) => setCauldronAddress(event.target.value)}
                value={cauldronAddress}
              />
              <div
                className="absolute inset-x-0 bottom-0 border-t border-gray-400 peer-focus:border-t-1 peer-focus:border-blue-500"
                aria-hidden="true"
              />
            </div>
          </div>

          <div>
            <label htmlFor="amount" className="block text-xs font-medium text-zinc-600">
              Top-up Amount
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                name="price"
                id="price"
                className="peer block w-full bg-transparent py-1.5 text-gray-200 pr-14 text-right focus:outline-none sm:text-sm sm:leading-6"
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
              <div
                className="absolute inset-x-0 bottom-0 border-t border-gray-400 peer-focus:border-t-1 peer-focus:border-blue-500"
                aria-hidden="true"
              />
            </div>
          </div>

          <div>
            <button
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={getSubmitHandler}
            >
              Submit
            </button>
          </div>
        </div>
        <div className="w-2/3 flex flex-col">
          <CauldronInfoCard info={cauldronInfo} mimAmount={mimAmount} isSubmitting={isSubmitting}></CauldronInfoCard>
        </div>
      </div>
    </div>
  );
}
