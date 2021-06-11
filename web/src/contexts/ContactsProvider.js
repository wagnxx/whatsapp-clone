import React from 'react'
import { createContext ,useContext} from 'react'
import useLocalStorage from './useLocalStorage';

const ContactsContext = createContext();

export const useContacts = (params) => {
  return useContext(ContactsContext)
}

export default function ContactsProvider({children}) {
  const [contacts,setContacts] = useLocalStorage('contacts',[]);

  function createContact({id,name}) {
    setContacts(prevContacts => {
      return [...prevContacts,{id,name}]
    })
  }

  return (
    <ContactsContext.Provider value={{contacts,createContact}}>
      {children}
    </ContactsContext.Provider>
  )
}
