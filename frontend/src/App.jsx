import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import styles from './App.module.css'
import NetIncome from './amount-box/amount-box'
import TrendArrowSet from './amount-box/trend-arrow-set'
import { TREND_ARROW_COLOURS } from './constants'
import AmountBox from './amount-box/amount-box'

/**
 * Create main app component.
 * 
 * @returns Main app component.
 */
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className={styles.appWrapper}>
      <TrendArrowSet 
        upColourState={TREND_ARROW_COLOURS.green} 
        downColourState={TREND_ARROW_COLOURS.red}
      />
      <AmountBox amountDollars='+$0.0'/>
      <AmountBox amountDollars='+$0.0'/>
    </div>
  )
}

export default App
