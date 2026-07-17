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
 * @returns Transaction history component.
 */
export default function TransactionHistory()
{
  // Default message to display when no transactions have ever been made.
  const defaultMsg = <div className={styles.defaultMsg}>NO TRANSACTIONS</div>;

  // Array to store transaction entry components that include
  // details of previous transactions.
  const [entries, setEntries] = useState([]);

  const url = new URL(URL_PATHS.TRANSACTIONS);
  url.searchParams.append("n_entries", MAX_TRANSACTION_ENTRIES);

  // Get transaction entries from backend SQL database.
  useEffect(() => {
    apiGetJSON(url)
      .then(
        (data) => {
          const tempEntries = [];
          for (let i = 0; i < data.length; i++)
          {
            if (data[i].desc == '')
            {
              data[i].desc = 'No description.';
            }
            
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
      <h1>TRANSACTION HISTORY</h1>
      <div className={styles.transactionList}>
        {entries.length == 0 ? defaultMsg : entries}
      </div>
    </div>
  )
}