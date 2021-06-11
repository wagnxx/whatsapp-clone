import React from 'react';
// import { useState,useEffect } from 'react';
import { createContext } from 'react';
import { useContext } from 'react';

const DashCtx = createContext();

export function useDashboardContext() {
  return useContext(DashCtx);
}

export default function DashboardContext({ children, id }) {
  return <DashCtx.Provider value={{id}}>{children}</DashCtx.Provider>;
}
