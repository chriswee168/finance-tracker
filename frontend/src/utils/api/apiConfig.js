// URL and API path settings.
const PORT = 8000;
export const BASE_URL = `http://127.0.0.1:${PORT}`;
export const URL_PATHS = {
    TRANSACTIONS: `${BASE_URL}/transaction-entries`,
    CURRENT_AMOUNTS: `${BASE_URL}/current-cash-amounts`
};