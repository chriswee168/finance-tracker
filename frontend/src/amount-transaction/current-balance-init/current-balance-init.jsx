import { useState } from "react";
import styles from "./current-balance-init.module.css";
import { SIGN_COLOURS } from "../../utils/constants";
import { saveCurrentAmounts } from "../amount-transaction";

/**
 * Component to prompt the user to set the current balance.
 * 
 * @param {Object} param0 
 * @param {number} param0.netIncome Net income in dollars.
 * @param {number} param0.currentBalance Current balance in dollars.
 * @param {Dispatch<SetStateAction<number>>} param0.setCurrentBalance Setter for current balance.
 * 
 * @returns Current balance initialisation component.
*/
export default function CurrentBalanceInit({
  netIncome,
  currentBalance,
  setCurrentBalance
})
{
  const [amount, setAmount] = useState('');

  // Main function to execute when submit function pressed.
  const submitFunc = () =>
  {
    const amountNum = Number(amount);
    // Set the initial current balance.
    setCurrentBalance(amountNum);
    // Send initial current balance to FastAPI backend along with
    // existing net income.
    saveCurrentAmounts(netIncome, amountNum);
    // Clear user input.
    setAmount('');
  }
  
  return (
    <div className={styles.currentBalanceWrapper}>
      <h4 className={styles.currentBalanceTitle}>INITIAL CURRENT BALANCE</h4>
      <div className={styles.cashAmountInput}>
      <label htmlFor="cash-input" className={styles.cashAmountLabel}>Current balance amount in dollars: </label><br/>
      <input id="cash-input" value={amount} type="number" 
        placeholder="00.00" onChange={(event) => setAmount(event.target.value)}/>
      </div>
      <button onClick={() => submitFunc()}>SUBMIT</button>
    </div>
  )
}