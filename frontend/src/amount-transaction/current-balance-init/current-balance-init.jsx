import { useState } from "react";
import styles from "./current-balance-init.module.css";
import { SIGN_COLOURS } from "../../utils/constants";
import { addNegativeSign, saveCurrentAmounts } from "../AmountTransaction";

/**
 * Component to prompt the user to set the current balance.
 * 
 * @param {Object} param0 
 * @param {Object} param0.netIncomeStates State of net income.
 * @param {Object} param0.currentBalanceStates State of current balance.
 * @param {Dispatch<SetStateAction<Object>>} param0.setCurrentBalanceStates Setter for current balance.
 * 
 * @returns Current balance initialisation component.
*/
export default function CurrentBalanceInit({
  netIncomeStates,
  currentBalanceStates,
  setCurrentBalanceStates
})
{
  const [amount, setAmount] = useState('');

  // Main function to execute when submit function pressed.
  const submitFunc = () =>
  {
    // Set the initial current balance.
    setCurrentBalanceStates({
      amountDollars: amount, sign: '+', colour: SIGN_COLOURS.green
    });

    // Get net income as a numerical amount with negative sign if required
    // to send with current balance.
    const netIncomeNum = addNegativeSign(
      netIncomeStates.amountDollars, netIncomeStates.sign
    );

    // Send initial current balance to FastAPI backend along with
    // existing net income.
    saveCurrentAmounts(String(netIncomeNum), amount);
    
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