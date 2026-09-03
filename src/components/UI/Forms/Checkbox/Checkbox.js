"use client";

import OptionGroup from "../shared/OptionGroup/OptionGroup";
import data from "./data.json";

/* --------------------------------------------------
   Checkbox Component
-------------------------------------------------- */

export default function Checkbox({ field = data.fields[0], value, onChange, onBlur }) {
  return (
    <OptionGroup
      field={field}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      type='checkbox'
      renderControl={({ option, selected, id, onBlur }) => (
        <input
          type='checkbox'
          name={id}
          value={option.value}
          checked={selected}
          onChange={() => {}}
          onBlur={onBlur}
        />
      )}
    />
  );
}
