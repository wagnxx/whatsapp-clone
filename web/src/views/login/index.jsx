import React, { useState } from 'react'
import { Form, Input, Button, Switch } from 'antd';
import { v4 as uuid } from 'uuid'
import { fetchPost } from '../../utils/request'
import useLocalStorage from '../../contexts/useLocalStorage';
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
    const [user, setUser] = useLocalStorage('user');
    const [isLogin, setIsLogin] = useState(true)
    const [form] = Form.useForm();

    const onFinish = (values) => {
        form.validateFields().then(v => {
            console.log('Success:', v);

            let rawParams = {
                ...v,
                uid: !isLogin ? uuid() : null
            }
            const actionUrl = isLogin ? 'login' : 'signUp'

            fetchPost('/user/' + actionUrl, rawParams).then(user => {

                isLogin && setUser(user)
                // accessToken: " . . "
                // name:  
                // refreshToken:   . "
                // uid:
            })

        })
        // onIdSubmit(values.id)
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const createNewId = () => {
        // onIdSubmit(uuid())
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
                label="Enter your username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Enter your passWord"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" >
                    {
                        isLogin ? "Log in" : "Sign in"
                    }
                </Button>
                {/* <Button onClick={createNewId}>Create A New ID </Button> */}
            </Form.Item>
            <Form.Item
                wrapperCol={{ offset: 5, span: 24 }}
                labelCol={{ span: 4, offset: 0 }}
                label={!isLogin ? "切换到 Log in" : "切换到 Sign in"}
            >

                <Switch defaultChecked={isLogin} onChange={() => setIsLogin(!isLogin)}></Switch>
            </Form.Item>
        </Form>
    </div>
}