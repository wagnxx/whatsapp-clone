import React from 'react'
import { useContacts } from '@/contexts/ContactsProvider'
import { List } from 'antd';


export default function Contacts() {
  const { contacts } = useContacts();

  return (

    <List
      bordered
      split={true}
      dataSource={contacts}
      renderItem={item => (
        <List.Item>
          {item.name}
        </List.Item>
      )}
    />


  )
}
