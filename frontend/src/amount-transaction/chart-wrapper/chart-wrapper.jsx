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
  
  return (
    <>
      <div style={{bottom: "12%", position: "relative"}}>
        <CashAmountChart chartTitle="NET INCOME" epochSecList={[1791777602, 1791777609, 1791777613]} cashAmountList={[10, 0, 0]}/>
      </div>
      <div style={{bottom: "11%", position: "relative"}}>
        <CashAmountChart chartTitle="BALANCE" epochSecList={[1791777602, 1791777609, 1791777613]} cashAmountList={[10, -10, 2]}/>
      </div>
    </>
  )
}