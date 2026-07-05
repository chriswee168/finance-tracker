import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import styles from './App.module.css'
import NetIncome from './amount-transaction/amount-box/amount-box'
import TrendArrowSet from './amount-transaction/amount-box/trend-arrow-set'
import { SIGN_COLOURS, TREND_ARROW_COLOURS } from './constants'
import AmountBox from './amount-transaction/amount-box/amount-box'
import TransactionBox from './amount-transaction/transaction-box/transaction-box'

/**
 * Create main app component.
 * 
 * @returns Main app component.
 */
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className={styles.appWrapper}>
      <AmountBox textLabel='Net Income' amountDollars='0.0' sign='+' colour={SIGN_COLOURS.green}/>
      <AmountBox textLabel='Net Balance' amountDollars='0.0' sign='-' colour={SIGN_COLOURS.red}/>
      <TransactionBox />
    </div>
  )
}

export default App
