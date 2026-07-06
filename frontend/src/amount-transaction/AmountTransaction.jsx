import { useState } from "react";
import { SIGN_COLOURS } from "../constants";
import AmountBox from "./amount-box/amount-box";
import TransactionBox from "./transaction-box/transaction-box";

export default function AmountTransaction()
{
  
  // Cash amount and transaction description states.
  const [cashAmount, setAmount] = useState('');
  const [transactionDesc, setTransactionDesc] = useState('');

  return (
    <>
      <AmountBox textLabel='Net Income' amountDollars='0.0' sign='+' colour={SIGN_COLOURS.green}/>
      <AmountBox textLabel='Net Balance' amountDollars='0.0' sign='-' colour={SIGN_COLOURS.red}/>
      <TransactionBox 
        cashAmount={cashAmount} 
        setAmount={setAmount} 
        transactionDesc={transactionDesc}
        setTransactionDesc={setTransactionDesc}
      />
    </>
  )
}