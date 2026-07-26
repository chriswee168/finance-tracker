import { CASH_DP, CASH_SCALE_FACTOR } from "./constants";

/**
 * Convert cash in dollars to cents.
 * 
 * @param {number} dollars Cash in dollars.
 * 
 * @returns Cash in cents.
 */
export function dollarsToCents(dollars)
{
    return Math.round(dollars * CASH_SCALE_FACTOR);
}

/**
 * Convert cash in cents to dollars.
 * 
 * @param {number} cents Cash in cents.
 * 
 * @returns Cash in dollars.
 */
export function centsToDollars(cents)
{
    return Number((cents / CASH_SCALE_FACTOR).toFixed(CASH_DP));
}