import styles from "./transaction-history.module.css";

/**
 * Create transaction history component to display previous transactions
 * made by user.
 * 
 * @returns Transaction history component.
 */
export default function TransactionHistory()
{
  return (
    <div className={styles.transactionHistory}>
      <h1>TRANSACTION HISTORY</h1>
      <div className={styles.historyList}>
        
      </div>
    </div>
  )
}