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

  // Net income and current balance states.
  const [netIncomeStates, setNetIncomeStates] = 
    useState({amountDollars: '0.00', sign: '', colour: SIGN_COLOURS.green});
  const [currentBalanceStates, setCurrentBalanceStates] = 
    useState({amountDollars: '0.00', sign: '', colour: SIGN_COLOURS.green});

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
    const cashAmountCents = parseInt(cashAmount * CASH_SCALE_FACTOR);
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

  // Set the amount state directly whether positive or negative.
  const setAmountState = (amount, setStateFunc) =>
  {
    let [sign, colour] = getAmountSign(amount);
    // Remove any negative sign from amount in string format.
    const amountStr = String(amount).replace('-','');
    setStateFunc({amountDollars: amountStr, sign: sign, colour: colour});
  }

  // Function to update the net income and current balance in real time as transactions
  // are entered.
  const updateAmount = (initialAmount, transactionOption, initialSign, setStateFunc) =>
  {
    let initialAmountNum = Number(initialAmount);
    let cashAmountNum = Number(cashAmount);
    initialAmountNum = addNegativeSign(initialAmountNum, initialSign);
    const newAmount = twoNumOp(initialAmountNum, cashAmountNum, transactionOption, CASH_DP);
    setAmountState(newAmount, setStateFunc);
    return newAmount;
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
          let netIncomeDollars = (data.net_income_cents / CASH_SCALE_FACTOR).toFixed(CASH_DP);
          const currentBalanceDollars = (data.current_balance_cents / CASH_SCALE_FACTOR).toFixed(CASH_DP);
          
          // Refresh net income if amount of time passed since previous timestamp exceeds the
          // interval in seconds.
          const [currentEpoch, exceeded] = currentEpochSecsExceeded(timestampTemp);
          if (exceeded)
          {
            netIncomeDollars = '0.00';
          }

          setAmountState(netIncomeDollars, setNetIncomeStates);
          setAmountState(currentBalanceDollars, setCurrentBalanceStates);
        }
      );
  }, []);

  return (
    <>
      <AmountBox textLabel='Net Income' amountDollars={netIncomeStates.amountDollars} 
        sign={netIncomeStates.sign} colour={netIncomeStates.colour}/>
      <AmountBox textLabel='Current Balance' amountDollars={currentBalanceStates.amountDollars} 
        sign={currentBalanceStates.sign} colour={currentBalanceStates.colour}/>

      <CurrentBalanceInit 
        netIncomeStates={netIncomeStates} 
        currentBalanceStates={currentBalanceStates}
        setCurrentBalanceStates={setCurrentBalanceStates}
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
              const [currentEpoch, exceeded] = currentEpochSecsExceeded(timestamp);
              let netIncomeAmount = netIncomeStates.amountDollars;
              if (exceeded)
              {
                incrementTimestamp(timestamp, setTimestamp);
                netIncomeAmount = 0.0;
              }
              
              // Obtain the new net income and current balance and save to FastAPI backend.
              const newNetIncome = updateAmount(
                netIncomeAmount, transactionOption, 
                netIncomeStates.sign, setNetIncomeStates
              );
              const newCurrentBalance = updateAmount(
                currentBalanceStates.amountDollars, transactionOption, 
                currentBalanceStates.sign, setCurrentBalanceStates
              );
              saveCurrentAmounts(newNetIncome, newCurrentBalance);
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
 * Add negative sign if sign character is '-'.
 * 
 * @param {number} amountNum Cash amount as number type.
 * @param {string} signChar Sign character.
 * 
 * @returns New cash amount number.
 */
export const addNegativeSign = (amountNum, signChar) =>
{
  if (signChar == '-')
  {
    amountNum = -amountNum;
  }
  return amountNum;
}

/**
 * Function to save current net income and current balance to JSON.
 * 
 * @param {string} netIncomeDollars Net income dollars in string format.
 * @param {string} currentBalanceDollars Current balance dollars in string format.
 */
export const saveCurrentAmounts = async (netIncomeDollars, currentBalanceDollars) =>
{
  const netIncomeCents = parseInt(netIncomeDollars * CASH_SCALE_FACTOR);
  const currentBalanceCents = parseInt(currentBalanceDollars * CASH_SCALE_FACTOR);

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