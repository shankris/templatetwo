"use client";

import OptionGroup from "../shared/OptionGroup/OptionGroup";
import data from "./data.json";

/* --------------------------------------------------
   Radio Component
-------------------------------------------------- */

export default function Radio({ field = data.fields[0], value, onChange, onBlur }) {
  return (
    <OptionGroup
      field={field}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      type='radio'
      renderControl={({ option, selected, id, onBlur }) => (
        <input
          type='radio'
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
