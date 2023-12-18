import { bn, bnToFloat, formatNumber, expandDecimals } from '@/helpers/utils';
import Spinner from './Spinner';

export function CauldronInfoCard({
  info,
  mimAmount,
  isSubmitting,
}: {
  info: any;
  mimAmount: string;
  isSubmitting: boolean;
}) {
  return (
    <>
      {isSubmitting && (
        <span className="text-blue-500">
          <Spinner></Spinner>
        </span>
      )}
      {info?.cauldron && !isSubmitting && (
        <div className="dashboard-card rounded-lg p-6 shadow-lg dark:bg-zinc-900 border dark:border-zinc-700/40 w-[500px]">
          <div className="flex flex-col gap-x-4 gap-y-6">
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-600">Cauldron</div>
              <div className="text-black dark:text-zinc-100 font-semibold">
                {info.collateral} {info.cauldron}
              </div>
            </div>
            <div className="flex flex-row w-full">
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">Interest</div>
                <div className="text-emerald-400 font-semibold">
                  {bnToFloat(info.interestPerYear, 2).toFixed(2) + '%'}
                </div>
              </div>
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">Collateralization</div>
                <div className="text-emerald-400 font-semibold">
                  {bnToFloat(info.maximumCollateralRatio, 2).toFixed(2) + '%'}
                </div>
              </div>
            </div>
            <div className="flex flex-row w-full">
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">Opening fee</div>
                <div className="text-emerald-400 font-semibold">{bnToFloat(info.borrowFee, 2).toFixed(2) + '%'}</div>
              </div>
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">Liquidation fee</div>
                <div className="text-emerald-400 font-semibold">
                  {bnToFloat(info.liquidationFee, 2).toFixed(2) + '%'}
                </div>
              </div>
            </div>
            <div className="flex flex-row w-full">
              <div className="flex w-1/2 flex-col">
                <div className="text-sm font-medium text-gray-600">Available to be borrowed</div>
                <div className="text-black dark:text-zinc-100 font-semibold">
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
                <div className="text-emerald-400 font-semibold">
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
                <div className="text-red-400 font-semibold">
                  {bnToFloat(bn(info.totalCollateral[1]).mul(expandDecimals(3)).div(bn(info.totalBorrowed)), 1).toFixed(
                    2
                  ) + '%'}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-600">
            <span className="text-gray-600">Top Up Amount</span>
            <span className="text-black dark:text-zinc-100 font-semibold">
              {formatNumber(parseFloat(mimAmount), 2)} MIM
            </span>
          </div>
        </div>
      )}
    </>
  );
}
