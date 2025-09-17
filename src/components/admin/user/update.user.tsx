import { createUserAPI, updateUserAPI } from "@/services/api";
import { App, Divider, Form, FormProps, Input, Modal } from "antd";
import { useEffect, useState } from "react";

interface IProps {
    dataViewDetail: IUserTable | null;
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    _id: string;
    fullName: string;
    phone: string;
    email: string;
}

const CreateUser = (props: IProps) => {
    const { dataViewDetail, openModalUpdate, setOpenModalUpdate, refreshTable } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();

    useEffect(() => {
        if (openModalUpdate) {
            form.setFieldsValue({
                _id: dataViewDetail?._id,
                fullName: dataViewDetail?.fullName,
                email: dataViewDetail?.email,
                phone: dataViewDetail?.phone
            });
        }
    }, [dataViewDetail, openModalUpdate, form]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (value) => {
        setIsSubmit(true);
        try {
            const res = await updateUserAPI(value._id, value.fullName, value.phone);

            if (res && res.data) {
                message.success("Cập nhật thông tin user thành công");
                form.resetFields();
                setOpenModalUpdate(false);
                refreshTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                })
            }
        } catch (error: any) {
            message.error("Cập nhật thông tin user thất bại, vui lòng thử lại!");
        } finally {
            setIsSubmit(false); // Always reset loading whether success of fail
        }
    };

    return (
        <>
            <Modal
                title="Cập nhật người dùng"
                open={openModalUpdate}
                onOk={() => { form.submit(); }}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    form.resetFields();
                }}
                okText="Cập nhật"
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
                    initialValues={{
                        fullName: props.dataViewDetail?.fullName,
                        email: props.dataViewDetail?.email,
                        phone: props.dataViewDetail?.phone
                    }}

                >
                    <Form.Item name="_id" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Họ tên"
                        name="fullName"
                        rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                    >
                        <Input />
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