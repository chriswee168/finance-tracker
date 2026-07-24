/**
 * Create function to get current epoch time in seconds.
 * 
 * @returns Current epoch time in seconds.
 */
export default function getCurrentEpochSecs()
{
    return Math.floor(Date.now() / 1000);
}