import { useState } from "react";
import { SIGN_COLOURS } from "../constants";
import AmountBox from "./amount-box/amount-box";
import TransactionBox from "./transaction-box/transaction-box";

export default function AmountTransaction()
{

  // Net income and net balance states.
  const [netIncomeStates, setNetIncomeStates] = useState({amountDollars: '0.0', sign: '', colour: SIGN_COLOURS.green});
  const [netBalanceStates, setNetBalanceStates] = useState({amountDollars: '0.0', sign: '', colour: SIGN_COLOURS.green});

  // Cash amount and transaction description states.
  const [cashAmount, setAmount] = useState('');
  const [transactionDesc, setTransactionDesc] = useState('');

  return (
    <>
      <AmountBox textLabel='Net Income' amountDollars={netIncomeStates.amountDollars} 
        sign={netIncomeStates.sign} colour={netIncomeStates.colour}/>
      <AmountBox textLabel='Net Balance' amountDollars={netBalanceStates.amountDollars} 
        sign={netBalanceStates.sign} colour={netBalanceStates.colour}/>
      <TransactionBox 
        cashAmount={cashAmount} 
        setAmount={setAmount} 
        transactionDesc={transactionDesc}
        setTransactionDesc={setTransactionDesc}
      />
    </>
  )
}