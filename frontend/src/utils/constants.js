// Trend arrow colours.
export const TREND_ARROW_COLOURS = {
    green: "20px solid green",
    red: "20px solid red",
    gray: "20px solid gray"
};

// Colours for negative/positive sign.
export const SIGN_COLOURS = {
    green: "rgb(48, 192, 0)",
    red: "rgb(195, 0, 0)",
    black: "black",
};

// Constants for decimal places and scaling factor.
export const CASH_DP = 2;
export const CASH_SCALE_FACTOR = 100;

// Max number of entries transaction history window can display.
export const MAX_TRANSACTION_ENTRIES = 100;

// Timestamp interval in seconds at which net income should be refreshed and saved on
// FastAPI backend.
export const TIMESTAMP_INTERVAL_SECS = 24 * 7 * 3600;

// Amount box labels for net income and current balance.
export const NET_INCOME_LABEL = "Weekly Net Income";
export const CURRENT_BALANCE_LABEL = "Current Balance";