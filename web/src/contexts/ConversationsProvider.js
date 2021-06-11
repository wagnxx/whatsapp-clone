import React, { useState } from 'react';
import { useEffect, useCallback } from 'react';
import { createContext, useContext } from 'react';
import useLocalStorage from './useLocalStorage';
import { useContacts } from './ContactsProvider';
import { useSocket } from './SocketProvider';
import { useDBContext } from './DBContextProvider';

const ConversationsContext = createContext();

export function useConversations(params) {
  return useContext(ConversationsContext);
}

export default function ConversationsProvider({ id, children }) {
  const [conversations, setConversations] = useLocalStorage(
    'conversations',
    []
  );
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
  const { contacts } = useContacts();
  const socket = useSocket();
  const { getFilesStoreReadOnly, getFilesStoreReadWrite } = useDBContext();

  function createConversation(recipients) {
    setConversations((prevConversations) => {
      return [...prevConversations, { recipients, messages: [] }];
    });
  }

  const addMessageToConversation = useCallback(
    ({ recipients, text, sender }) => {
      setConversations((prevConversations) => {
        let madeChange = false;
        const newMessage = { sender, text };
        const newConversations = prevConversations.map((conversation) => {
          if (arrayEquality(conversation.recipients, recipients)) {
            madeChange = true;
            return {
              ...conversation,
              messages: [...conversation.messages, newMessage],
            };
          }
          return conversation;
        });
        if (madeChange) {
          return newConversations;
        } else {
          return [...prevConversations, { recipients, messages: [newMessage] }];
        }
      });
    },
    [setConversations]
  );

  function sendMessage(recipients, text) {
    socket.emit('send-message', { recipients, text });
    console.log('socket', socket);
    addMessageToConversation({ recipients, text, sender: id });
  }

  function saveFileIntoDB(file, createdId) {
    const { id, chunks } = file;
    const rawParams = { id, chunks, createdId };
    const store = getFilesStoreReadWrite();
    const req = store.add(rawParams);

    req.onsuccess = function addSuccess(e) {
      console.log('文件存储成功', e.target.result);
    };
  }

  function addFileToConversation({ recipients, file, sender }) {
    console.log('receive-file-message', { recipients, file, sender });
    saveFileIntoDB(file, sender);
    setConversations((prevConversations) => {
      let madeChage = false;
      const newMessage = { sender, fileId: file.id };
      const newConversations = prevConversations.map((conversation) => {
        if (arrayEquality(conversation.recipients, recipients)) {
          madeChage = true;
          return {
            ...conversation,
            messages: [...conversation.messages, newMessage],
          };
        }
        return conversation;
      });

      if (madeChage) {
        return newConversations;
      } else {
        return [...prevConversations, { recipients, messages: [newMessage] }];
      }
    });
  }

  function sendFiles(recipients, { fileId, chunks }) {
    const file = { id: fileId, chunks };

    socket.emit('send-file-message', { recipients, file });

    addFileToConversation({ recipients, file, sender: id });
  }

  const formattedConversations = conversations.map((conversation, index) => {
    const recipients = conversation.recipients.map((recipient) => {
      const contact = contacts.find((contact) => contact.id === recipient);
      const name = (contact && contact.name) || recipient;

      return { id: recipient, name };
    });

    const messages = conversation.messages.map((message) => {
      const contact = contacts.find((contact) => contact.id === message.sender);
      const name = (contact && contact.name) || message.sender;
      const fromMe = id === message.sender;

      return { ...message, senderName: name, fromMe };
    });

    const selected = index === selectedConversationIndex;

    return { ...conversation, messages, recipients, selected };
  });

  useEffect(() => {
    if (socket == null) return;
    socket.on('receive-message', addMessageToConversation);
    socket.on('receive-file-message', addFileToConversation);
    return () => {
      socket.off('receive-message');
      socket.off('receive-file-message');
    };
  }, [socket, addMessageToConversation, addFileToConversation]);

  const value = {
    createConversation,
    conversations: formattedConversations,
    selectConversationIndex: setSelectedConversationIndex,
    selectedConversation: formattedConversations[selectedConversationIndex],
    sendMessage,
    sendFiles,
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}

function arrayEquality(a, b) {
  if (a.length !== b.length) return false;
  a.sort();
  b.sort();

  return a.every((element, index) => {
    return element === b[index];
  });
}
