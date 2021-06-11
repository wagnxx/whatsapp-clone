import React, { useState } from 'react'
import { Form, Button, Checkbox } from 'antd'
import { useContacts } from '@/contexts/ContactsProvider';
import { useConversations } from '@/contexts/ConversationsProvider';

export default function NewConversationModal({ closeModal }) {
  const { contacts } = useContacts();
  const { createConversation } = useConversations();
  const [selectedContactIds, setSelectedContactIds] = useState([])

  const onFinish = (value) => {
    createConversation(selectedContactIds)
    closeModal();
  }

  const handleCheckboxChange = (e, item) => {
    const checked = e.target.checked;

    setSelectedContactIds(prevSelectedIds => {
      if (checked) {
        return [...new Set([...prevSelectedIds, item.id])];
      } else {
        return prevSelectedIds.filter(id => id !== item.id);
      }
    })
  }

  return (
    <div>
      <div>
        <Form onFinish={onFinish}>

          {
            contacts.map((contact, index) => (
              <Form.Item
                key={index}
              >
                <Checkbox
                  onChange={(e) => handleCheckboxChange(e, contact)}
                  checked={selectedContactIds.includes(contact.id)}
                >
                  {contact.name}
                </Checkbox>
              </Form.Item>
            ))
          }

          <Form.Item wrapperCol={{ span: 2, offset: 20 }}>
            <Button type="primary" htmlType="submit">Create</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
