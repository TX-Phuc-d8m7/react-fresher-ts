import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Divider, Form, Input, App } from 'antd';
import './register.scss';
import { registerAPI } from '@/services/api';
import { useNavigate } from 'react-router-dom';

type FieldType = {
  fullName: string
  email: string;
  password: string;
  phone: string;
};

const RegisterPage: React.FC = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const { message } = App.useApp();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>['onFinish'] = async (value) => {
    setIsSubmit(true);
    try {
      const res = await registerAPI(value.fullName, value.email, value.password, value.phone);

      if (res.data) {
        message.success("Đăng ký user thành công");
        navigate('/login');
      } else {
        message.error(res.message);
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
    <div className="register-page">
      <main className="main">
        <div className="container">
          <section className="wrapper">
            <div className="heading">
              <h2 className="text text-large">Đăng ký tài khoản</h2>
              <Divider />
              <Form
                name="form-register"
                layout="vertical"
                style={{ minWidth: 800, margin: "0 auto" }}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item<FieldType>
                  label="Họ tên"
                  name="fullName"
                  rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: 'Email không được để trống!' }, {
                    type: 'email',
                    message: 'Email không đúng định dạng!'
                  }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Mật khẩu"
                  name="password"
                  rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Số điện thoại"
                  name="phone"
                  rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={isSubmit}>
                    Đăng ký
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
