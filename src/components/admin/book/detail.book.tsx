import { FORMATE_DATE_VN } from "@/services/helper";
import { Badge, Descriptions, Drawer } from "antd";
import dayjs from "dayjs";
import { Divider, GetProp, Image, Upload, UploadFile, UploadProps } from 'antd';
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (openViewDetail: boolean) => void;
    dataViewDetail: IBookTable | null;
    setDataViewDetail: (dataViewDetail: IBookTable | null) => void;
}

const DetailBook = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (dataViewDetail) {
            const imageURL = [dataViewDetail.thumbnail, ...(dataViewDetail.slider ?? [])];
            setFileList(
                imageURL.filter(Boolean).map((url, index) => ({
                    uid: uuidv4(),
                    name: `image-${index + 1}.png`,
                    status: "done",
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${url}`,
                }))
            );
        }
    }, [dataViewDetail]);

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    return (
        <>
            <Drawer
                closable
                title={"Chức năng xem chi tiết"}
                width={"55vw"}
                placement="right"
                open={openViewDetail}
                onClose={onClose}
            >
                {dataViewDetail && (
                    <>
                        <Descriptions title="Book Info" layout='horizontal' column={2} bordered>
                            <Descriptions.Item label="Id">{dataViewDetail._id}</Descriptions.Item>
                            <Descriptions.Item label="Tên sách">{dataViewDetail.mainText}</Descriptions.Item>
                            <Descriptions.Item label="Tác giả">{dataViewDetail.author}</Descriptions.Item>
                            <Descriptions.Item label="Giá tiền">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataViewDetail.price)}</Descriptions.Item>
                            <Descriptions.Item label="Thể loại" span={2} >
                                <Badge status="processing" text={dataViewDetail.category} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày tạo">{dayjs(dataViewDetail.createdAt).format(FORMATE_DATE_VN)}</Descriptions.Item>
                            <Descriptions.Item label="Ngày cập nhật">{dayjs(dataViewDetail.updatedAt).format(FORMATE_DATE_VN)}</Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Ảnh sách</Divider>

                        <Upload
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76" listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            showUploadList={
                                { showRemoveIcon: false }
                            }
                        >
                        </Upload>
                        {previewImage && (
                            <Image
                                wrapperStyle={{ display: 'none' }}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                    afterOpenChange: (visible) => !visible && setPreviewImage('')
                                }}
                                src={previewImage}
                            />
                        )}
                    </>
                )}
            </Drawer>
        </>
    );
}

export default DetailBook;