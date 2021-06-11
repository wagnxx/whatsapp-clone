import React from 'react';
import { Layout } from 'antd';
import './dashboard.css'


import ChatWithSocketPage from '@/views/home'

const { Content } = Layout;


export default function Dashboard() {

  return (
    <Layout className="layout">

      <Content
        style={{
          padding: '0',
          height: '100vh',
          overflow: 'scroll',
        }}
      >
        <div style={{ background: '#fff', minHeight: 280 }}>
          <ChatWithSocketPage />
        </div>
      </Content>
    </Layout>

  );
}
