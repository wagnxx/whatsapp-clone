import React from 'react'
import { Form, Input, Button } from 'antd';
import { v4 as uuid } from 'uuid'

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

export default ({ onIdSubmit }) => {

    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Success:', values);
        onIdSubmit(values.id)
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const createNewId = () => {
        onIdSubmit(uuid())
    }


    return <div className='login-page' style={{ width: '500px', margin: 'auto' }}>
        <Form
            {...layout}
            form={form}
            name="control-hooks"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="Enter your ID"
                name="id"
                rules={[{ required: true, message: 'Please input your id!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">Login</Button>
                <Button onClick={createNewId}>Create A New ID </Button>
            </Form.Item>
        </Form>
    </div>
}