import { useEffect, useState } from "react";
import TransactionEntry from "./transaction-entry/transaction-entry";
import styles from "./transaction-history.module.css";
import { apiGetJSON } from "../utils/api/apiService";
import { URL_PATHS } from "../utils/api/apiConfig";
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
          for (let i = 0; i < data.length; i++)
          {
            tempEntries.push(
              <TransactionEntry 
                key={i} 
                datetime={data[i].datetime}
                type={data[i].type}
                amountCents={data[i].amount_cents}
                desc={data[i].desc}
              />
            );
          }
          setEntries(tempEntries);
        }
      )
  }, []);

  return (
    <div className={styles.transactionHistory}>
      <h1 className={styles.historyTitle}>TRANSACTION HISTORY</h1>
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
      key={entries.length} 
      datetime={data.datetime}
      type={data.type}
      amountCents={data.amount_cents}
      desc={data.desc}
    />;
  
  // Insert new entry in the beginning of the entry list as latest.
  setEntries([newEntry, ...entries]);
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
  const url = new URL(URL_PATHS.TRANSACTIONS);
  url.searchParams.append("n_entries", nEntries);
  return url;
}