import { bn, bnToFloat, formatNumber, expandDecimals, formatAddress } from '@/helpers/utils';
import Spinner from './Spinner';
import { ClipboardIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

export function CauldronInfoCard({
  info,
  mimAmount,
  isSubmitting,
}: {
  info: any;
  mimAmount: string;
  isSubmitting: boolean;
}) {
  function lowMimBalance() {
    let marketMaxBorrow = bn(info.marketMaxBorrow).div(expandDecimals(18)).toNumber();
    let totalBorrowed = bn(info.totalBorrowed).div(expandDecimals(18)).toNumber();
    let ratio = marketMaxBorrow / (totalBorrowed + marketMaxBorrow);

    return ratio < 0.1;
  }

  return (
    <>
      {!info?.cauldron && (
        <div className="dashboard-card rounded-lg p-6 shadow-lg dark:bg-zinc-900 border dark:border-zinc-700/40 w-[450px]">
          <div className="flex flex-col items-center">
            <div className="text-blue-600 w-12 h-12">
              <Spinner></Spinner>
            </div>
            <span className="text-zinc-100">Loading cauldron info...</span>
          </div>
        </div>
      )}
      {info?.cauldron && (
        <div className="dashboard-card rounded-lg p-6 shadow-lg dark:bg-zinc-900 border dark:border-zinc-700/40 w-[450px]">
          <div className="flex flex-col gap-x-4 gap-y-4">
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-600">Cauldron</div>
              <div className="text-black dark:text-zinc-100 font-semibold flex flex-col">
                <span>{info.collateral}</span>
                <span className="font-light text-xs dark:text-zinc-200 flex flex-row pt-1">{info.cauldron}</span>
              </div>
            </div>
            <div className="flex flex-row w-full">
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">Interest</div>
                <div className="text-zinc-100 font-semibold">{bnToFloat(info.interestPerYear, 2).toFixed(2) + '%'}</div>
              </div>
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">Collateralization</div>
                <div className="text-zinc-100 font-semibold">
                  {bnToFloat(info.maximumCollateralRatio, 2).toFixed(2) + '%'}
                </div>
              </div>
            </div>
            <div className="flex flex-row w-full">
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">Opening fee</div>
                <div className="text-zinc-100 font-semibold">{bnToFloat(info.borrowFee, 2).toFixed(2) + '%'}</div>
              </div>
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">Liquidation fee</div>
                <div className="text-zinc-100 font-semibold">{bnToFloat(info.liquidationFee, 2).toFixed(2) + '%'}</div>
              </div>
            </div>
            <div className="flex flex-row w-full">
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">Available to be borrowed</div>

                <div
                  className={`text-black ${
                    lowMimBalance() ? 'dark:text-red-400' : 'dark:text-emerald-400'
                  } font-semibold`}
                >
                  {formatNumber(bn(info.marketMaxBorrow).div(expandDecimals(18)).toNumber()).toString() + ' MIM'}
                </div>
              </div>
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">Total Borrowed</div>
                <div className="text-black dark:text-zinc-100 font-semibold">
                  {formatNumber(bn(info.totalBorrowed).div(expandDecimals(18)).toNumber()).toString() + ' MIM'}
                </div>
              </div>
            </div>
            <div className="flex flex-row w-full">
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">Collateral Amount</div>
                <div className="text-black dark:text-zinc-100 font-semibold">
                  {formatNumber(bn(info.totalCollateral[0]).div(expandDecimals(18)).toNumber()).toString()}
                </div>
              </div>
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">Collateral Value</div>
                <div className="text-zinc-100 font-semibold">
                  {formatNumber(bn(info.totalCollateral[1]).div(expandDecimals(18)).toNumber()).toString() + ' MIM'}
                </div>
              </div>
            </div>
            <div className="flex flex-row w-full">
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">Collateral Price</div>
                <div className="text-black dark:text-zinc-100 font-semibold">
                  {'$' + formatNumber(bnToFloat(bn(info.collateralPrice).div(expandDecimals(14)), 4)).toString()}
                </div>
              </div>
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">Collateral Ratio</div>
                <div className="text-zinc-100 font-semibold">
                  {bnToFloat(bn(info.totalCollateral[1]).mul(expandDecimals(3)).div(bn(info.totalBorrowed)), 1).toFixed(
                    2
                  ) + '%'}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-600">
            <span className="text-gray-600">Top Up Amount</span>
            <span className="text-black dark:text-emerald-400 font-semibold">
              {formatNumber(parseFloat(mimAmount), 2)} MIM
            </span>
          </div>
        </div>
      )}
    </>
  );
}
