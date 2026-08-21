import { useEffect } from "react";
import { BASE_URL } from "../utils/api/apiConfig";
import styles from "./server-status.module.css";

/**
 * Indicates if backend server is online or offline.
 * @param {Object} param0
 * @param {bool} param0.serverOnline Boolean to indicate if the backend API server is online or offline.
 * @param {Dispatch<SetStateAction<bool>>} param0.setServerOnline Setter for serverOnline state.
 * 
 * @returns Server status component.
 */
export default function ServerStatus({serverOnline, setServerOnline})
{
  // Try GET request from base URL.
  useEffect(() => {
    fetch(BASE_URL)
      .then(response => {
        if (response.ok)
        {
          setServerOnline(true);
        }
        else
        {
          setServerOnline(false);
        }
      }
    );
  }, []);

  return (
    <div className={`${styles.serverStatusDiv} ${serverOnline ? styles.onlineStatus : styles.offlineStatus}`}>
      <h3>{serverOnline ? "SERVER ONLINE" : "SERVER OFFLINE"}</h3>
    </div>
  )
}