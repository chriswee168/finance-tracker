import { useEffect, useRef } from "react";
import { MAX_TRANSACTION_ENTRIES } from "../utils/constants";
import TransactionEntry from "./transaction-entry/transaction-entry";
import { createEntryGetURL } from "./transaction-history-helper-funcs";
import styles from "./transaction-history.module.css";

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

  // Create URL to obtain the latest N transactions from FastAPI backend.
  const url = useRef(null);
  if (url.current == null)
  {
    url.current = createEntryGetURL(MAX_TRANSACTION_ENTRIES);
  }

  // Get transaction entries from backend SQL database.
  useEffect(() => {
    fetch(url.current)
      .then(response => response.json())
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
      ).catch(
        error => console.log(error)
      );
  }, [setEntries]);

  return (
    <div className={styles.transactionHistory}>
      <h3 className={styles.historyTitle}>TRANSACTION HISTORY</h3>
      <div className={styles.transactionList}>
        {entries.length == 0 ? defaultMsg : entries}
      </div>
    </div>
  )
}