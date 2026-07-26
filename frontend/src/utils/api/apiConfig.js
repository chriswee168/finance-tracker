// Request URL configuration for FastAPI.
const PORT = 8000;
export const BASE_URL = `http://127.0.0.1:${PORT}`;
export const REQUEST_URLS = {
    TRANSACTIONS: `${BASE_URL}/transaction-entries`,
    CURRENT_AMOUNTS: `${BASE_URL}/current-cash-amounts`,
    AMOUNTS_HISTORY: `${BASE_URL}/cash-amounts`,
    TIMESTAMP: `${BASE_URL}/utc-epoch-timestamp`
};