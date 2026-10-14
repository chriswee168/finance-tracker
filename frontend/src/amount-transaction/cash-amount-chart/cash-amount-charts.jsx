import { Paper, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { centsToDollars } from "../../utils/cashUnitConversion";
import { CHART_HEIGHT, SIGN_COLOURS } from "../../utils/constants";
import { secsToDate } from "../../utils/secsToDate";
import styles from "./cash-amount-charts.module.css";

/**
 * Chart component to display cash amounts over a period of time.
 * 
 * @param {Object} param0 
 * @param {string} param0.chartTitle Chart title.
 * @param {Object[]} param0.cashAmountEntries List of cash amount entries.
 * @param {string} param0.seriesLabel List of cash amounts.
 * 
 * @returns Chart component.
 */
export default function CashAmountChart({chartTitle, cashAmountEntries, seriesLabel})
{
  return (
    <Paper className={styles.chart}>
      <Typography className={styles.title}>
        {chartTitle}
      </Typography>
      <LineChart
        height={CHART_HEIGHT}
        dataset={cashAmountEntries}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "timestamp",
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
            scaleType: "linear",
            valueFormatter: amount => `$${centsToDollars(amount)}`,
          }
        ]}
        series={[
          {
            color: "grey",
            showMark: true,
            dataKey: seriesLabel,
            valueFormatter: amount => `$${centsToDollars(amount)}`,
            colorGetter: ({value}) => value >= 0 ? SIGN_COLOURS.green : SIGN_COLOURS.red
          }
        ]}
      />
    </Paper>
  )
}