import React from "react";
import "../global.css";
import { Slot, Stack } from "expo-router";
import QueryProvider from "@/frontend/providers/src/providers/QueryProvider";

export default function Layout() {
  
  return (
    <QueryProvider>
      <Stack />
    </QueryProvider>
  )
}
