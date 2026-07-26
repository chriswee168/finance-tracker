import { useEffect, useState } from "react";
import { CASH_DP, CASH_SCALE_FACTOR, CURRENT_BALANCE_LABEL, NET_INCOME_LABEL, SIGN_COLOURS, TIMESTAMP_INTERVAL_SECS } from "../utils/constants";
import AmountBox from "./amount-box/amount-box";
import styles from "./transaction-box.module.css";
import TransactionOptions from "./transaction-options/transaction-options";
import CashAmountInput from "./cash-amount-input/cash-amount-input";
import DescriptionInput from "./description-input/description-input";
import twoNumOp from "../utils/twoNumOp";
import { REQUEST_URLS } from "../utils/api/apiConfig";
import { apiGetJSON, apiSendJSON } from "../utils/api/apiService";
import getCurrentDatetime from "../utils/getCurrentDatetime";
import { addToHistoryList } from "../transaction-history/transaction-history";
import CurrentBalanceInit from "./current-balance-init/current-balance-init";
import currentEpochSecsExceeded from "../utils/currentEpochSecsExceeded";
import { centsToDollars, dollarsToCents } from "../utils/cashUnitConversion";

/**
 * Wrapper for amount boxes and transaction box that allows state sharing.
 * 
 * @param {Object} param0 
 * @param {JSX.Element[]} param0.entries List of TransactionEntry components.
 * @param {Dispatch<SetStateAction<JSX.Element[]>>} param0.setEntries Setter for entries list.
 *
 * @returns Wrapper component for amount boxes and transaction box.
 */
