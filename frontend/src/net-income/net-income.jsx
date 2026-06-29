import { useState } from "react";
import styles from "./net-income.module.css";

/**
 * Create the net income component.
 * 
 * @returns Net income component.
 */
export default function NetIncome()
{
  const [netIncomeCents, setNetIncomeCents] = useState("0.0");

  return (
    <div className={styles.netIncomeBox}>
      <p>{netIncomeCents}</p>
    </div>
  )
}