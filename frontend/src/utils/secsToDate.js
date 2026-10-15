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
  const timeString = date.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit", second: "2-digit"});
  const dateString = date.toLocaleDateString("en-AU", { day: "2-digit", month: "2-digit", year: "numeric"});
  return `${dateString} ${timeString}`;
}