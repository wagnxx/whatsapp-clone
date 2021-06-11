import React, { useCallback, useState, Suspense, lazy } from 'react'
import { Row, Col, Form, Input, Tag, PageHeader, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useConversations } from '@/contexts/ConversationsProvider';
import PortalsModal from '@/components/PortalsModal'
import ImgLazyComp from './LazyImgComp';


export default function OpenCoversation({ onBack }) {


  const { sendMessage, sendFiles, selectedConversation } = useConversations();

  const setRef = useCallback(
    node => {
      if (node) {
        node.scrollIntoView({ smooth: true })
      }
    },
    []
  )

  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Success:', values);
    sendMessage(
      selectedConversation.recipients.map(r => r.id),
      values.text);

    form.resetFields();


  };

  const handleOnSend = value => {
    console.log(value);
    console.log(form);
    form.validateFields().then(r => {
      form.submit();
    }).catch(err => {
      console.log('验证不过')
    })
  }

  const splitChunks = file => {

    const perSize = 1024 * 1024 * 0.25;
    const count = Math.ceil(file.size / perSize);;
    const chunkList = new Array(count);
    let offset = 0;
    for (let i = 0; i < count; i++) {
      let chunk = file.slice(offset, offset + perSize);
      offset += perSize;
      chunkList[i] = chunk;
    }
    return chunkList
  }

  const computeHashWithWork = chunkList => {
    return new Promise(resolve => {

      let worker = new Worker('/workers/hash.js');

      worker.postMessage(chunkList);
      worker.onmessage = e => {

        const data = e.data;

        if (data.hash) {
          resolve(data.hash)
        } else {

        }
      }
    })

  }


  const customRequest = async (e) => {
    const file = e.file;
    let chunkList = splitChunks(file);
    const fileHash = await computeHashWithWork(chunkList);

    let chunkListWithHash = chunkList.map((chunk, index) => ({ id: fileHash + '_' + index, blob: chunk }));
    // const stores = getFilesStoreReadWrite();
    // const req = stores.get('xxxx')
    // req.onsuccess = function (e) {
    //   console.log('查找成功', e)

    // }
    // req.onerror = function (e) {
    //   console.log('查找错误', e)
    // }
    // console.log('req', req)
    sendFiles(
      selectedConversation.recipients.map(r => r.id),
      { fileId: fileHash, chunks: chunkListWithHash }
    );

  }



  const [modalOpen, setModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(null)
  const onScan = src => {
    setImgSrc(src)
    setModalOpen(true);
  }

  return (
    <div className="conversation-window">
      {
        <PortalsModal>


          <div style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, right: 0, bottom: 0, left: 0, zIndex: 9999, display: modalOpen ? 'flex' : 'none', alignItems: 'center', background: '#000' }}>

            <img src={imgSrc} alt={'mode'} style={{ width: '100%' }} onClick={() => setModalOpen(false)} />
          </div>
        </PortalsModal>
      }

      <PageHeader
        className="site-page-header"
        onBack={() => onBack()}
        title={selectedConversation.recipients.map(r => r.name).join(', ')}
        style={{ border: '1px solid rgb(235, 237, 240)', borderTop: 'none' }}

      />

      <div className="chat-box">


        <div className="chat-list">

          {
            selectedConversation.messages.map((message, index) => {
              const lastMessage = selectedConversation.messages.length - 1 === index;
              return (

                <Row
                  justify={message.fromMe ? 'end' : 'start'}
                  style={{ marginTop: '14px' }}
                  key={index}

                  className={`chat-list-row ${message.fileId ? 'chat-list-row-has-img' : ''}`}
                >

                  <Col >
                    <p ref={lastMessage ? setRef : null} className={message.fromMe ? "right" : "left"}>
                      {

                        !message.text ?
                          <ImgLazyComp id={message.fileId} key={index} onScan={onScan} />

                          :
                          <span>{message.text}</span>
                      }

                    </p>
                    {
                      message.fromMe ? <Tag color="gold">You</Tag> : <Tag color="success">{message.senderName}</Tag>
                    }
                  </Col>

                </Row>

              )
            })
          }

        </div>
      </div>


      <div className="send-messagebox">

        <Form
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
          >

            <Upload
              customRequest={customRequest}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>

          </Form.Item>
          <Form.Item
            name="text"
            rules={[{ required: true, message: 'Please input your id!' }]}
          >
            <Input.Search
              placeholder="input search text"
              allowClear
              enterButton="Send"
              size="large"
              onSearch={handleOnSend}
            />
          </Form.Item>
        </Form>

      </div>

    </div>
  )
}
