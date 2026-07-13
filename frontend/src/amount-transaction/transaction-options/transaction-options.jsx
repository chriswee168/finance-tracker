import styles from "./transaction-options.module.css";

/**
 * Component to display options to select income or expense for transaction type.
 * 
 * @param {Object} param0
 * @param {number} param0.transactionType Transaction type state. (0 = income, 1 = expense)
 * @param {Dispatch<SetStateAction<number>>} param0.setTransactionType Setter for transaction type.
 * 
 * @returns Transaction options component.
 */
export default function TransactionOptions({transactionType, setTransactionType})
{
  return (
    <div className={styles.transactionOptionGroup}>
      <label htmlFor="transaction-type" className={styles.transactionTypeLabel}>Transaction type: </label>
      <div className={
        `${styles.transactionOption} 
        ${transactionType == 0 ? styles.incomeOptionSelected : styles.incomeOption}`
        }
        onClick={() => setTransactionType(0)}
        >Income
      </div>
      <div className={
        `${styles.transactionOption} 
        ${transactionType == 1 ? styles.expenseOptionSelected : styles.expenseOption}`
        }
        onClick={() => setTransactionType(1)}
        >Expense
      </div>
    </div>
  )
}