import { useState } from "react";
import styles from "./transaction-box.module.css";


export default function TransactionBox()
{
  return (
    <div className={styles.transactionBox}>
      <h3 className={styles.transactionBoxTitle}>ENTER TRANSACTION</h3>
      <div className={styles.transactionOptionGroup}>
        <label htmlFor="transaction-type" className={styles.transactionTypeLabel}>Transaction type: </label>
        <div className={`${styles.transactionOption} ${styles.incomeOption}`}>Income</div>
        <div className={`${styles.transactionOption} ${styles.expenseOption}`}>Expense</div>
      </div>
      <div className={styles.cashAmountInput}>
        <label htmlFor="cash-input" className={styles.cashAmountLabel}>Cash amount (dollars): </label><br/>
        <label htmlFor="cash-input" className={styles.cashAmountSymbol}>$</label>
        <input id="cash-input" type="text" className={styles.cashAmountTextbox} placeholder="00.00"/>
      </div>
      <div className={styles.descriptionInput}>
        <label htmlFor="desc-input" className={styles.descLabel}>Transaction description: </label>
        <textarea id="desc-input" type="text" className={styles.descTextbox} placeholder="Enter description..."/>
      </div>
    </div>
  )
}