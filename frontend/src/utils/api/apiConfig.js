// Request URL configuration for FastAPI.
const PORT = 8000;
export const BASE_URL = import.meta.env.VITE_API_URL || `http://127.0.0.1:${PORT}`;
export const REQUEST_URLS = {
    TRANSACTIONS: `${BASE_URL}/transaction-entries`,
    LATEST_AMOUNTS: `${BASE_URL}/latest-cash-amounts`,
    TIMESTAMP: `${BASE_URL}/utc-epoch-timestamp`
};