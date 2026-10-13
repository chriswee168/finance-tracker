import { useEffect, useRef } from "react";
import { createEntryGetURL } from "../../transaction-history/transaction-history-helper-funcs";
import { REQUEST_URLS } from "../../utils/api/apiConfig";
import { MAX_CASH_AMOUNT_ENTRIES } from "../../utils/constants";
import CashAmountChart from "../cash-amount-chart/cash-amount-charts";

/**
 * Chart wrapper component to contain the charts for net income and balances.
 * 
 * @param {Object} param0 
 * @param {Object[]} param0.cashAmountEntries List of {timestamp, net_income_cents, current_balance_cents}.
 * @param {Dispatch<SetStateAction<Object[]>>} param0.setCashAmountEntries Cash amount entries setter.
 * 
 * @returns Chart wrapper component.
 */
export default function ChartWrapper({cashAmountEntries, setCashAmountEntries})
{
  const url = useRef(null);
  if (url.current == null)
  {
    url.current = createEntryGetURL(MAX_CASH_AMOUNT_ENTRIES, REQUEST_URLS.CASH_AMOUNTS);
  }

  // Retrieve the latest N cash amounts (net income and current balance) and timestamps.
  useEffect(() => {
    fetch(url.current)
      .then(response => response.json())
      .then(data => setCashAmountEntries(data))
      .catch(
        error => console.log(error)
      );
  }, [setCashAmountEntries]);

  return (
    <>
      <div style={{bottom: "12%", position: "relative"}}>
        <CashAmountChart chartTitle="NET INCOME" 
          epochSecList={cashAmountEntries.map(entry => entry.timestamp)} 
          cashAmountList={cashAmountEntries.map(entry => entry.net_income_cents)}
        />
      </div>
      <div style={{bottom: "11%", position: "relative"}}>
        <CashAmountChart chartTitle="BALANCE" 
          epochSecList={cashAmountEntries.map(entry => entry.timestamp)} 
          cashAmountList={cashAmountEntries.map(entry => entry.current_balance_cents)}
        />
      </div>
    </>
  )
}