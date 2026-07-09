import styles from "./trend-arrow-set.module.css";

/**
 * Create the trend arrow set component to display cash trend overtime.
 * 
 * @returns Trend arrow set component.
 */
export default function TrendArrowSet({upColourState, downColourState})
{
  const upStyle = {borderBottom: upColourState};
  const downStyle = {borderTop: downColourState};

  return (
    <div className={styles.trendArrowSet}>
      <div className={`${styles.arrowStyle} ${styles.upArrow}`} style={upStyle}/>
      <div className={`${styles.arrowStyle} ${styles.downArrow}`} style={downStyle}/>
    </div>
  )
}