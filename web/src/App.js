import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import useLocalStorage from './contexts/useLocalStorage';
import DashboardContextForUserIdProvider from './contexts/dashboardContext';
import ContactsProvider from './contexts/ContactsProvider';
import ConversationsProvider from './contexts/ConversationsProvider';
import SocketProvider from './contexts/SocketProvider';
import WindowResizeContextProvider from './contexts/WindowResizeContextProvider';
import DBContextProvider from './contexts/DBContextProvider';

import LoginPage from '@/views/login';

export default function App() {
  const [user] = useLocalStorage('user');

  const id = user && user.uid;

  const DashboardWithContext = () => (
    <SocketProvider id={id}>
      <DBContextProvider>
        <WindowResizeContextProvider>
          <ContactsProvider>
            <ConversationsProvider id={id}>
              <DashboardContextForUserIdProvider id={id}>
                <Dashboard />
              </DashboardContextForUserIdProvider>
            </ConversationsProvider>
          </ContactsProvider>
        </WindowResizeContextProvider>
      </DBContextProvider>
    </SocketProvider>
  );

  // return id ? dashboard : <LoginPage onIdSubmit={setId} />;
  return (
    <Router>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/" component={DashboardWithContext} />
      </Switch>
    </Router>
  );
}
