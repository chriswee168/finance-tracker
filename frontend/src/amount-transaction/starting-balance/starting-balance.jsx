import { useState } from "react";
import { REQUEST_URLS } from "../../utils/api/apiConfig";
import { apiSendJSON } from "../../utils/api/apiService";
import { centsToDollars, dollarsToCents } from "../../utils/cashUnitConversion";
import styles from "./starting-balance.module.css";

/**
 * Component to prompt the user to set the starting balance.
 * 
 * @param {Object} param0 
 * @param {number} param0.netIncome Net income state in dollars.
 * @param {Dispatch<SetStateAction<number>>} param0.setCurrentBalance Setter for current balance state.
 * @param {Dispatch<SetStateAction<bool>>} param0.setServerOnline Setter for serverOnline state.
 * 
 * @returns Starting balance component.
*/
export default function StartingBalance({
  netIncome,
  setCurrentBalance,
  setServerOnline
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

      const netIncomeCents = dollarsToCents(netIncome);
      const currentBalanceCents = dollarsToCents(amountNum);
      
      // Pass net income and current balance as cents to backend.
      apiSendJSON(
        REQUEST_URLS.LATEST_AMOUNTS, 
        "PUT", 
        {
          net_income_cents: netIncomeCents,
          current_balance_cents: currentBalanceCents
        }
      )
      .then((response) => {
        if (!response.ok)
        {
          throw new Error(`HTTP code ${response.status}: ${response.statusText}`);
        }
        return response.json()
      })
      .then((data) => {
        setCurrentBalance(centsToDollars(data.current_balance_cents)); // Set new current balance.
      })
      .catch(
        (error) => {
          setServerOnline(false); // Lock the UI if server does not return HTTP OK.
          console.log(error)
        }
      );
    }
    catch (error)
    {
      console.log(error);
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