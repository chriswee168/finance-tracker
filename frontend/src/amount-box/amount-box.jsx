import { useState } from "react";
import styles from "./amount-box.module.css";

/**
 * Create the amount box component to display a cash amount.
 * @param {Object} param0 
 * @param {string} param0.amountDollars Amount in cents.
 * 
 * @returns Amount box component.
 */
export default function AmountBox({amountDollars})
{
  return (
    <div className={styles.amountBox}>
      <p>{amountDollars}</p>
    </div>
  )
}