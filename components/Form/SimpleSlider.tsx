import Slider from "@mui/material/Slider";
import { useState } from "react";
import colors from "~/config/themes/colors";

interface Props {
  start: number;
  end: number;
  initial?: number;
  onChange: (newValue: number) => void;
}

const SimpleSlider = ({ start, end, initial = 0, onChange }: Props) => {
  const [value, setValue] = useState<number>(initial);

  const handleCommitChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
    onChange(newValue as number);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  function valueLabelFormat(value: number) {
    return value + "th percentile";
  }

  return (
    <Slider
      value={value}
      sx={{
        color: colors.NEW_BLUE(),
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
