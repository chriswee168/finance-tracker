import { useState } from "react";
import styles from "./transaction-box.module.css";


export default function TransactionBox()
{
  return (
    <div className={styles.transactionBox}>
      <h3>ENTER TRANSACTION</h3>
      <label htmlFor="transaction-type">1. Transaction Type: </label>
      <div className={styles.transactionOptionGroup}>
        <div className={styles.transactionOption}>Income</div>
        <div className={styles.transactionOption}>Expense</div>
      </div>
    </div>
  )
}