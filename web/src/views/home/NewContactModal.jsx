import React from 'react'
import { Form, Input, Button } from 'antd'
import { useContacts } from '@/contexts/ContactsProvider'

export default function NewContactModal({ closeModal }) {
  const { createContact } = useContacts();
  const onFinish = (value) => {
    createContact(value)
    closeModal();
  }
  return (
    <div>
      <div>
        <Form onFinish={onFinish}>
          <Form.Item
            label="Enter your ID"
            name="id"
            rules={[{ required: true, message: 'Please input your id!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Enter your Name"
            name="name"
            rules={[{ required: true, message: 'Please input your id!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 2, offset: 20 }}>
            <Button type="primary" htmlType="submit">Create</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
