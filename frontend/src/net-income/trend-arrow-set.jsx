import styles from "./trend-arrow-set.module.css";

/**
 * Create the trend arrow set component to display trend of net income overtime.
 * 
 * @returns Trend arrow set component.
 */
export default function TrendArrowSet({upColourState, downColourState})
{
  const upStyle = {borderBottom: upColourState};
  const downStyle = {borderTop: downColourState};

  return (
    <div>
      <div className={styles.arrowStyle} style={upStyle}/>
      <div className={styles.arrowStyle} style={downStyle}/>
    </div>
  )
}