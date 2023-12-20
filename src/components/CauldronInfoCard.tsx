import {
  bn,
  bnToFloat,
  formatNumber,
  expandDecimals,
  formatAddress,
} from "@/helpers/utils";
import Spinner from "./Spinner";
import {
  ClipboardIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { EmptyCauldronInfoCard } from "./EmptyCauldronInfoCard";

export function CauldronInfoCard(
  {
    cauldronAddress,
    info,
    mimAmount,
    isSubmitting,
  }: {
    cauldronAddress: string;
    info: any;
    mimAmount: string;
    isSubmitting: boolean;
  },
) {
  function lowMimBalance() {
    let marketMaxBorrow = bn(info.marketMaxBorrow)
      .div(expandDecimals(18))
      .toNumber();
    let totalBorrowed = bn(info.totalBorrowed)
      .div(expandDecimals(18))
      .toNumber();
    let ratio = marketMaxBorrow / (totalBorrowed + marketMaxBorrow);

    return ratio < 0.1;
  }

  return (
    <>
      {!info?.cauldron && (
        <EmptyCauldronInfoCard
          cauldronAddress={cauldronAddress}
          mimAmount={mimAmount}
        />
      )}
      {info?.cauldron && (
        <div className="dashboard-card w-full rounded-lg border p-6 shadow-lg dark:border-zinc-700/40 dark:bg-zinc-900 lg:w-[450px]">
          <div className="flex flex-col gap-x-4 gap-y-4">
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-600">Cauldron</div>
              <div className="flex flex-col font-semibold text-black dark:text-zinc-100">
                <span>{info.collateral}</span>
                <span className="flex flex-row pt-1 text-xs font-light dark:text-zinc-200">
                  {info.cauldron}
                </span>
              </div>
            </div>
            <div className="flex w-full flex-row">
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">
                  Interest
                </div>
                <div className="font-semibold text-zinc-100">
                  {bnToFloat(info.interestPerYear, 2).toFixed(2) + "%"}
                </div>
              </div>
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">
                  Collateralization
                </div>
                <div className="font-semibold text-zinc-100">
                  {bnToFloat(info.maximumCollateralRatio, 2).toFixed(2) + "%"}
                </div>
              </div>
            </div>
            <div className="flex w-full flex-row">
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">
                  Opening fee
                </div>
                <div className="font-semibold text-zinc-100">
                  {bnToFloat(info.borrowFee, 2).toFixed(2) + "%"}
                </div>
              </div>
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">
                  Liquidation fee
                </div>
                <div className="font-semibold text-zinc-100">
                  {bnToFloat(info.liquidationFee, 2).toFixed(2) + "%"}
                </div>
              </div>
            </div>
            <div className="flex w-full flex-row">
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">
                  Available to be borrowed
                </div>

                <div
                  className={`text-black ${
                    lowMimBalance()
                      ? "dark:text-red-400"
                      : "dark:text-emerald-400"
                  } font-semibold`}
                >
                  {formatNumber(
                    bn(info.marketMaxBorrow).div(expandDecimals(18)).toNumber(),
                  ).toString() + " MIM"}
                </div>
              </div>
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">
                  Total borrowed
                </div>
                <div className="font-semibold text-black dark:text-zinc-100">
                  {formatNumber(
                    bn(info.totalBorrowed).div(expandDecimals(18)).toNumber(),
                  ).toString() + " MIM"}
                </div>
              </div>
            </div>
            <div className="flex w-full flex-row">
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">
                  Collateral amount
                </div>
                <div className="font-semibold text-black dark:text-zinc-100">
                  {formatNumber(
                    bn(info.totalCollateral[0])
                      .div(expandDecimals(18))
                      .toNumber(),
                  ).toString()}
                </div>
              </div>
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">
                  Collateral value
                </div>
                <div className="font-semibold text-zinc-100">
                  {formatNumber(
                    bn(info.totalCollateral[1])
                      .div(expandDecimals(18))
                      .toNumber(),
                  ).toString() + " MIM"}
                </div>
              </div>
            </div>
            <div className="flex w-full flex-row">
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">
                  Collateral price
                </div>
                <div className="font-semibold text-black dark:text-zinc-100">
                  {"$" +
                    formatNumber(
                      bnToFloat(
                        bn(info.collateralPrice).div(expandDecimals(14)),
                        4,
                      ),
                    ).toString()}
                </div>
              </div>
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">
                  Collateral ratio
                </div>
                <div className="font-semibold text-zinc-100">
                  {bnToFloat(
                    bn(info.totalCollateral[1])
                      .mul(expandDecimals(3))
                      .div(bn(info.totalBorrowed)),
                    1,
                  ).toFixed(2) + "%"}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-gray-600 pt-4">
            <span className="text-gray-600">Top Up Amount</span>
            <span className="font-semibold text-black dark:text-emerald-400">
              {formatNumber(parseFloat(mimAmount), 2)} MIM
            </span>
          </div>
        </div>
      )}
    </>
  );
}
