import { Paper, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { centsToDollars } from "../../utils/cashUnitConversion";
import { CHART_HEIGHT, SIGN_COLOURS } from "../../utils/constants";
import { secsToDate } from "../../utils/secsToDate";
import styles from "./cash-amount-charts.module.css";

/**
 * Chart component to display cash amounts over a period of time.
 * 
 * @param {Object} param0 
 * @param {string} param0.chartTitle Chart title.
 * @param {string[]} param0.epochSecList List of epoch seconds.
 * @param {number[]} param0.cashAmountList List of cash amounts.
 * 
 * @returns Chart component.
 */
export default function CashAmountChart({chartTitle, epochSecList, cashAmountList})
{
  return (
    <Paper className={styles.chart}>
      <Typography className={styles.title}>
        {chartTitle}
      </Typography>
      <BarChart
        height={CHART_HEIGHT}
        xAxis={[
          {
            data: epochSecList,
            valueFormatter: epoch => secsToDate(epoch),
            height: 40,
            tickLabelStyle: {
              angle: 13,
              textAnchor: 'start',
            },
          }
        ]}
        yAxis={[
          {
            valueFormatter: amount => `$${centsToDollars(amount)}`,
          }
        ]}
        series={[
          {
            data: cashAmountList,
            valueFormatter: amount => `$${centsToDollars(amount)}`,
            colorGetter: ({value}) => value >= 0 ? SIGN_COLOURS.green : SIGN_COLOURS.red
          }
        ]}
      />
    </Paper>
  )
}