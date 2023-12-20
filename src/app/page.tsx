"use client";

import SubmitButton from "@/components/SubmitButton";
import { bn, expandDecimals, postData, safeJsonParse } from "@/helpers/utils";
import { useEffect, useState } from "react";
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import { useFlashMessage } from "@/helpers/UseFlashMessage";
import { MetaTransaction } from "ethers-multisend";
import { BigNumber } from "ethers";
import { getMimApproveTx, getMimTopupTx } from "@/models/GnosisEncoder";
import _ from "underscore";
import { Card } from "@/components/Card";
import { CauldronInfoCard } from "@/components/CauldronInfoCard";
import { getDegenBoxMimBalance } from "@/models/DistributionCalculator";
import { PlusIcon } from "@heroicons/react/24/outline";

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

interface TxInfo {
  mimAmount: string;
  cauldronInfo: CauldronInfo | undefined;
  isSubmitting: boolean;
}

function TopUpManager(props: {}) {
  const { showFlashMessage } = useFlashMessage();
  const [inputCauldronAddr, setInputCauldronAddr] = useState("");
  const [inputMimAmount, setInputMimAmount] = useState("0");
  const [cauldronCards, setCauldronCards] = useState<{ [key: string]: TxInfo }>(
    {},
  );
  const { sdk, safe } = useSafeAppsSDK();

  async function fetchCauldronInfo(cauldronAddress: string) {
    let response: CauldronInfo;

    try {
      setCauldronCards((prevCards) => ({
        ...prevCards,
        [cauldronAddress]: {
          mimAmount: inputMimAmount,
          isSubmitting: true,
          cauldronInfo: undefined,
        },
      }));

      let chain = await sdk.safe.getChainInfo();
      response = await postData("/api/cauldronInfo", {
        cauldronAddress,
        chain,
      });

      return response;
    } catch (error) {
      showFlashMessage({
        type: "error",
        heading: "Porcodillo!",
        message: `${error}`,
      });
    }
  }

  async function addTransaction(cauldronAddress: string, mimAmount: string) {
    let info = await fetchCauldronInfo(cauldronAddress);

    setCauldronCards((prevCards) => ({
      ...prevCards,
      [cauldronAddress]: {
        mimAmount: mimAmount,
        cauldronInfo: info,
        isSubmitting: false,
      },
    }));
  }

  async function getSubmitHandler() {
    if (_.keys(cauldronCards).length == 0) {
      return;
    }

    let txs = Array<MetaTransaction>();

    // This should be contained in the refund response...
    try {
      let mimAddresses = _.uniq(
        _.map(
          cauldronCards,
          (card, address) => card.cauldronInfo?.mimAddress || "",
        ),
      );
      let degenboxAddresses = _.uniq(
        _.map(
          cauldronCards,
          (card, address) => card.cauldronInfo?.degenboxAddress || "",
        ),
      );

      if (degenboxAddresses.length > 1)
        throw (
          "Multiple degenboxAddresses found" + JSON.stringify(degenboxAddresses)
        );
      if (mimAddresses.length > 1)
        throw "Multiple mimAddresses found" + JSON.stringify(mimAddresses);

      let totalMimAmountBn = _.reduce(
        cauldronCards,
        (acc, card, _) => acc.add(card.mimAmount),
        bn(0),
      );

      txs.push(
        getMimApproveTx({
          amount: totalMimAmountBn.mul(expandDecimals(18)),
          mimAddress: _.first(mimAddresses) || "",
          degenboxAddress: _.first(degenboxAddresses) || "",
        }),
      );

      _.map(cauldronCards, (card, address) =>
        txs.push(
          getMimTopupTx({
            cauldronAddress: card.cauldronInfo?.cauldron || "",
            safeAddress: safe.safeAddress,
            amount: bn(card.mimAmount).mul(expandDecimals(18)),
            mimAddress: card.cauldronInfo?.mimAddress || "",
            degenboxAddress: card.cauldronInfo?.degenboxAddress || "",
          }),
        ),
      );

      const { safeTxHash } = await sdk.txs.send({ txs });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <div className="mt-5 flex flex-col gap-12 lg:flex-row">
        <div className="flex w-full flex-col gap-6 lg:w-1/4">
          <div>
            <div className="relative mt-2">
              <label
                htmlFor="cauldron"
                className="block text-xs font-medium text-zinc-600"
              >
                Cauldron Address
              </label>
              <input
                type="text"
                name="cauldron"
                id="cauldron"
                className="peer block w-full bg-transparent py-1.5 pl-3 text-gray-200 focus:outline-none sm:text-sm sm:leading-6"
                placeholder="0x..."
                onChange={(event) => setInputCauldronAddr(event.target.value)}
                value={inputCauldronAddr}
              />
              <div
                className="peer-focus:border-t-1 absolute inset-x-0 bottom-0 border-t border-gray-400 peer-focus:border-blue-500"
                aria-hidden="true"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-xs font-medium text-zinc-600"
            >
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
                className="peer block w-full bg-transparent py-1.5 pr-14 text-right text-gray-200 focus:outline-none sm:text-sm sm:leading-6"
                placeholder="0.00"
                onChange={(e) => setInputMimAmount(e.target.value)}
                value={inputMimAmount}
                aria-describedby="price-currency"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm" id="price-currency">
                  MIM
                </span>
              </div>
              <div
                className="peer-focus:border-t-1 absolute inset-x-0 bottom-0 border-t border-gray-400 peer-focus:border-blue-500"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="flex flex-row gap-x-5">
            <button
              className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => addTransaction(inputCauldronAddr, inputMimAmount)}
            >
              <span>
                <PlusIcon className="mr-2 inline h-5 w-5" />
              </span>
              Add Cauldron
            </button>
            <button
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={getSubmitHandler}
            >
              Generate Gnosis Tx
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 lg:w-3/4">
          {_.map(cauldronCards, (card, key) => (
            <CauldronInfoCard
              cauldronAddress={key}
              info={card.cauldronInfo}
              mimAmount={card.mimAmount}
              isSubmitting={false}
            ></CauldronInfoCard>
          ))}
        </div>
      </div>
    </div>
  );
}
