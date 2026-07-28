import { useEffect, useState } from "react";
import TransactionEntry from "./transaction-entry/transaction-entry";
import styles from "./transaction-history.module.css";
import { apiGetJSON } from "../utils/api/apiService";
import { REQUEST_URLS } from "../utils/api/apiConfig";
import { MAX_TRANSACTION_ENTRIES } from "../utils/constants";

/**
 * Create transaction history component to display previous transactions
 * made by user.
 * 
 * @param {Object} param0 
 * @param {JSX.Element[]} param0.entries List of TransactionEntry components.
 * @param {Dispatch<SetStateAction<JSX.Element[]>>} param0.setEntries Setter for entries list.
 * 
 * @returns Transaction history component.
 */
export default function TransactionHistory({entries, setEntries})
{
  // Default message to display when no transactions have ever been made.
  const defaultMsg = <div className={styles.defaultMsg}>NO TRANSACTIONS</div>;

  const url = createEntryGetURL(MAX_TRANSACTION_ENTRIES);

  // Get transaction entries from backend SQL database.
  useEffect(() => {
    apiGetJSON(url)
      .then(
        (data) => {
          const tempEntries = [];
          for (const entry of data)
          {
            tempEntries.push(
              <TransactionEntry 
                key={entry.entry_id}
                datetime={entry.datetime}
                type={entry.type}
                amountCents={entry.amount_cents}
                desc={entry.desc}
              />
            );
          }
          setEntries(tempEntries);
        }
      )
  }, []);

  return (
    <div className={styles.transactionHistory}>
      <h3 className={styles.historyTitle}>TRANSACTION HISTORY</h3>
      <div className={styles.transactionList}>
        {entries.length == 0 ? defaultMsg : entries}
      </div>
    </div>
  )
}

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