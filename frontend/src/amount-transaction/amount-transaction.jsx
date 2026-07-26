import { useEffect, useState } from "react";
import { CASH_DP, CASH_SCALE_FACTOR, SIGN_COLOURS, TIMESTAMP_INTERVAL_SECS } from "../utils/constants";
import AmountBox from "./amount-box/amount-box";
import styles from "./transaction-box.module.css";
import TransactionOptions from "./transaction-options/transaction-options";
import CashAmountInput from "./cash-amount-input/cash-amount-input";
import DescriptionInput from "./description-input/description-input";
import twoNumOp from "../utils/twoNumOp";
import { URL_PATHS } from "../utils/api/apiConfig";
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

  // Transaction type state. (0 = income, 1 = expense).
  const [transactionOption, setTransactionOption] = useState(0);

  // Cash amount and transaction description states.
  const [cashAmount, setAmount] = useState('');
  const [transactionDesc, setTransactionDesc] = useState('');

  // Timestamp state for refreshing the net income periodically and saving
  // data.
  const [timestamp, setTimestamp] = useState(0);

  // Function to convert string of transaction option (0 = income, 1 = expense).
  const intToStrOp = transactionOpInt =>
  {
    let transactionOpStr;
    switch (transactionOpInt)
    {
      case 0:
        transactionOpStr = "income";
        break;
      case 1:
        transactionOpStr = "expense";
        break;
    }

    return transactionOpStr;
  }

  // Function for submit button in transaction box to call when clicked.
  const submitFunc = () =>
  {
    // Cash amount dollars to cents.
    const cashAmountCents = dollarsToCents(cashAmount);
    const transactionOpStr = intToStrOp(transactionOption);

    const datetime = getCurrentDatetime();
    const transactionObj = {
      datetime: getCurrentDatetime(),
      type: transactionOpStr,
      desc: transactionDesc,
      amount_cents: cashAmountCents
    }
    
    // Send transaction entry to backend and add to SQL database.
    apiSendJSON(URL_PATHS.TRANSACTIONS, "POST", transactionObj);

    // Also send transaction entry to transaction history list.
    addToHistoryList(entries, setEntries, transactionObj);

    // Reset transaction box states.
    setTransactionOption(0);
    setAmount('');
    setTransactionDesc('');
  }

  // Returns the appropriate sign and its colour based on whether
  // amount is below or above zero.
  const getAmountSign = (amount) =>
  {
    let sign, colour;
    if (amount > 0)
    {
      colour = SIGN_COLOURS.green;
      sign = '+';
    }
    else if (amount < 0)
    {
      colour = SIGN_COLOURS.red;
      sign = '-';
    }
    else
    {
      colour = SIGN_COLOURS.black;
      sign = '';
    }

    return [sign, colour];
  }

  // Synchronize timestamp.
  let timestampTemp = 0;
  useEffect(() => {
    apiGetJSON(URL_PATHS.TIMESTAMP)
      .then(
        (data) => {
          timestampTemp = data.timestamp;
          setTimestamp(timestampTemp)
        }
      );
  }, []);

  // Synchronize net income and current balance amounts from persistent JSON data.
  useEffect(() => {
    apiGetJSON(URL_PATHS.CURRENT_AMOUNTS)
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
      <AmountBox textLabel='Net Income' amountDollars={netIncomeBox} />
      <AmountBox textLabel='Current Balance' amountDollars={currentBalanceBox} />

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
                recordAmounts(tempNetIncomeBox, currentBalanceBox);
                tempNetIncomeBox = 0.0;
              }
              
              const transactionAmount = Number(cashAmount);

              // Obtain the new net income and current balance and save to FastAPI backend.
              const newNetIncomeBox = updateAmount(
                tempNetIncomeBox, transactionAmount,
                transactionOption, setNetIncomeBox
              );
              const newCurrentBalanceBox = updateAmount(
                currentBalanceBox, transactionAmount,
                transactionOption, setCurrentBalanceBox
              );

              saveCurrentAmounts(newNetIncomeBox, newCurrentBalanceBox);
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
 * @param {number} transactionOption Transaction option (0 = income, 1 = expense)
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
 * Function to save current net income and current balance to JSON.
 * 
 * @param {number} netIncomeDollars Net income in dollars.
 * @param {number} currentBalanceDollars Current balance in dollars.
 */
export const saveCurrentAmounts = async (netIncomeDollars, currentBalanceDollars) =>
{
  const netIncomeCents = dollarsToCents(netIncomeDollars);
  const currentBalanceCents = dollarsToCents(currentBalanceDollars);

  apiSendJSON(
    URL_PATHS.CURRENT_AMOUNTS, 
    "PUT", 
    {
      net_income_cents: netIncomeCents,
      current_balance_cents: currentBalanceCents
    }
  )
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
  apiSendJSON(URL_PATHS.TIMESTAMP, "PUT", {secs: newTimestamp});
}

/**
 * Record the current balance and net income to amount history SQL table
 * on FastAPI backend.
 * 
 * @param {string} netIncome Net income string in dollars.
 * @param {string} currentBalance Current balance string in dollars.
 */
const recordAmounts = (netIncomeDollars, currentBalanceDollars) =>
{
  const netIncomeCents = dollarsToCents(netIncomeDollars);
  const currentBalanceCents = dollarsToCents(currentBalanceDollars);

  apiSendJSON(
    URL_PATHS.AMOUNTS_HISTORY, 
    "POST", 
    {
      net_income_cents: netIncomeCents,
      current_balance_cents: currentBalanceCents
    }
  );
}