import { bn, bnToFloat, expandDecimals, formatAddress, formatNumber } from '@/helpers/utils';
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
      {isSubmitting && <Spinner></Spinner>}
      {info?.cauldron && (
        <div className="dashboard-card rounded-lg p-6 shadow-lg bg-black w-[500px]">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-8">
            <div>
              <dt className="text-sm font-medium text-gray-400">Cauldron</dt>
              <dd className="text-white font-semibold">{formatAddress(info.cauldron)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Interest</dt>
              <dd className="text-green-400 font-semibold">{bnToFloat(info.interestPerYear, 2).toFixed(2) + '%'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Collateralization</dt>
              <dd className="text-green-400 font-semibold">
                {bnToFloat(info.maximumCollateralRatio, 2).toFixed(2) + '%'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Opening fee</dt>
              <dd className="text-green-400 font-semibold">{bnToFloat(info.borrowFee, 2).toFixed(2) + '%'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Liquidation fee</dt>
              <dd className="text-green-400 font-semibold">{bnToFloat(info.liquidationFee, 2).toFixed(2) + '%'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Available to be borrowed</dt>
              <dd className="text-white font-semibold">
                {formatNumber(bn(info.marketMaxBorrow).div(expandDecimals(18)).toNumber()).toString() + ' MIM'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Total Borrowed</dt>
              <dd className="text-white font-semibold">
                {formatNumber(bn(info.totalBorrowed).div(expandDecimals(18)).toNumber()).toString() + ' MIM'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Collateral Amount</dt>
              <dd className="text-white font-semibold">
                {formatNumber(bn(info.totalCollateral[0]).div(expandDecimals(18)).toNumber()).toString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Collateral Value</dt>
              <dd className="text-green-400 font-semibold">
                {formatNumber(bn(info.totalCollateral[1]).div(expandDecimals(18)).toNumber()).toString() + ' MIM'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Collateral Price</dt>
              <dd className="text-white font-semibold">
                {'$' + formatNumber(bnToFloat(bn(info.collateralPrice).div(expandDecimals(14)), 4)).toString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">LTV</dt>
              <dd className="text-red-500 font-semibold">
                {bnToFloat(bn(info.totalBorrowed).mul(expandDecimals(3)).div(bn(info.totalCollateral[1])), 1).toFixed(
                  2
                ) + '%'}
              </dd>
            </div>
          </dl>
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-600">
            <span className="text-gray-400">Top Up Amount</span>
            <span className="text-white font-semibold">{formatNumber(parseFloat(mimAmount), 2)} MIM</span>
          </div>
        </div>
      )}
    </>
  );
}
