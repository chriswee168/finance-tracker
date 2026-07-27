/**
 * Function to get the current date and time.
 * 
 * @returns Return date and time in 12 hours as single string.
 */
export default function getCurrentDatetime()
{
    const date = new Date();

    return date.toLocaleString("en-AU", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
}