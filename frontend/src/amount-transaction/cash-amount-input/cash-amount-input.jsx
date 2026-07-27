import styles from "./cash-amount-input.module.css";

/**
 * Component for prompting user cash amount in string format.
 * 
 * @param {Object} param0
 * @param {string} param0.cashAmount Cash amount string entered by user.
 * @param {Dispatch<SetStateAction<string>>} param0.setAmount Setter for cash amount string.
 * 
 * @returns Cash amount input component.
*/
export default function CashAmountInput({cashAmount, setAmount})
{
  return (
    <div className={styles.cashAmountInput}>
      <label htmlFor="cash-input" className={styles.cashAmountLabel}>Cash amount in dollars: </label><br/>
      <input id="cash-input" value={cashAmount} type="number"
        placeholder="00.00" onChange={(event) => setAmount(event.target.value)}/>
    </div>
  )
}