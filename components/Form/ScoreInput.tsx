import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState } from "react";

type Props = {
    value: number;
    onSelect: Function    
};

function ScoreInput({
  value,
  onSelect,
}: Props): ReactElement {

  const [selectedValue, setSelectedValue] = useState<number>(value);
  const handleSelect = (e) => {
    console.log(e.target.value)
    setSelectedValue(e.target.value);
    onSelect(selectedValue);
  }

  return (
    <div className={css(styles.scoreInput)}>
      <input type="text" value={selectedValue} onChange={handleSelect} />
    </div>
  )
}

const styles = StyleSheet.create({
  "scoreInput": {

  }
})

export default ScoreInput;