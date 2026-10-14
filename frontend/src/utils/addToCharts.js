import { createEntryGetURL } from "../transaction-history/transaction-history-helper-funcs";
import { REQUEST_URLS } from "./api/apiConfig";
import { MAX_CASH_AMOUNT_ENTRIES } from "./constants";

/**
 * Helper function to add a new cash amount entry from backend to charts.
 * 
 * @param {Object[]} cashAmountEntries List of {timestamp, net_income_cents, current_balance_cents}.
 * @param {Dispatch<SetStateAction<Object[]>>} setCashAmountEntries Cash amount entries setter.
 * @param {number} nthLatestIdx Zeroed index of entry from backend SQL table starting from the right to left.
 */
export const addToCharts = (
    cashAmountEntries, 
    setCashAmountEntries,
    nthLatestIdx
) => 
{
    const url = createEntryGetURL(nthLatestIdx + 1, REQUEST_URLS.CASH_AMOUNTS);    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let length = cashAmountEntries.length;
            const selectedEntry = data[0];
            const startIdx = length >= MAX_CASH_AMOUNT_ENTRIES ? 1 : 0;

            // Avoid entries with duplicate timestamps.
            const latestElement = cashAmountEntries.at(-1);
            if (latestElement.timestamp == selectedEntry.timestamp)
            {
                length = length - 1
            }

            setCashAmountEntries([
                ...cashAmountEntries.slice(startIdx, length), 
                selectedEntry
            ]);
        })
        .catch(
            error => console.log(error)
        );
}