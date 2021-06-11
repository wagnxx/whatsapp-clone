import React from 'react';
import { createContext, useContext } from 'react';
import { getObjectStore, STORE_NAME, MODE, db } from '../utils/db';

const DBContext = createContext();

export { db };

export function useDBContext() {
  return useContext(DBContext);
}

const getFilesStore = (mode) => {
  const filesStore = getObjectStore(STORE_NAME, mode);
  return filesStore;
};

export const getFilesStoreReadOnly = () => getFilesStore(MODE.READ);
export const getFilesStoreReadWrite = () => getFilesStore(MODE.READ_WRITE);

export default function DBContextProvider({ children }) {
  return (
    <DBContext.Provider
      value={{ getFilesStoreReadOnly, getFilesStoreReadWrite, db }}
    >
      {children}
    </DBContext.Provider>
  );
}
