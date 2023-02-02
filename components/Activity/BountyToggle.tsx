import { useRouter } from "next/router";
import { useEffect } from "react";
import Toggle from "../Form/Toggle";


const opts = [{
    "value": "offered",
    "label": "Offered",
  },{
    "value": "earned",
    "label": "Earned",
  }]

const BountyToggle = () => {
  const router = useRouter();
  const selected = opts.find(o => o.value === router.query?.sort)?.value ?? "offered";

  const handleSelect = (opt) => {
    router.push({ query: { ...router.query, sort: opt.value } });
  }

  return (
    <Toggle
      options={opts}
      onSelect={handleSelect}
      selected={selected}
    />
  )
}

export default BountyToggle;
