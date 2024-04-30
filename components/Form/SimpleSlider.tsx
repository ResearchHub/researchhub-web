import Slider from "@mui/material/Slider";
import { useState } from "react";
import colors from "~/config/themes/colors";

interface Props {
  start: number;
  end: number;
  initial?: number;
  marks?: { value: number; label: string }[]
  onChange: (newValue: number) => void;
}

const SimpleSlider = ({ start, end, initial = 0, marks, onChange }: Props) => {
  const [value, setValue] = useState<number>(initial);

  const handleCommitChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
    onChange(newValue as number);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  function valueLabelFormat(value: number) {
    if (value === 0) return "0th percentile";
    else if (value === 1) return "1st percentile";
    else if (value === 2) return "2nd percentile";
    else if (value === 3) return "3rd percentile";
    else {
      return value + "th percentile";
    }
  }

  return (
    <Slider
      value={value}
      marks={marks}
      // This css can be extracted out or refactored once slider has multiple uses
      sx={{
        color: colors.NEW_BLUE(),
        "& .MuiSlider-markLabel[data-index='0']": {
          marginLeft: "30px",
        },
        "& .MuiSlider-markLabel[data-index='1']": {
          paddingRight: "60px",
        }
      }}
      // @ts-ignore
      onChangeCommitted={handleCommitChange}
      onChange={handleSliderChange}
      valueLabelFormat={valueLabelFormat}
      valueLabelDisplay="auto"
      
    />
  );
};

export default SimpleSlider;
