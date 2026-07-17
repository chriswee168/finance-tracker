import { CASH_DP, CASH_SCALE_FACTOR, SIGN_COLOURS } from "../../utils/constants";
import styles from "./transaction-entry.module.css";

/**
 * Create transaction entry component to display details of a 
 * single previous transaction.
 * 
 * @param {Object} param0 
 * @param {string} param0.datetime Date and time of transaction.
 * @param {string} param0.type Transaction type (income/expense)
 * @param {string} param0.amountCents Cash amount in cents.
 * @param {string} param0.desc Transaction description.
 * 
 * @returns Transaction entry component.
 */
export default function TransactionEntry({datetime, type, amountCents, desc})
{
  // Convert cents to dollars and select the appropriate sign and colour.
  // to indicate transaction type.
  const amountDollars = (amountCents / CASH_SCALE_FACTOR).toFixed(CASH_DP);
  let sign, colour;
  switch (type)
  {
    case "income":
      colour = SIGN_COLOURS.green;
      sign = '+';
      break;
    case "expense":
      colour = SIGN_COLOURS.red;
      sign = '-';  
      break;
  }

  if (desc == '')
  {
    desc = 'No description.';
  }

  return (
    <div className={styles.transactionEntry}>
      <div className={styles.amountDollars}>
        <span style={{color: colour}}>{sign}${amountDollars}</span>
      </div>
      <div className={styles.datetime}>{datetime}</div>
      <div className={styles.descWrapper}>
        <div className={styles.desc}>{desc}</div>
      </div>
    </div>
  )
}