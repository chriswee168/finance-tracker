import { useState } from "react";
import styles from "./current-balance-init.module.css";
import { SIGN_COLOURS } from "../../utils/constants";

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
    // Set the current balance with amount given by user.
    setCurrentBalanceStates({
      amountDollars: amount, sign: '+', colour: SIGN_COLOURS.green
    });

    
    
    // Clear user input.
    setAmount('');
  }
  
  return (
    <div className={styles.currentBalanceWrapper}>
      <h4 className={styles.currentBalanceTitle}>INITIAL CURRENT BALANCE</h4>
      <div className={styles.cashAmountInput}>
      <label htmlFor="cash-input" className={styles.cashAmountLabel}>Initial current balance amount ($): </label><br/>
      <input id="cash-input" value={amount} type="text" 
        placeholder="00.00" onChange={(event) => setAmount(event.target.value)}/>
      </div>
      <button onClick={() => submitFunc()}>SUBMIT</button>
    </div>
  )
}