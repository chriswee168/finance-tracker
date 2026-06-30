import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import NetIncome from './net-income/net-income'
import TrendArrowSet from './net-income/trend-arrow-set'
import { TREND_ARROW_COLOURS } from './constants'

/**
 * Create main app component.
 * 
 * @returns Main app component.
 */
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TrendArrowSet 
        upColourState={TREND_ARROW_COLOURS.green} 
        downColourState={TREND_ARROW_COLOURS.red}
      />
      <NetIncome/>
    </>
  )
}

export default App
