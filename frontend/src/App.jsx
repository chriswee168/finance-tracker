import { useState } from 'react'
import styles from './App.module.css'
import AmountTransaction from './amount-transaction/amount-transaction'
import TransactionHistory from './transaction-history/transaction-history'

/**
 * Create main app component.
 * 
 * @returns Main app component.
 */
function App() {
  
  // Array to store transaction entry components that include
  // details of previous transactions.
  const [transactionEntries, setTransactionEntries] = useState([]);

  return (
    <div className={styles.appWrapper}>
      <AmountTransaction
        entries={transactionEntries} 
        setEntries={setTransactionEntries}
      />
      <TransactionHistory 
        entries={transactionEntries} 
        setEntries={setTransactionEntries}
      />
    </div>
  )
}

export default App
