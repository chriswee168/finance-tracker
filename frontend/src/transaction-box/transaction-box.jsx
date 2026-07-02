import { useState } from "react";
import styles from "./transaction-box.module.css";


export default function TransactionBox()
{
  return (
    <div className={styles.transactionBox}>
      <h3>ENTER TRANSACTION</h3>
      <div className={styles.transactionOptionGroup}>
        <label htmlFor="transaction-type" className={styles.transactionTypeLabel}>Transaction type: </label>
        <div className={`${styles.transactionOption} ${styles.incomeOption}`}>Income</div>
        <div className={`${styles.transactionOption} ${styles.expenseOption}`}>Expense</div>
      </div>
    </div>
  )
}