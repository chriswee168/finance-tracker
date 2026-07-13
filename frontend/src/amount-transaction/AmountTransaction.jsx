import { useState } from "react";
import { CASH_SCALE_FACTOR, SIGN_COLOURS } from "../constants";
import AmountBox from "./amount-box/amount-box";

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

  // Function to export the transaction information to backend.
  const exportTransaction = async (transactionType, cashAmountCents) =>
  {
    try
    {
      const response = await fetch("http://127.0.0.1:8000/add-transaction", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          type: transactionType,
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

  // Function for submit button in transaction box to call when clicked.
  const submitFunc = () =>
  {
    // Cash amount dollars to cents.
    const cashAmountCents = parseInt(cashAmount * CASH_SCALE_FACTOR);

    let transactionStr;
    switch (transactionType)
    {
      case 0:
        transactionStr = "income";
        break;
      case 1:
        transactionStr = "expense";
        break;
    }

    // Send transaction entry to backend and add to SQL database.
    exportTransaction(transactionStr, cashAmountCents);

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
      
    </>
  )
}