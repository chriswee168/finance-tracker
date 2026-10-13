/**
 * Get the day and time in the future when net income will reset for the next period.
 * 
 * @param {number} timestamp Epoch time in seconds.
 * 
 * @returns Day and time as string.
 */
export const secsToDate = (timestamp) =>
{
  const date = new Date(Math.round(timestamp * 1000));
  const dateString = date.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric"});
  return dateString;
}