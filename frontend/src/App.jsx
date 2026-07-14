import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import styles from './App.module.css'
import NetIncome from './amount-transaction/amount-box/amount-box'
import TrendArrowSet from './amount-transaction/amount-box/trend-arrow-set'
import { SIGN_COLOURS, TREND_ARROW_COLOURS } from './constants'
import AmountBox from './amount-transaction/amount-box/amount-box'
import AmountTransaction from './amount-transaction/AmountTransaction'
import TransactionHistory from './transaction-history/transaction-history'

/**
 * Create main app component.
 * 
 * @returns Main app component.
 */
function App() {
  
  return (
    <div className={styles.appWrapper}>
      <AmountTransaction />
      <TransactionHistory />
    </div>
  )
}

export default App
