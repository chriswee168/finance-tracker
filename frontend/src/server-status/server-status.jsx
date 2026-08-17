import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/api/apiConfig";
import styles from "./server-status.module.css";

/**
 * Indicates if backend server is online or offline.
 * 
 * @returns Server status component.
 */
export default function ServerStatus()
{
  const [serverOnline, setServerOnline] = useState(false);

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