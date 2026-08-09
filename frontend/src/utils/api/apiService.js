import { dollarsToCents } from "../cashUnitConversion";

/**
 * Function to query FastAPI backend with setter HTTP request.
 * 
 * @param {string} urlPath Full URL path.
 * @param {string} httpMethod HTTP method for fetch call.
 * @param {Object} body Object/data to send.
 * 
 * @returns Response object.
 */
export async function apiSendJSON(urlPath, httpMethod, body)
{
  const response = await fetch(urlPath, {
    method: httpMethod,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });

  return response
}

/**
 * Function to send net income and current balance to a request URL.
 * 
 * @param {number} netIncomeDollars Net income in dollars.
 * @param {number} currentBalanceDollars Current balance in dollars.
 * @param {string} httpMethod HTTP method (POST/PUT).
 * @param {string} requestURL URL to send net income and current balance to.
 */
export const apiSendAmounts = (
  netIncomeDollars, 
  currentBalanceDollars,
  httpMethod,
  requestURL
) =>
{
  const netIncomeCents = dollarsToCents(netIncomeDollars);
  const currentBalanceCents = dollarsToCents(currentBalanceDollars);

  apiSendJSON(
    requestURL, 
    httpMethod, 
    {
      net_income_cents: netIncomeCents,
      current_balance_cents: currentBalanceCents
    }
  )
  .then((response) => {
    if (!response.ok)
    {
      throw new Error(`HTTP code ${response.status}: ${response.statusText}`);
    }
  })
  .catch(
    (error) => console.log(error)
  );
}
