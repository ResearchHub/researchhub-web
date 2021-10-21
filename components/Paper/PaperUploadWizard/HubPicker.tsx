import { FC, useEffect, useState } from "react";
import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";
import { capitalize } from "~/config/utils/string";
import FormSelect from "../../Form/FormSelect";
import { Hub } from "~/config/types/root_types";

type HubPickerProps = {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  value: Hub[];
  onChange: (id: string, value: Hub[]) => void;
};

export const HubPicker: FC<HubPickerProps> = ({
  id,
  value,
  onChange,
  label = "Hubs",
  placeholder = "Search Hubs",
  required,
}) => {
  const [suggestedHubs, setSuggestedHubs] = useState<Hub[]>([]);

  useEffect(() => {
    fetch(API.HUB({ pageLimit: 1000 }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        const { results } = resp as unknown as { results: Hub[] };
        const hubs = results
          .map((hub) => {
            return {
              ...hub,
              value: hub.id,
              label: capitalize(hub.name),
            };
          })
          .sort((a, b) => {
            return a.label.localeCompare(b.label);
          });
        setSuggestedHubs(hubs);
      });
  }, []);

  return (
    <FormSelect
      // error={formErrors.hubs}
      id={id}
      isMulti
      label={label}
      // inputStyle={
      //   (customStyles.input,
      //   selectedHubs.length > 0 && customStyles.capitalize)
      // }
      value={value}
      onChange={(id, value) => onChange(id, value)}
      options={suggestedHubs}
      placeholder={placeholder}
      required={required}
    />
  );
};
