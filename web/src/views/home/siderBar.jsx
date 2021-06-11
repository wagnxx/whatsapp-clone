import React from 'react'
import { useState } from 'react';
import Conversations from './Conversations';
import Contacts from './Contacts';

import { Tabs, Button, Modal } from 'antd'
import NewConversationModal from './NewConversationModal';
import NewContactModal from './NewContactModal'

const { TabPane } = Tabs;
const CONVERSATIONS_KEY = 'Conversations';
const CONTACTS_KEY = 'contacts';

export default function SiderBar({ id, opendConversation }) {

  const [activeKey, setActiveKey] = useState(CONVERSATIONS_KEY);
  const [modalOpen, setModalOpen] = useState(false);
  const conversationsOpen = activeKey === CONVERSATIONS_KEY;

  function closeModal() {
    setModalOpen(false)
  }


  function callback(key) {
    console.log(key);
    setActiveKey(key)
  }

  return (
    <div className="sider-bar">
      <Tabs style={{ height: ' calc(100vh - 64px)' }} type="card" defaultActiveKey={activeKey} onChange={callback}>
        <TabPane tab="Conversations" key={CONVERSATIONS_KEY}>
          <Conversations opendConversation={opendConversation} />
        </TabPane>
        <TabPane tab="Contacts" key={CONTACTS_KEY}>
          <Contacts />
        </TabPane>


      </Tabs>

      <div style={{ border: '1px solid #ddd' }}>

        Your Id: <span>{id}</span>

      </div>
      <Button onClick={() => setModalOpen(true)} type="primary" block size="large">
        {conversationsOpen ? 'New Conversation' : 'New Contact'}
      </Button>

      <Modal
        visible={modalOpen}
        onCancel={closeModal}
        onOk={closeModal}
        title={conversationsOpen ? 'Create Conversation' : 'Create Contact'}
        okText={() => ''}
        cancelText={() => ''}
        footer={null}
      >
        {
          conversationsOpen ?
            <NewConversationModal closeModal={closeModal} /> :
            <NewContactModal closeModal={closeModal} />
        }
      </Modal>

    </div>
  )
}
