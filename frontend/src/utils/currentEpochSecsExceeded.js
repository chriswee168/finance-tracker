import { TIMESTAMP_INTERVAL_SECS } from "./constants";

/**
 * Create function to check if current epoch time in seconds has exceeded the timestamp 
 * interval in seconds starting from a past timestamp.
 * 
 * @param {number} pastEpoch Starting epoch time in seconds to calculate the cutoff time in seconds.
 * 
 * @returns Current epoch time in seconds.
 */
export default function currentEpochSecsExceeded(pastEpochSecs)
{
    const currentEpoch = Math.floor(Date.now() / 1000);
    const cutoffEpoch = pastEpochSecs + TIMESTAMP_INTERVAL_SECS;
    const intervalExceeded = currentEpoch > cutoffEpoch;
    return [currentEpoch, intervalExceeded];
}