import { useId, useRef, useState } from "react";
import styles from "./transaction-box.module.css";
import { CASH_DP, SIGN_COLOURS } from "../../constants";

/**
 * Transaction box component to record transaction type, state and amount.
 * 
 * @param {Object} param0 
 * @param {string} param0.cashAmount Cash amount state.
 * @param {string} param0.transactionDesc Transaction description state.
 * @param {Dispatch<SetStateAction<string>>} param0.setAmount Setter for cash amount.
 * @param {Dispatch<SetStateAction<string>>} param0.setTransactionDesc Setter for transaction description.
 * @param {string} param0.netIncomeStates State settings for net income.
 * @param {string} param0.netBalanceStates State settings for net balance.
 * @param {Dispatch<SetStateAction<string>>} param0.setNetIncomeStates Setter for net income.
 * @param {Dispatch<SetStateAction<string>>} param0.setNetBalanceStates Setter for net balance.
 * @param {number} param0.transactionType Transaction type state.
 * @param {Dispatch<SetStateAction<number>>} param0.setTransactionType Setter for transaction type.
 * @param {function(): void} param0.submitFunc Function for submit button to call.
 * 
 * @returns Transaction box component.
 */
export default function TransactionBox({
  cashAmount, transactionDesc, 
  setAmount, setTransactionDesc,
  netIncomeStates, netBalanceStates, 
  setNetIncomeStates, setNetBalanceStates,
  transactionType, setTransactionType, submitFunc
})
{
  return (
    <div className={styles.transactionBox}>
      <h3 className={styles.transactionBoxTitle}>ENTER TRANSACTION</h3>

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
      
      <div className={styles.cashAmountInput}>
        <label htmlFor="cash-input" className={styles.cashAmountLabel}>Cash amount ($): </label><br/>
        <input id="cash-input" value={cashAmount} type="text" className={styles.cashAmountTextbox} 
          placeholder="00.00" onChange={(event) => setAmount(event.target.value)}/>
      </div>
      
      <div className={styles.descriptionInput}>
        <label htmlFor="desc-input" className={styles.descLabel}>Transaction description: </label>
        <textarea id="desc-input" value={transactionDesc} type="text" className={styles.descTextbox} 
          placeholder="Enter description..." onChange={(event) => setTransactionDesc(event.target.value)}/>
      </div>

      <button className={styles.submitButton} 
        onClick={
          () => {
            updateAmount(
              netIncomeStates.amountDollars, transactionType, 
              netIncomeStates.sign, setNetIncomeStates
            );
            updateAmount(
              netBalanceStates.amountDollars, transactionType, 
              netBalanceStates.sign, setNetBalanceStates
            );
            submitFunc();
          }
        }>
        SUBMIT TRANSACTION
      </button>
    </div>
  )
}