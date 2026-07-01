import { useState } from "react";
import styles from "./amount-box.module.css";

/**
 * Create the amount box component to display a cash amount.
 * @param {Object} param0 
 * @param {string} param0.textLabel Text to display above dollar amount.
 * @param {string} param0.amountDollars Amount in dollars.
 * 
 * @returns Amount box component.
 */
export default function AmountBox({textLabel, amountDollars})
{
  return (
    <div className={styles.amountBox}>
      <p className={styles.textLabel}>{textLabel}</p>
      <p className={styles.amountDollars}>{amountDollars}</p>
    </div>
  )
}