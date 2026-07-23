import styles from "./transaction-options.module.css";

/**
 * Component to display options to select income or expense for transaction type.
 * 
 * @param {Object} param0
 * @param {number} param0.transactionOption Transaction type state. (0 = income, 1 = expense)
 * @param {Dispatch<SetStateAction<number>>} param0.setTransactionOption Setter for transaction type.
 * 
 * @returns Transaction options component.
 */
export default function TransactionOptions({transactionOption, setTransactionOption})
{
  return (
    <div className={styles.transactionOptionGroup}>
      <label className={styles.transactionOptionLabel}>Transaction option: </label>
      <div className={
        `${styles.transactionOption} 
        ${transactionOption == 0 ? styles.incomeOptionSelected : styles.incomeOption}`
        }
        onClick={() => setTransactionOption(0)}
        >INCOME
      </div>
      <div className={
        `${styles.transactionOption} 
        ${transactionOption == 1 ? styles.expenseOptionSelected : styles.expenseOption}`
        }
        onClick={() => setTransactionOption(1)}
        >EXPENSE
      </div>
    </div>
  )
}