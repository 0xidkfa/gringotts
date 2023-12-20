import { formatNumber } from "@/helpers/utils";

export function EmptyCauldronInfoCard({
  mimAmount,
  cauldronAddress,
}: {
  mimAmount: string;
  cauldronAddress: string;
}) {
  const fieldHeadings = [
    "Interest",
    "Collateralization",
    "Opening fee",
    "Liquidation fee",
    "Available to be borrowed",
    "Total borrowed",
    "Collateral amount",
    "Collateral value",
    "Collateral price",
    "Collateral ratio",
  ];

  return (
    <div className="dashboard-card w-[450px] rounded-lg border p-6 shadow-lg dark:border-zinc-700/40 dark:bg-zinc-900">
      <div className="flex flex-col gap-x-4 gap-y-4">
        <div className="flex flex-row">
          <div className="flex w-1/2 flex-col">
            <div className="text-sm font-medium text-gray-600">Cauldron</div>
            <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-300 dark:bg-gray-700 "></div>
            <span className="flex flex-row pt-1 text-xs font-light dark:text-zinc-200">
              {cauldronAddress}
            </span>
          </div>
        </div>
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex flex-row">
            <div className="flex w-1/2 flex-col">
              <div className="text-sm font-medium text-gray-600">
                {fieldHeadings[index * 2]}
              </div>
              <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
            </div>
            <div className="flex w-1/2 flex-col">
              <div className="text-sm font-medium text-gray-600">
                {fieldHeadings[index * 2 + 1]}
              </div>
              <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-gray-600 pt-4">
        <span className="text-gray-600">Top Up Amount</span>
        <span className="font-semibold text-black dark:text-emerald-400">
          {formatNumber(parseFloat(mimAmount), 2)} MIM
        </span>
      </div>
    </div>
  );
}
//
