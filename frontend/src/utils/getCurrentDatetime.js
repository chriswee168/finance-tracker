/**
 * Function to get the current date and time.
 * 
 * @returns Return date and time in 12 hours as single string.
 */
export default function getCurrentDatetime()
{
    const date = new Date();

    // Get date.
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get time.
    const hours = date.getHours();
    const mins = String(date.getMinutes()).padStart(2, '0');
    const secs = String(date.getSeconds()).padStart(2, '0');

    // Convert 24 hours to 12 hours.
    const ampm = hours >= 12 ? "pm" : "am";
    const hoursMod = hours % 12;
    const twelveHours = String(hoursMod == 0 ? 12 : hoursMod).padStart(2, '0');

    return `${year}-${month}-${day} ${twelveHours}:${mins}:${secs}${ampm}`;
}