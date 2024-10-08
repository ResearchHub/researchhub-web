import React from 'react';
import { css, StyleSheet } from 'aphrodite';
import { Tooltip } from "@mui/material";
import { breakpoints } from '~/config/themes/screen';

type DataPoint = {
  key: string;
  value: number;
  };
  
  type HistogramProps = {
  type: string;
  data: DataPoint[];
  histogramBarStyle?: any;
};

const Histogram: React.FC<HistogramProps> = ({ data, histogramBarStyle, type }) => {
  // Find the maximum value in the dataset to scale the bars
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className={css(styles.histogram)}>
      {data.map((d, index) => (
        <div key={index} className={css(styles.histogramBarContainer)}>
          {/* <div className={css(styles.histogramKey)}>{d.key}</div> */}

          <Tooltip
              title={`${d.key}: ${d.value} ${type}`}
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
    // FIXME: The width of the bars should be responsive and not controlled by media queries but rather by parent container
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      width: 30,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: 20,
    },
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      width: 15,
    }
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
