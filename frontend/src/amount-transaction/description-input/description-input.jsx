import styles from "./description-input.module.css";

/**
 * Component for prompting user a description of the transaction.
 * 
 * @param {Object} param0
 * @param {string} param0.transactionDesc Description entered by user.
 * @param {Dispatch<SetStateAction<string>>} param0.setTransactionDesc Setter for description.
 * 
 * @returns Description input component.
*/
export default function DescriptionInput({transactionDesc, setTransactionDesc})
{
  return (
    <div className={styles.descriptionInput}>
      <label htmlFor="desc-input" className={styles.descLabel}>Transaction description: </label>
      <textarea id="desc-input" value={transactionDesc} type="text" className={styles.descTextbox} 
        placeholder="Enter description..." onChange={(event) => setTransactionDesc(event.target.value)}/>
    </div>
  )
}