"use client";

import { useState } from "react";

import DatePickerNative from "@/components/UI/DatePickers/DatePickerNative/DatePickerNative";

export default function TestDatePicker() {
  const [date, setDate] = useState("");

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto" }}>
      <h1>Native DatePicker Test</h1>

      <DatePickerNative
        value={date}
        onChange={setDate}
        locale='en-US'
      />

      <p>Selected: {date || "None"}</p>
    </div>
  );
}
