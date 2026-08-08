import styles from "./cash-amount-input.module.css";

/**
 * Component for prompting user cash amount in string format.
 * 
 * @param {Object} param0
 * @param {string} param0.cashAmount Cash amount string entered by user.
 * @param {Dispatch<SetStateAction<string>>} param0.setAmount Setter for cash amount string.
 * @param {boolean} param0.valid Boolean for whether cash input is valid.
 * @param {Dispatch<SetStateAction<boolean>>} param0.setValid Setter for valid boolean state.
 * 
 * @returns Cash amount input component.
*/
export default function CashAmountInput({cashAmount, setAmount, valid, setValid})
{
  return (
    <div className={styles.cashAmountInput}>
      <label htmlFor="cash-input" className={styles.cashAmountLabel}>Cash amount in dollars: </label><br/>
      <input id="cash-input" value={cashAmount} type="text"
        placeholder={valid ? "00.00" : "Invalid cash amount."} 
        onChange={(event) => {
          setAmount(event.target.value);
          setValid(true);
        }}/>
    </div>
  )
}