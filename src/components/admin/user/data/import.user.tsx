import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, notification, Table, Upload } from "antd";
import { UploadProps } from "antd/lib/upload";
import { useState } from "react";
import ExcelJS from "exceljs";
import { bulkCreateUserAPI } from "@/services/api";
// Thêm ?url => Đây là nguyên tắc khi hoạt động với thằng Vite
import templateFile from "assets/template/user.xlsx?url";

const { Dragger } = Upload;

interface IProps {
    openModelImport: boolean;
    setOpenModelImport: (value: boolean) => void;
    refreshTable: () => void;
}

interface IDataImport {
    fullName: string;
    email: string;
    phone: string;
}

const ImportUser = (props: IProps) => {
    const { openModelImport, setOpenModelImport, refreshTable } = props;

    const { message } = App.useApp();
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv, .xlsx, application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        customRequest({ file, onSuccess }) {
            setTimeout(() => {
                onSuccess && onSuccess("ok");
            }, 1000)
        },

        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;

                    const workbook = new ExcelJS.Workbook();
                    const arrayBuffer = await file.arrayBuffer();
                    await workbook.xlsx.load(arrayBuffer);

                    // Convert file to json
                    let jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(function (sheet) {
                        // Read first row as data keys
                        let firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;

                        let keys = firstRow.values as any[];

                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return;
                            let values = row.values as any;
                            let obj: any = {};
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                            }
                            jsonData.push(obj);
                        })
                    });
                    jsonData = jsonData.map((item, index) => {
                        return { ...item, id: index + 1 };
                    })
                    setDataImport(jsonData);
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },

        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleImport = async () => {
        setIsSubmit(true);
        const dataSubmit = dataImport.map(item => ({
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD
        }))
        const response = await bulkCreateUserAPI(dataSubmit);
        if (response.data) {
            notification.success({
                message: "Bulk Create Users",
                description: `Success = ${response.data.countSuccess}. Error = ${response.data.countError}`
            })
        }
        setIsSubmit(false);
        setOpenModelImport(false);
        setDataImport([]);
        refreshTable();
    }

    return (
        <>
            <Modal
                title="Import User"
                width={"50vw"}
                open={openModelImport}
                onOk={() => handleImport()}
                onCancel={() => {
                    setOpenModelImport(false);
                    setDataImport([]);
                }}
                okText="Import"
                okButtonProps={{
                    disabled: dataImport.length > 0 ? false : true,
                    loading: isSubmit
                }}
                cancelText="Cancel"
                // Do not close when click outside
                maskClosable={false}
                destroyOnClose={true}
            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Only accept .csv, .xls, .xlsx.
                        &nbsp;
                        <a
                            onClick={(e) => e.stopPropagation()} // Bị bug bubble, ngăn chặn việc khi bấm Download Sample File thì Pop up Modal hiển thị lên
                            href={templateFile} download
                        >
                            Download Sample File
                        </a>
                    </p>
                </Dragger>
                <div style={{ paddingTop: 20 }}>
                    <Table
                        rowKey={"id"}
                        title={() => <span>Du lieu upload:</span>}
                        dataSource={dataImport}
                        columns={[
                            { dataIndex: 'fullName', title: 'Ten hien thi' },
                            { dataIndex: 'email', title: 'Email' },
                            { dataIndex: 'phone', title: 'So dien thoai' },
                        ]}
                    />
                </div>
            </Modal>
        </>
    );

}

export default ImportUser;