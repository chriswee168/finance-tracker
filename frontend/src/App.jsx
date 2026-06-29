import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import NetIncome from './net-income/net-income'

/**
 * Create main app component.
 * 
 * @returns Main app component.
 */
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NetIncome/>
    </>
  )
}

export default App
