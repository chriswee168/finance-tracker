import { useState } from "react";
import { REQUEST_URLS } from "../../utils/api/apiConfig";
import { apiSendAmounts } from "../amount-transaction";
import styles from "./starting-balance.module.css";

/**
 * Component to prompt the user to set the starting balance.
 * 
 * @param {Object} param0 
 * @param {number} param0.netIncome Net income state in dollars.
 * @param {number} param0.currentBalance Current balance state in dollars.
 * @param {Dispatch<SetStateAction<number>>} param0.setCurrentBalance Setter for current balance state.
 * 
 * @returns Starting balance component.
*/
export default function StartingBalance({
  netIncome,
  currentBalance,
  setCurrentBalance
})
{
  const [amount, setAmount] = useState('');

  // Used to control what placeholder text should be displayed for cash input box.
  const [cashValid, setCashValid] = useState(true);

  // Main function to execute when submit function pressed.
  const submitFunc = () =>
  { 
    try
    {
      const amountNum = Number(amount);
      if (isNaN(amountNum))
      {
        throw new Error("Invalid cash amount.");
      }

      // Set the starting balance.
      setCurrentBalance(amountNum);
      // Send starting balance to FastAPI backend along with
      // existing net income for initialisation.
      apiSendAmounts(netIncome, amountNum, "PUT", REQUEST_URLS.CURRENT_AMOUNTS);
    }
    catch (error)
    {
      setCashValid(false);
    }

    // Clear user input.
    setAmount('');
  }
  
  return (
    <div className={styles.startingBalanceWrapper}>
      <h4 className={styles.startingBalanceTitle}>STARTING BALANCE</h4>
      <div className={styles.cashAmountInput}>
        <label htmlFor="cash-input" className={styles.cashAmountLabel}>Cash amount in dollars: </label><br/>
        <input id="cash-input" value={amount} type="text" 
          placeholder={cashValid ? "00.00" : "Invalid cash amount."} 
          onChange={(event) => {
            setAmount(event.target.value);
            setCashValid(true);
          }}/>
      </div>
      <button onClick={() => submitFunc()}>SUBMIT</button>
    </div>
  )
}