import { createUserAPI } from "@/services/api";
import { App, Divider, Form, FormProps, Input, Modal } from "antd";
import { useState } from "react";

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    fullName: string;
    password: string;
    email: string;
    phone: string;
}

const CreateUser = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = async (value) => {
        setIsSubmit(true);
        try {
            const res = await createUserAPI(value.fullName, value.email, value.password, value.phone);

            if (res && res.data) {
                message.success("Tạo mới user thành công");
                form.resetFields();
                setOpenModalCreate(false);
                refreshTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                })
            }
        } catch (error: any) {
            message.error("Thêm user thất bại, vui lòng thử lại!");
        } finally {
            setIsSubmit(false); // Always reset loading whether success of fail
        }
    };

    return (
        <>
            <Modal
                title="Thêm mới người dùng"
                open={openModalCreate}
                onOk={() => { form.submit(); }}
                onCancel={() => {
                    setOpenModalCreate(false);
                    form.resetFields();
                }}
                okText="Tạo mới"
                cancelText="Huỷ"
                confirmLoading={isSubmit}
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    layout="vertical"
                    style={{ minWidth: 300, margin: "0 auto" }}
                    onFinish={onFinish}
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
                </Form>
            </Modal>
        </>
    );
}


export default CreateUser;