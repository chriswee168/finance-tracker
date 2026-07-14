import styles from "./transaction-history.module.css";

/**
 * Create transaction history component to display previous transactions
 * made by user.
 * 
 * @returns Transaction history component.
 */
export default function TransactionHistory()
{
  // Array to store transaction entry components that include
  // details of previous transactions.
  const transactionEntries = [];

  return (
    <div className={styles.transactionHistory}>
      <h1>TRANSACTION HISTORY</h1>
      <div className={styles.transactionList}>{transactionEntries}</div>
    </div>
  )
}