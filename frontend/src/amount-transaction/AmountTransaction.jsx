import { useState } from "react";
import { SIGN_COLOURS } from "../constants";
import AmountBox from "./amount-box/amount-box";
import TransactionBox from "./transaction-box/transaction-box";

export default function AmountTransaction()
{

  // Net income and net balance states.
  const [netIncomeStates, setNetIncomeStates] = useState({amountDollars: '0.0', sign: '', colour: SIGN_COLOURS.green});
  const [netBalanceStates, setNetBalanceStates] = useState({amountDollars: '0.0', sign: '', colour: SIGN_COLOURS.green});

  // Transaction type state. (0 = income, 1 = expense).
  const [transactionType, setTransactionType] = useState(0);

  // Cash amount and transaction description states.
  const [cashAmount, setAmount] = useState('');
  const [transactionDesc, setTransactionDesc] = useState('');

  // Function for submit button in transaction box to call when clicked.
  const submitFunc = () =>
  {

    // Reset transaction box states.
    setTransactionType(0);
    setAmount('');
    setTransactionDesc('');
  }

  return (
    <>
      <AmountBox textLabel='Net Income' amountDollars={netIncomeStates.amountDollars} 
        sign={netIncomeStates.sign} colour={netIncomeStates.colour}/>
      <AmountBox textLabel='Net Balance' amountDollars={netBalanceStates.amountDollars} 
        sign={netBalanceStates.sign} colour={netBalanceStates.colour}/>
      <TransactionBox 
        transactionType={transactionType}
        setTransactionType={setTransactionType}
        cashAmount={cashAmount} 
        setAmount={setAmount} 
        transactionDesc={transactionDesc}
        setTransactionDesc={setTransactionDesc}
        netIncomeStates={netIncomeStates}
        netBalanceStates={netBalanceStates}
        setNetIncomeStates={setNetIncomeStates}
        setNetBalanceStates={setNetBalanceStates}
        submitFunc={submitFunc}
      />
    </>
  )
}