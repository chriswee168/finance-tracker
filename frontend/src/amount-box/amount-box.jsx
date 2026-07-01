import { useState } from "react";
import styles from "./amount-box.module.css";

/**
 * Create the amount box component to display a cash amount.
 * @param {Object} param0 
 * @param {string} param0.textLabel Text to display above dollar amount.
 * @param {string} param0.amountDollars Amount in dollars.
 * @param {string} param0.sign Positive or negative sign to indicate amount increase or decrease.
 * @param {string} param0.colour Colour of positive/negative sign.
 * 
 * @returns Amount box component.
 */
export default function AmountBox({textLabel, amountDollars, sign, colour})
{
  return (
    <div className={styles.amountBox}>
      <p className={styles.textLabel}>{textLabel}</p>
      <p className={styles.amountDollars}>
        <span style={{color: colour}}>{sign}</span>
        ${amountDollars}
      </p>
    </div>
  )
}