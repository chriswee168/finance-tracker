import TransactionEntry from "./transaction-entry/transaction-entry";
import styles from "./transaction-history.module.css";

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
  const transactionEntries = [];

  for (let i = 0; i < 10; i++)
  {
    transactionEntries.push(
      <TransactionEntry 
        key={i} 
        datetime={"2025-06-06 12.45pm"}
        type={"income"}
        amountDollars={"22.22"}
        desc={"testing description"}
      />
    );
  }

  return (
    <div className={styles.transactionHistory}>
      <h1>TRANSACTION HISTORY</h1>
      <div className={styles.transactionList}>
        {transactionEntries.length == 0 ? defaultMsg : transactionEntries}
      </div>
    </div>
  )
}