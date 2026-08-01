import { getColourSignAmount } from "../../utils/getColourSign";
import styles from "./amount-box.module.css";

/**
 * Create the amount box component to display a cash amount.
 * @param {Object} param0 
 * @param {string} param0.textLabel Text to display above cash amount.
 * @param {number} param0.amountDollars Amount in dollars.
 * 
 * @returns Amount box component.
 */
export default function AmountBox({textLabel, amountDollars})
{
  // Use the appropriate sign and colour.
  const [colour, sign] = getColourSignAmount(amountDollars);
  const amountDollarsAbs = Math.abs(amountDollars);
  return (
    <div className={styles.amountBox}>
      <p className={styles.textLabel}>{textLabel}</p>
      <p className={styles.amountDollars}>
        <span style={{color: colour}}>{sign}</span>${amountDollarsAbs}
      </p>
    </div>
  )
}