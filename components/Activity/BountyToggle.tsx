import Toggle from "../Form/Toggle";

const opts = [
  {
    value: "bounty_offered",
    label: "Offered",
  },
  {
    value: "bounty_earned",
    label: "Earned",
  },
];

type Args = {
  selectedValue: "bounty_offered" | "bounty_earned";
  handleSelect: Function;
};

const BountyToggle = ({ selectedValue, handleSelect }: Args) => {
  return (
    <Toggle options={opts} onSelect={handleSelect} selected={selectedValue} />
  );
};

export default BountyToggle;
