import { useEffect, useState } from "react";
import { addToHistoryList } from "../transaction-history/transaction-history-helper-funcs";
import { REQUEST_URLS } from "../utils/api/apiConfig";
import { apiSendJSON } from "../utils/api/apiService";
import { centsToDollars, dollarsToCents } from "../utils/cashUnitConversion";
import { CURRENT_BALANCE_LABEL, NET_INCOME_LABEL } from "../utils/constants";
import AmountBox from "./amount-box/amount-box";
import CashAmountInput from "./cash-amount-input/cash-amount-input";
import DescriptionInput from "./description-input/description-input";
import StartingBalance from "./starting-balance/starting-balance";
import styles from "./transaction-box.module.css";
import TransactionOptions from "./transaction-options/transaction-options";

/**
 * Wrapper for amount boxes and transaction box that allows state sharing.
 * 
 * @param {Object} param0 
 * @param {JSX.Element[]} param0.entries List of TransactionEntry components.
 * @param {Dispatch<SetStateAction<JSX.Element[]>>} param0.setEntries Setter for entries list.
 * @param {bool} param0.serverOnline Boolean to indicate if the backend API server is online or offline.
 * @param {Dispatch<SetStateAction<bool>>} param0.setServerOnline Setter for serverOnline state.
 *
 * @returns Wrapper component for amount boxes and transaction box.
 */
export default function AmountTransaction({entries, setEntries, serverOnline, setServerOnline})
{
  // Net income and current balance states for amount boxes.
  const [netIncomeBox, setNetIncomeBox] = useState(0.0);
  const [currentBalanceBox, setCurrentBalanceBox] = useState(0.0);

  // Transaction type state. (income/expense).
  const [transactionOption, setTransactionOption] = useState("income");

  // Cash amount and transaction description states.
  const [cashAmount, setAmount] = useState('');
  const [transactionDesc, setTransactionDesc] = useState('');
  // Used to control what placeholder text should be displayed for cash input box.
  const [cashValid, setCashValid] = useState(true);

  // String displaying the next point in time net income will be reset for next period.
  const [nextResetTime, setNextResetTime] = useState('NULL DATE');

  // Function for submit button in transaction box to call when clicked.
  const submitFunc = () =>
  {
    try
    {
      let cashAmountNum = Number(cashAmount);
      if (isNaN(cashAmountNum))
      {
        throw new TypeError("Invalid cash amount.");
      }

      // Cash amount dollars to cents.
      const cashAmountCents = dollarsToCents(cashAmountNum);

      const transactionObj = {
        type: transactionOption,
        desc: transactionDesc,
        amount_cents: cashAmountCents
      }
      
      // Send transaction entry to backend and add to SQL database.
      apiSendJSON(REQUEST_URLS.TRANSACTIONS, "POST", transactionObj)
        .then(async (response) => {
          if (!response.ok)
          {
            if (response.status == 422)
            {
              throw new RangeError(`Amount less than or equal to zero not allowed. (${cashAmountCents} <= 0)`);
            }
            throw new Error(`HTTP code ${response.status}: ${response.statusText}`);
          }
          else
          {
            const data = await response.json();

            // Send transaction entry to transaction history list.
            addToHistoryList(entries, setEntries, 
              {"entry_id": data.entry_id, "datetime": data.entry_datetime, ...transactionObj}
            );

            // Set the new net income and current balance amounts returned from backend server.
            const net_income_dollars = centsToDollars(data.net_income_cents);
            const current_balance_dollars = centsToDollars(data.current_balance_cents);
            setNetIncomeBox(net_income_dollars);
            setCurrentBalanceBox(current_balance_dollars);
          }
        })
        .catch((error) => {
          if (error instanceof TypeError)
          {
            setServerOnline(false);
          }
          else if (error instanceof RangeError)
          {
            setCashValid(false);
          }
          console.log(error);

        });
    }
    catch (error)
    {
      if (error instanceof TypeError)
      {
        setCashValid(false);
      }
      console.log(error);
    }

    // Reset transaction box states.
    setTransactionOption("income");
    setAmount('');
    setTransactionDesc('');
  }

  // Synchronize timestamp.
  useEffect(() => {
    fetch(REQUEST_URLS.TIMESTAMP, {method: "POST"})
      .then(response => response.json())
      .then(
        (data) => { setNextResetTime(secsToDate(data.timestamp)); }
      )
      .catch(
        error => console.log(error)
      );
  }, []);

  // Synchronize net income and current balance amounts from latest entry in the amount_history_table SQL
  // table from the backend server.
  useEffect(() => {
    fetch(REQUEST_URLS.LATEST_AMOUNTS)
      .then(response => response.json())
      .then(
        (data) => {
          let netIncomeDollars = centsToDollars(data.net_income_cents);
          const currentBalanceDollars = centsToDollars(data.current_balance_cents);
          setNetIncomeBox(netIncomeDollars);
          setCurrentBalanceBox(currentBalanceDollars);
        }
      ).catch(
        error => console.log(error)
      );
  }, []);

  return (
    <div className={serverOnline ? styles.serverOnline : styles.serverOffline}>
      <AmountBox textLabel={`${NET_INCOME_LABEL} (Resets next ${nextResetTime})`} amountDollars={netIncomeBox} />
      <AmountBox textLabel={CURRENT_BALANCE_LABEL} amountDollars={currentBalanceBox} />

      <StartingBalance 
        netIncome={netIncomeBox} 
        setCurrentBalance={setCurrentBalanceBox} 
        setServerOnline={setServerOnline}
      />
            
      <div className={styles.transactionBox}>
        <h3 className={styles.transactionBoxTitle}>ENTER TRANSACTION</h3>

        <TransactionOptions transactionOption={transactionOption} setTransactionOption={setTransactionOption} />
        <CashAmountInput cashAmount={cashAmount} setAmount={setAmount} valid={cashValid} setValid={setCashValid}/>
        <DescriptionInput transactionDesc={transactionDesc} setTransactionDesc={setTransactionDesc} />
      
        <button onClick={() => submitFunc()}>SUBMIT</button>
      </div>
    </div>
  )
}

/**
 * Function to update the net income and current balance in real time as transactions
 * are entered.
 * 
 * @param {number} initialAmount Initial cash amount.
 * @param {number} transactionAmount Transaction cash amount.
 * @param {string} transactionOption Transaction option (income/expense).
 * @param {Dispatch<SetStateAction<number>>} setStateFunc Setter for cash amount state.
 * 
 * @returns New cash amount number.
 */
const updateAmount = (initialAmount, transactionAmount, transactionOption, setStateFunc) =>
{
  const newAmount = twoNumOp(initialAmount, transactionAmount, transactionOption, CASH_DP);
  setStateFunc(newAmount);
  return newAmount;
}

/**
 * Get the day and time in the future when net income will reset for the next period.
 * 
 * @param {number} timestamp Epoch time in seconds.
 * 
 * @returns Day and time as string.
 */
const secsToDate = (timestamp) =>
{
  const date = new Date(Math.round(timestamp * 1000));
  const day = date.toLocaleDateString("en-AU", { weekday: "short" });
  const time = date.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return `${day} ${time}`;
}