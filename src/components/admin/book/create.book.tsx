import { createBookAPI, getCategory, uploadFileAPI } from "@/services/api";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Divider, Form, FormProps, GetProp, Input, InputNumber, InputNumberProps, message, Modal, Select, Upload, UploadFile, UploadProps } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { useEffect, useState } from "react";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { stat } from "fs";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type UserUploadType = "thumbnail" | "slider";

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

interface IOption {
    value: string;
    label: React.ReactNode;
}

type FieldType = {
    thumbnail: any;
    slider: any;
    mainText: string;
    author: string;
    price: number;
    quantity: number;
    category: string;
}

const CreateBook = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();

    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);

    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);

    const [categories, setCategories] = useState<IOption[]>([]);

    const formatter: InputNumberProps<number>['formatter'] = (value) => {
        const [start, end] = `${value}`.split('.') || [];
        const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `${end ? `${v}.${end}` : `${v}`}`;
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (value) => {
        setIsSubmit(true);
        console.log("value", value, fileListThumbnail, fileListSlider);
        console.log("value fileListThumbnail", fileListThumbnail, fileListSlider);
        console.log("value fileListSlider", fileListSlider);

        setIsSubmit(false);
    };

    const getBase64 = (file: FileType): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
        if (!isLt2M) {
            message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE} MB!`);
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
    };

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await getCategory();
                if (res && Array.isArray(res.data)) {
                    const options = res.data.map((item: string) => ({
                        value: item,
                        label: <span>{item}</span>,
                    }));
                    setCategories(options);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        fetchCategories();
    }, []);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true)
    }

    const handleRemove = async (file: UploadFile, type: UserUploadType) => {
        if (type === "thumbnail") {
            setFileListThumbnail([]);
        }
        if (type === "slider") {
            const newSlider = fileListSlider.filter(x => x.uid !== file.uid);
            setFileListSlider(newSlider);
        }
    }

    const handleChange = (info: UploadChangeParam, type: "thumbnail" | "slider") => {
        if (info.file.status === 'uploading') {
            type === "thumbnail" ? setLoadingThumbnail(true) : setLoadingSlider(true);
            return;
        }

        if (info.file.status === 'done') {
            type === "thumbnail" ? setLoadingThumbnail(false) : setLoadingSlider(false);
        }
    }

    const handleUploadFile = async (options: RcCustomRequestOptions, type: UserUploadType,) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, "book");

        if (res && res.data) {
            const uploadedFile: any = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`
            }
            if (type === "thumbnail") {
                setFileListThumbnail([{ ...uploadedFile }])
            } else {
                setFileListSlider((prevState) => [...prevState, { ...uploadedFile }])
            }

            if (onSuccess)
                onSuccess('OK')
        } else {
            message.error(res.message)
        }
    }

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <>
            <Modal
                title="Thêm sách mới"
                open={openModalCreate}
                onOk={() => { form.submit(); }}
                onCancel={() => {
                    form.resetFields();
                    setFileListSlider([]);
                    setFileListThumbnail([]);
                    setOpenModalCreate(false);

                }}
                destroyOnClose={true}
                okButtonProps={{ loading: isSubmit }}
                okText="Tạo mới"
                cancelText="Huỷ"
                confirmLoading={isSubmit}
                maskClosable={false}
                width={"50vw"}
            >
                <Divider />

                <Form
                    form={form}
                    name="form-create-book"
                    layout="horizontal"
                    style={{ minWidth: 300, margin: "0 auto" }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Tên sách"
                        name="mainText"
                        rules={[{ required: true, message: 'Tên sách không được để trống!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Tác giả"
                        name="author"
                        rules={[{ required: true, message: 'Tên tác giả không được để trống!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Giá tiền"
                        name="price"
                        rules={[{ required: true, message: 'Giá tiền không được để trống!' }]}
                    >
                        <InputNumber<number>
                            min={1}
                            style={{ width: '100%' }}
                            formatter={formatter}
                            parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                            addonAfter="đ"
                        />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Thể loại"
                        name="category"
                        rules={[{ required: true, message: 'Thể loại không được để trống' }]}
                    >
                        <Select options={categories} />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Số lượng"
                        name="quantity"
                        rules={[{ required: true, message: 'Số lượng không được để trống!' }]}
                    >
                        <InputNumber />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Ảnh Thumbnail"
                        name="thumbnail"
                        rules={[{ required: true, message: 'Thumbnail không được để trống!' }]}

                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            maxCount={1}
                            multiple={false}
                            customRequest={(options) => handleUploadFile(options, "thumbnail")}
                            beforeUpload={beforeUpload}
                            onChange={(info) => handleChange(info, "thumbnail")}
                            onPreview={handlePreview}
                            onRemove={(file) => handleRemove(file, "thumbnail")}
                            fileList={fileListThumbnail}
                        >
                            <div>
                                {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Ảnh Slider"
                        name="slider"
                        rules={[{ required: true, message: 'Slider không được để trống!' }]}

                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Upload
                            listType="picture-card"
                            className="avatar-uploader"
                            multiple
                            customRequest={(options) => handleUploadFile(options, "slider")}
                            beforeUpload={beforeUpload}
                            onChange={(info) => handleChange(info, "slider")}
                            onPreview={handlePreview}
                            onRemove={(file) => handleRemove(file, "slider")}
                            fileList={fileListSlider}
                        >
                            <div>
                                {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}


export default CreateBook