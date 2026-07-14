import styles from "./transaction-entry.module.css";

/**
 * Create transaction entry component to display details of a 
 * single previous transaction.
 * 
 * @returns Transaction entry component.
 */
export default function TransactionEntry({datetime, type, amountDollars, desc})
{
  return (
    <div className={styles.transactionEntry}>
      <div className={styles.amountDollars}>{amountDollars}</div>
      <div className={styles.datetime}>{datetime}</div>
      <div className={styles.type}>{type}</div>
      <div className={styles.desc}>{desc}</div>
    </div>
  )
}