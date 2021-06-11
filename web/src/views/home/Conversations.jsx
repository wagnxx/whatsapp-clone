import React from 'react'

import { List } from 'antd';
import { useConversations } from '@/contexts/ConversationsProvider';

export default function Conversations({ opendConversation }) {
  const { conversations, selectConversationIndex } = useConversations();

  const handleActive = index => {
    opendConversation()
    selectConversationIndex(index)
  }

  return (

    <List
      bordered
      split={true}
      dataSource={conversations}
      renderItem={(conversation, index) => (
        <List.Item key={index}
          className={conversation.selected ? 'conversastion-active' : ''}
          onClick={() => handleActive(index)}
        >


          {conversation.recipients.map(r => r.name).join(', ')}

        </List.Item>
      )}
    />

  )
}
