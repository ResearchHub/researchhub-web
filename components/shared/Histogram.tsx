import React from 'react';
import { css, StyleSheet } from 'aphrodite';
import { Tooltip } from "@mui/material";

type DataPoint = {
  key: string;
  value: number;
};

type HistogramProps = {
  data: DataPoint[];
  histogramBarStyle?: any;
};

const Histogram: React.FC<HistogramProps> = ({ data, histogramBarStyle }) => {
  // Find the maximum value in the dataset to scale the bars
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className={css(styles.histogram)}>
      {data.map((d, index) => (
        <div key={index} className={css(styles.histogramBarContainer)}>
          {/* <div className={css(styles.histogramKey)}>{d.key}</div> */}

          <Tooltip
              title={`${d.key}: ${d.value}`}
              placement="right"
              arrow
            >
              <div
                className={css(styles.histogramBar, histogramBarStyle)}
                style={{
                  height: `${Math.max((d.value / maxValue) * 100, 5)}%`, // Ensure minimum height for non-zero values
                }}
              >
              </div>
          </Tooltip>
        </div>
      ))}
    </div>
  );
};

const styles = StyleSheet.create({
  histogram: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '100%',
    width: '100%',
    padding: '10px',
    boxSizing: 'border-box',
  },
  histogramBarContainer: {
    display: 'flex',
    flexDirection: 'column-reverse', // Ensure bars grow from bottom to top
    alignItems: 'center',
    marginRight: 0,
    height: '100%', // Make sure the container height is 100% of the parent
  },
  histogramBar: {
    width: '15px',
    backgroundColor: '#3498db',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    transition: 'height 0.3s ease',
  },
  histogramBarValue: {
    color: 'white',
    fontSize: '12px',
    paddingBottom: '5px',
  },
  histogramKey: {
    marginTop: '5px',
    fontSize: '14px',
  },
});

export default Histogram;
