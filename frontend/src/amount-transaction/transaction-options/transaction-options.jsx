import styles from "./transaction-options.module.css";

/**
 * Component to display options to select income or expense for transaction type.
 * 
 * @param {Object} param0
 * @param {string} param0.transactionOption Transaction type state. (income/expense).
 * @param {Dispatch<SetStateAction<string>>} param0.setTransactionOption Setter for transaction type.
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
        ${transactionOption == "income" ? styles.incomeOptionSelected : styles.incomeOption}`
        }
        onClick={() => setTransactionOption("income")}
        >INCOME
      </div>
      <div className={
        `${styles.transactionOption} 
        ${transactionOption == "expense" ? styles.expenseOptionSelected : styles.expenseOption}`
        }
        onClick={() => setTransactionOption("expense")}
        >EXPENSE
      </div>
    </div>
  )
}