import React, { useState } from 'react';

import type { FormProps } from 'antd';
import { App, Button, Form, Input } from 'antd';
import "./login.scss";
import { useNavigate } from 'react-router-dom';
import { loginAPI } from '@/services/api';
import { userCurrentApp } from '@/components/context/app.context';

type FieldType = {
  username: string;
  password: string;
};

const LoginPage: React.FC = () => {

  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = userCurrentApp();

  const onFinish: FormProps<FieldType>['onFinish'] = async (value) => {
    setIsSubmit(true);
    try {
      const res = await loginAPI(value.username, value.password);
      if (res?.data) {
        setIsAuthenticated(true);
        setUser(res.data.user);
        localStorage.setItem('access_token', res.data.access_token);
        message.success("Đăng nhập thành công");
        navigate('/');
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message ?? Array.isArray(res.message) ? res.message[0] : res.message,
          duration: 5,
        });
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
                name="form-login"
                layout="vertical"
                style={{ minWidth: 300, margin: "0 auto" }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item<FieldType>
                  label="Email"
                  name="username"
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Mật khẩu"
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={isSubmit}>
                    Đăng nhập
                  </Button>
                  <div className="navigate-option">
                    Chưa có tài khoản ? <a onClick={() => navigate('/register')} href="">Đăng ký!</a>
                  </div>
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