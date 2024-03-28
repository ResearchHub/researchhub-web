import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Tooltip } from "@mui/material";
import colors from "~/config/themes/colors";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  defaultValues: number[];
  onChange: (newValue: number[]) => void;
  histogram?: { [key: string]: number };
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step = 1,
  defaultValues,
  onChange,
  histogram,
}) => {
  const [value, setValue] = useState<number[]>(defaultValues || [min, max]);

  // Update the internal state on every change but don't call the external onChange
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  // Call the external onChange only when the user stops moving the slider
  const handleCommitChange = (event: Event, newValue: number | number[]) => {
    onChange(newValue as number[]);
  };

  const renderHistogram = () => {
    if (!histogram) return null;

    const counts = Object.values(histogram);
    const maxCount = Math.max(...counts);

    return (
      <Box
        sx={{
          display: "flex",
          height: "100px",
          my: -2,
          position: "relative",
          alignItems: "flex-end",
        }}
      >
        {Object.entries(histogram).map(([year, count]) => {
          const key = parseInt(year);
          const leftPosition = ((key - min) / (max - min)) * 100;
          const barHeight = (count / maxCount) * 100;
          const isBarSelected = value[0] === key && value[1] === key;
          return (
            <Tooltip
              key={key}
              title={`${key}: ${count}`}
              placement="right"
              arrow
            >
              <Box
                onClick={(e) => {
                  const newValue = [key, key];
                  setValue([key, key]);
                  onChange(newValue);
                }}
                key={key}
                sx={{
                  position: "absolute",
                  left: `${leftPosition}%`,
                  width: "6px",
                  bgcolor: isBarSelected
                    ? colors.NEW_BLUE(1.0)
                    : colors.NEW_BLUE(0.5),
                  height: `${barHeight}%`,
                  transform: "translateX(-50%)",
                  cursor: "pointer",
                  borderRadius: "2px",
                  ":hover": {
                    backgroundColor: colors.NEW_BLUE(),
                  },
                }}
              />
            </Tooltip>
          );
        })}
      </Box>
    );
  };

  return (
    <Box sx={{ width: "100%", padding: "0 12px" }}>
      {renderHistogram()}
      <Slider
        getAriaLabel={() => "Range selection"}
        value={value}
        onChange={handleSliderChange}
        // @ts-ignore
        onChangeCommitted={handleCommitChange}
        valueLabelDisplay="off"
        min={min}
        max={max}
        step={step}
        sx={{
          mb: 0,
          color: colors.NEW_BLUE(),
          height: 4,
          "& .MuiSlider-thumb": {
            width: 16,
            height: 16,
            backgroundColor: "white",
            transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
            "&::before": {
              boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
            },
            "&:hover, &.Mui-focusVisible": {
              boxShadow: `0px 0px 0px 8px rgb(0 0 0 / 16%)`,
            },
            "&.Mui-active": {
              width: 20,
              height: 20,
            },
          },
        }}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="caption" gutterBottom>
          {value[0]}
        </Typography>
        <Typography variant="caption" gutterBottom>
          {value[1]}
        </Typography>
      </Box>
    </Box>
  );
};

export default RangeSlider;
