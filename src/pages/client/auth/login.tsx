import React, { useState } from 'react';

import type { FormProps } from 'antd';
import { App, Button, Form, Input } from 'antd';
import "./login.scss";
import { useNavigate } from 'react-router-dom';
import { loginAPI } from '@/services/api';

type FieldType = {
  username: string;
  password: string;
};

const LoginPage: React.FC = () => {

  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>['onFinish'] = async (value) => {
    setIsSubmit(true);
    try {
      const res = await loginAPI(value.username, value.password);

      if (res.data) {
        message.success("Đăng nhập thành công");
        navigate('/');
      } else {
        notification.error(res);
      }
    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!");
    } finally {
      setIsSubmit(false);
    }
  };

  // You need to define onFinishFailed or remove it from the Form props
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className="login-page">
      <main className="main">
        <div className="container">
          <section className="wrapper">
            <div className="heading">
              <h2 className="text text-large">Đăng nhập tài khoản</h2>
              <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item<FieldType>
                  label="Username"
                  name="username"
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={isSubmit}>
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


export default LoginPage;