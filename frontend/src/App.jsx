import { useState } from 'react';
import styles from './App.module.css';
import AmountTransaction from './amount-transaction/amount-transaction';
import './amount-transaction/cash-amount-chart/cash-amount-charts.module.css';
import ChartWrapper from './amount-transaction/chart-wrapper/chart-wrapper';
import ServerStatus from './server-status/server-status';
import TransactionHistory from './transaction-history/transaction-history';
/**
 * Create main app component.
 * 
 * @returns Main app component.
 */
function App() {
  
  // Array to store transaction entry components that include
  // details of previous transactions.
  const [transactionEntries, setTransactionEntries] = useState([]);

  // Used to indicate whether the backend API server is online or offline as well as 
  // to lock the app and block user input when the server is offline.
  const [serverOnline, setServerOnline] = useState(false);

  // Array to store cash amounts along with timestamps for chart display.
  const [cashAmountEntries, setCashAmountEntries] = useState([]);

  return (
    <div className={styles.appWrapper}>
      <ServerStatus serverOnline={serverOnline} setServerOnline={setServerOnline}/>
      <AmountTransaction
        entries={transactionEntries} 
        setEntries={setTransactionEntries}
        serverOnline={serverOnline}
        setServerOnline={setServerOnline}
      />
      <TransactionHistory 
        entries={transactionEntries} 
        setEntries={setTransactionEntries}
      />
      <ChartWrapper 
        cashAmountEntries={cashAmountEntries} 
        setCashAmountEntries={setCashAmountEntries}
      />
    </div>
  )
}

export default App
