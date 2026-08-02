import { REQUEST_URLS } from "../utils/api/apiConfig";
import { MAX_TRANSACTION_ENTRIES } from "../utils/constants";
import TransactionEntry from "./transaction-entry/transaction-entry";

/**
 * Function to add a new transaction to entry list directly after submitting.
 * 
 * @param {JSX.Element[]} entries List of TransactionEntry components.
 * @param {Dispatch<SetStateAction<JSX.Element[]>>} setEntries Setter for entries list.
 */
export const addToHistoryList = (entries, setEntries, data) => 
{
  const newEntry = 
    <TransactionEntry 
      key={data.entry_id}
      datetime={data.datetime}
      type={data.type}
      amountCents={data.amount_cents}
      desc={data.desc}
    />;
  
  // Ensure number of transaction entries does not exceed maximum number 
  // of transaction entries.
  const upperIdx = 
    entries.length >= MAX_TRANSACTION_ENTRIES ? entries.length - 1 : entries.length;

  // Insert new entry in the beginning of the entry list as latest.
  setEntries([newEntry, ...entries.slice(0, upperIdx)]);
}

/**
 * Helper function to create the required URL path to obtain N transaction
 * entries from backend SQL database.
 * 
 * @param {number} nEntries Number of entries to get from backend SQL database.
 * 
 * @returns New URL for GET request.
 */
export const createEntryGetURL = (nEntries) =>
{
  const url = new URL(REQUEST_URLS.TRANSACTIONS);
  url.searchParams.append("n_entries", nEntries);
  return url;
}