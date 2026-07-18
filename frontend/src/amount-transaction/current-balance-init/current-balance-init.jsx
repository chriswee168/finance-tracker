import { useState } from "react";
import styles from "./current-balance-init.module.css";

/**
 * Component to prompt the user to set the current balance.
 * 
 * @returns Current balance initialisation component.
*/
export default function CurrentBalanceInit()
{
  const [amount, setAmount] = useState('');

  return (
    <div className={styles.currentBalanceWrapper}>
      <h4 className={styles.currentBalanceTitle}>INITIAL CURRENT BALANCE</h4>
      <div className={styles.cashAmountInput}>
      <label htmlFor="cash-input" className={styles.cashAmountLabel}>Initial current balance amount ($): </label><br/>
      <input id="cash-input" value={amount} type="text" className={styles.cashAmountTextbox} 
        placeholder="00.00" onChange={(event) => setAmount(event.target.value)}/>
      </div>
      <button className={styles.submitButton} 
        onClick={
          () => {
            
          }
        }>
        SUBMIT
      </button>
    </div>
  )
}