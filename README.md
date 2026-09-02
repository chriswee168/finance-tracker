# Full Stack Personal Finance Ledger App

A full stack desktop web app built using React, FastAPI and SQLite3 for manually tracking personal income and expenses, current balance and net income on a weekly basis.

### Live Demo Deployment On Render (Platform as a Service) 

A live demo for this app is hosted on Render for direct access online. Render links for user interface and API service is provided below:
- **Static site for user interface**: https://finance-tracker-ui-syk4.onrender.com/
- **Web service for API**: https://finance-tracker-fastapi-1j8h.onrender.com/

***Important Notes:***
- Live demo is hosted using Render's free tier. Web service for API may take up to around 30 seconds or more to spin up for full app functionality, indicated by server status.
- Refresh webpage if left inactive for at least 15 minutes to spin up web service.
- Live demo is not intended for personal use and unsuitable for long term data persistence.

Instructions on how to use the app is provided under [Usage](#usage) starting from step 2.

### Table Of Contents
1. [Requirements](#requirements)
2. [Installation and Setup](#installation-and-setup)
3. [Usage](#usage)
4. [Technical Details](#technical-details)
    - [FastAPI Endpoints](#fastapi-endpoints)
    - [SQLite3 Database Tables](#sqlite3-database-tables)
    - [React Frontend](#react-frontend)

## Requirements

### Runtimes

- **Node.js** *(v25.9.0 or higher)*: Runtime for frontend stack.
- **Python** *(v3.11.0 or higher)*: Runtime for backend stack.

### Frontend Stack (React)

- **React (JavaScript)**: JavaScript library for building web based user interfaces using JSX components (Javascript combined with HTML).
- **Vite**: Build tool for local development of the React frontend.

### Backend Stack (FastAPI/SQLite3)

- **FastAPI**: Python web framework for building API endpoints.
- **Uvicorn**: ASGI web server for hosting FastAPI.
- **SQLite3**: Database engine for working with SQL tables locally.
- **Pydantic**: Python library used for data validation of HTTP requests received from React frontend.

## Installation and Setup

#### 1. Open terminal in project directory and install Python libraries and start FastAPI:

For Windows OS 11:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
fastapi run main.py
```

For Linux and Mac OS:
```bash
cd backend
python -m venv venv
./venv/Scripts/activate
pip install -r requirements.txt
fastapi run main.py
```

#### 2. Open a second terminal in project directory to install all packages and build React production preview:
For Windows 11, Linux and Mac OS:
```
cd frontend
npm install
npm audit fix
npm run build
npm run preview
```

## Usage

1. Navigate to http://localhost:4173 using a web browser (e.g. Google Chrome, Edge, Firefox) to display the UI.
2. Enter starting balance using the **STARTING BALANCE** widget when using the app for the first time. This amount will be displayed under *Current Balance* as shown in the image above. 
3. Use the **ENTER TRANSACTION** widget to manually record any income and expenses. Net income and current balance is updated every time new transactions are added. Previous transactions and their details are displayed in **TRANSACTION HISTORY**.

(App after submitting a few example transactions.)
![Usage example.](assets/images/usage_example.png "UI with example transactions.")

## Technical Details

### SQLite3 Database Tables

- This app uses two SQL tables to record the current balance, net income and transactions as they're submitted by user.
    - `amount_history_table` records the current balance and net income periodically. (New entry added every week by default.)
    - `transaction_table` records every transaction submitted by user and used for displaying transaction history on frontend.
- Cash amount are saved as cents to prevent floating point rounding errors.
- Details for `amount_history_table` and `transaction_table` are provided below. 

#### amount_history_table
| Field name | Type | Description |
| --- | --- | --- |
| entry_id | INTEGER | Unique ID for entries. (automatically generated during insertion) |
| entry_datetime | TEXT | Date and time of when entry was added. |
| net_income_cents | INTEGER | Net income recorded at date and time. |
| current_balance_cents | INTEGER | Current balance recorded at date and time. |

#### transaction_table
| Field name | Type | Description |
| --- | --- | --- |
| entry_id | INTEGER | Unique ID for entries. (automatically generated during insertion) |
| entry_datetime | TEXT | Date and time of when entry was added. |
| transaction_type | VARCHAR(7) | Indicates if cash is earned or loss. (either "income" or "expense") |
| transaction_desc | TEXT | Text description entered by user. |
| amount_cents | INTEGER | Transaction cash amount in cents. |
| amount_history_id | INTEGER (FOREIGN KEY) | References entry in amount_history_table the transaction is linked to. |

### FastAPI Endpoints

FastAPI is used to expose API endpoints for the frontend to interact with the local SQL database. All API endpoints are listed below with their name, HTTP method and purpose:

| API Endpoint | Method | Purpose |
| --- | --- | --- |
| /latest-cash-amounts | PUT | Update net income and current balance in latest amount_history_table entry. |
| /latest-cash-amounts | GET | Get the net income and current balance from latest amount_history_table entry on app startup or refresh. |
| /transaction-entries | POST | Add transaction entry to transaction_table and return new entry ID, datetime, updated net income and current balance, and timestamp. |
| /transaction-entries | GET | Get transaction entries from transaction_table to display in history on frontend. |
| /utc-epoch-timestamp | POST | Get timestamp in epoch seconds from latest entry in amount_history_table.

### React Frontend

The frontend relies on HTTP requests to perform essential tasks which include but not limited to setting the starting balance, entering new transactions and retrieving the transaction history. Details on these processes are provided below in dotpoints.

- Setting the starting balance when using app for the first time.
    - Sends a **PUT** request to **/latest-cash-amounts** endpoint containing the starting balance amount submitted by user to update the latest entry in amount_history_table.
- Entering a new transaction from frontend to SQL database on backend.
    - Sends a **POST** request to **/transaction-entries** endpoint containing transaction details entered by user.
    - New transaction entry containing submitted information is added to `transaction_table` on backend.
    - Frontend receives the new entry ID from backend via HTTP response and transaction is added to **TRANSACTION HISTORY**.
    - Frontend also receives datetime information, updated net income and current balance, and timestamp.
- Retrieving transaction history from SQL database on frontend startup or refresh.
    - On app startup/refresh, send a **GET** request to **/transaction-entries** along with **n_entries=N** argument to select the N latest transaction entries from `transaction_table`.
    - Frontend receives transactions as JS objects and displays them in **TRANSACTION HISTORY**.