export default function AmountTransaction({entries, setEntries})
{
  // Net income and current balance states for amount boxes.
  const [netIncomeBox, setNetIncomeBox] = useState(0.0);
  const [currentBalanceBox, setCurrentBalanceBox] = useState(0.0);

  // Transaction type state. (income/expense).
  const [transactionOption, setTransactionOption] = useState("income");

  // Cash amount and transaction description states.
  const [cashAmount, setAmount] = useState('');
  const [transactionDesc, setTransactionDesc] = useState('');

  // Timestamp state for refreshing the net income periodically and saving
  // data.
  const [timestamp, setTimestamp] = useState(0);

  // Function for submit button in transaction box to call when clicked.
  const submitFunc = () =>
  {
    // Cash amount dollars to cents.
    const cashAmountCents = dollarsToCents(cashAmount);

    const datetime = getCurrentDatetime();
    const transactionObj = {
      datetime: getCurrentDatetime(),
      type: transactionOption,
      desc: transactionDesc,
      amount_cents: cashAmountCents
    }
    
    // Send transaction entry to backend and add to SQL database.
    apiSendJSON(REQUEST_URLS.TRANSACTIONS, "POST", transactionObj)
      .then((response) => {
        if (!response.ok)
        {
          if (response.status == 422)
          {
            throw new Error(`Amount less than or equal to zero not allowed. (${cashAmountCents} <= 0)`);
          }
          throw new Error(`HTTP code ${response.status}: ${response.statusText}`);
        }
        // Also send transaction entry to transaction history list.
        addToHistoryList(entries, setEntries, transactionObj);
      })
      .catch(
        (error) => console.log(error)
      );

    // Reset transaction box states.
    setTransactionOption("income");
    setAmount('');
    setTransactionDesc('');
  }

  // Synchronize timestamp.
  let timestampTemp = 0;
  useEffect(() => {
    apiGetJSON(REQUEST_URLS.TIMESTAMP)
      .then(
        (data) => {
          timestampTemp = data.timestamp;
          setTimestamp(timestampTemp)
        }
      );
  }, []);

  // Synchronize net income and current balance amounts from persistent JSON data.
  useEffect(() => {
    apiGetJSON(REQUEST_URLS.CURRENT_AMOUNTS)
      .then(
        (data) => {
          let netIncomeCents = data.net_income_cents;
          
          // Refresh net income if amount of time passed since previous timestamp exceeds the
          // interval in seconds.
          if (currentEpochSecsExceeded(timestampTemp))
          {
            netIncomeCents = 0;
          }

          const netIncomeDollars = centsToDollars(netIncomeCents);
          const currentBalanceDollars = centsToDollars(data.current_balance_cents);

          setNetIncomeBox(netIncomeDollars);
          setCurrentBalanceBox(currentBalanceDollars);
        }
      );
  }, []);

  return (
    <>
      <AmountBox textLabel={NET_INCOME_LABEL} amountDollars={netIncomeBox} />
      <AmountBox textLabel={CURRENT_BALANCE_LABEL} amountDollars={currentBalanceBox} />

      <CurrentBalanceInit 
        netIncome={netIncomeBox}
        currentBalance={currentBalanceBox}
        setCurrentBalance={setCurrentBalanceBox}
      />
            
      <div className={styles.transactionBox}>
        <h3 className={styles.transactionBoxTitle}>ENTER TRANSACTION</h3>

        <TransactionOptions transactionOption={transactionOption} setTransactionOption={setTransactionOption} />
        <CashAmountInput cashAmount={cashAmount} setAmount={setAmount} />
        <DescriptionInput transactionDesc={transactionDesc} setTransactionDesc={setTransactionDesc} />
      
        <button
          onClick={
            () => {
              // Update the epoch timestamp on FastAPI backend and reset net income to zero.
              let tempNetIncomeBox = netIncomeBox;
              if (currentEpochSecsExceeded(timestamp))
              {
                incrementTimestamp(timestamp, setTimestamp);

                // Record the net income and current balance in amount history on FastAPI backend.
                apiSendAmounts(tempNetIncomeBox, currentBalanceBox, "POST", REQUEST_URLS.AMOUNTS_HISTORY);
                tempNetIncomeBox = 0.0;
              }
              
              const transactionAmount = Number(cashAmount);

              // Transaction cash amount must be larger than zero.
              if (transactionAmount > 0)
              {
                // Obtain the new net income and current balance and save to FastAPI backend.
                const newNetIncomeBox = updateAmount(
                  tempNetIncomeBox, transactionAmount,
                  transactionOption, setNetIncomeBox
                );
                const newCurrentBalanceBox = updateAmount(
                  currentBalanceBox, transactionAmount,
                  transactionOption, setCurrentBalanceBox
                );

                apiSendAmounts(newNetIncomeBox, newCurrentBalanceBox, "PUT", REQUEST_URLS.CURRENT_AMOUNTS);
              }
              
              submitFunc();
            }
          }>
          SUBMIT
        </button>
      </div>
    </>
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
 * Increment the timestamp epoch seconds by an interval and save to FastAPI backend.
 * 
 * @param {number} timestamp Current epoch timestamp in seconds.
 * @param {Dispatch<SetStateAction<number>>} setTimestamp Setter for timestamp.
 */
const incrementTimestamp = (timestamp, setTimestamp) =>
{
  const newTimestamp = timestamp + TIMESTAMP_INTERVAL_SECS;
  setTimestamp(newTimestamp);
  apiSendJSON(REQUEST_URLS.TIMESTAMP, "PUT", {secs: newTimestamp});
}

/**
 * Function to send net income and current balance to a request URL.
 * 
 * @param {number} netIncomeDollars Net income in dollars.
 * @param {number} currentBalanceDollars Current balance in dollars.
 * @param {string} httpMethod HTTP method (POST/PUT).
 * @param {string} requestURL URL to send net income and current balance to.
 */
export const apiSendAmounts = (
  netIncomeDollars, 
  currentBalanceDollars,
  httpMethod,
  requestURL
) =>
{
  const netIncomeCents = dollarsToCents(netIncomeDollars);
  const currentBalanceCents = dollarsToCents(currentBalanceDollars);

  apiSendJSON(
    requestURL, 
    httpMethod, 
    {
      net_income_cents: netIncomeCents,
      current_balance_cents: currentBalanceCents
    }
  )
  .then((response) => {
    if (!response.ok)
    {
      throw new Error(`HTTP code ${response.status}: ${response.statusText}`);
    }
  })
  .catch(
    (error) => console.log(error)
  );
}