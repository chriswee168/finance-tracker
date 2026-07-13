import { useState } from "react";
import { CASH_DP, CASH_SCALE_FACTOR, SIGN_COLOURS } from "../constants";
import AmountBox from "./amount-box/amount-box";
import styles from "./transaction-box.module.css";
import TransactionOptions from "./transaction-options/transaction-options";
import CashAmountInput from "./cash-amount-input/cash-amount-input";
import DescriptionInput from "./description-input/description-input";
import twoNumOp from "../misc-helper-funcs/twoNumOp";

export default function AmountTransaction()
{

  // Net income and net balance states.
  const [netIncomeStates, setNetIncomeStates] = useState({amountDollars: '0.0', sign: '', colour: SIGN_COLOURS.green});
  const [netBalanceStates, setNetBalanceStates] = useState({amountDollars: '0.0', sign: '', colour: SIGN_COLOURS.green});

  // Transaction type state. (0 = income, 1 = expense).
  const [transactionOption, setTransactionOption] = useState(0);

  // Cash amount and transaction description states.
  const [cashAmount, setAmount] = useState('');
  const [transactionDesc, setTransactionDesc] = useState('');

  // Function to export the transaction information to backend.
  const exportTransaction = async (transactionOption, cashAmountCents) =>
  {
    try
    {
      const response = await fetch("http://127.0.0.1:8000/add-transaction", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          type: transactionOption,
          desc: transactionDesc,
          amount_cents: cashAmountCents
        })
      });

      if (!response.ok)
      {
        throw new Error(`${response.status}`);
      }
    }
    catch (error)
    {
      console.log(error);
    }
  }

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

    // Send transaction entry to backend and add to SQL database.
    exportTransaction(transactionOpStr, cashAmountCents);

    // Reset transaction box states.
    setTransactionOption(0);
    setAmount('');
    setTransactionDesc('');
  }
  
  // Add negative sign if sign character is '-'.
  const addNegativeSign = (amountNum, signChar) =>
  {
    if (signChar == '-')
    {
      amountNum = -amountNum;
    }
    return amountNum;
  }

  // Returns the appropriate sign and its colour based on whether
  // amount is below or above zero.
  const getAmountSign = (amount) =>
  {
    let sign, colour;
    if (amount >= 0)
    {
      colour = SIGN_COLOURS.green;
      sign = '+';
    }
    else
    {
      colour = SIGN_COLOURS.red;
      sign = '-';
    }

    return [sign, colour];
  }

  // Function to update the net income and net balance in real time as transactions
  // are entered.
  const updateAmount = (initialAmount, transactionOption, initialSign, setStateFunc) =>
  {
    let initialAmountNum = Number(initialAmount);
    let cashAmountNum = Number(cashAmount);
    initialAmountNum = addNegativeSign(initialAmountNum, initialSign);
    const newAmount = twoNumOp(initialAmountNum, cashAmountNum, transactionOption, CASH_DP);
    let [sign, colour] = getAmountSign(newAmount);
  
    // Remove any negative sign from new amount in string format.
    const newAmountStr = String(newAmount).replace('-','');
    setStateFunc({amountDollars: newAmountStr, sign: sign, colour: colour});
  }

  return (
    <>
      <AmountBox textLabel='Net Income' amountDollars={netIncomeStates.amountDollars} 
        sign={netIncomeStates.sign} colour={netIncomeStates.colour}/>
      <AmountBox textLabel='Net Balance' amountDollars={netBalanceStates.amountDollars} 
        sign={netBalanceStates.sign} colour={netBalanceStates.colour}/>
      
      <div className={styles.transactionBox}>
        <h3 className={styles.transactionBoxTitle}>ENTER TRANSACTION</h3>
      
        <TransactionOptions transactionOption={transactionOption} setTransactionOption={setTransactionOption} />
        <CashAmountInput cashAmount={cashAmount} setAmount={setAmount} />
        <DescriptionInput transactionDesc={transactionDesc} setTransactionDesc={setTransactionDesc} />
      
        <button className={styles.submitButton} 
          onClick={
            () => {
              updateAmount(
                netIncomeStates.amountDollars, transactionOption, 
                netIncomeStates.sign, setNetIncomeStates
              );
              updateAmount(
                netBalanceStates.amountDollars, transactionOption, 
                netBalanceStates.sign, setNetBalanceStates
              );
              submitFunc();
            }
          }>
          SUBMIT TRANSACTION
        </button>
      </div>
    </>
  )
}