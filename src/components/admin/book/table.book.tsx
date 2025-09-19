import { deleteBookAPI, getBooksAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, notification, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import DetailBook from './detail.book';
import CreateBook from './create.book';
import UpdateBook from './update.book';


type TSearch = {
    mainText: string,
    author: string,
    price: number,
    createdAt: string,
    createAtRange: string
}

const TableBook = () => {
    const actionRef = useRef<ActionType>();
    const refreshTable = () => {
        actionRef.current?.reload();
    };

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        page: 0,
        total: 0
    });

    // To handle openViewDetail/close Drawer
    const [openViewDetail, setOpenViewDetail] = useState(false);
    // Transfer data from Table to Drawer
    const [dataViewDetail, setdataViewDetail] = useState<IBookTable | null>(null);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [openModalImport, setOpenModalImport] = useState<boolean>(false);
    const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([]);

    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
    // const { message, notification } = App.useApp();

    const handleUpdateModal = (record: IBookTable) => {
        setdataViewDetail(record);
        setOpenModalUpdate(true);
    };

    const handleOpenDrawer = (record: IBookTable) => {
        setdataViewDetail(record);
        setOpenViewDetail(true);
    };

    const handleDeleteBook = async (_id: string) => {
        try {
            const response = await deleteBookAPI(_id);
            if (response && response.data) {
                message.success("Xóa book thành công!");
                refreshTable();
            } else {
                notification.error({
                    message: "Xóa book thất bại!",
                    description: response.message
                });
            }
        } catch (error) {
            message.error("Xóa user thất bại!");
        }
    };


    const columns: ProColumns<IBookTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render: (_, entity) => (
                <a onClick={() => handleOpenDrawer(entity)} href='#'>{entity._id}</a>
            )
        },
        {
            title: 'Tên sách',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            hideInSearch: true,
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            hideInSearch: true,
            sorter: true,
            render: (_, entity) => {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity.price)}
                    </>
                )
            }
        }, {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true
        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(_, entity) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor={"#f57800"}
                            style={{ cursor: "pointer", marginRight: 15 }}
                            onClick={() => handleUpdateModal(entity)}
                        />

                        <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this task?"
                            onConfirm={() => handleDeleteBook(entity._id)}
                            okText="Xác nhận"
                            cancelText="Huỷ"
                            okButtonProps={{ loading: isDeleteUser }}
                        >
                            <span style={{ cursor: "pointer", marginLeft: 20 }}>
                                <DeleteTwoTone
                                    twoToneColor={"#ff4d4f"}
                                    style={{ cursor: "pointer" }}
                                />
                            </span>
                        </Popconfirm>
                    </>
                )
            }
        }
    ];
    return (
        <>
            <ProTable<IBookTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);

                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.mainText) {
                            query += `&fullName=/${params.mainText}/i`;
                        }
                        if (params.author) {
                            query += `&email=/${params.author}/i`;
                        }
                        const createDateRange = dateRangeValidate(params.createAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
                        }
                    }

                    // Default

                    if (sort && sort.createAt) {
                        query += `&sort=${sort.createAt === "ascend" ? "createdAt" : "-createdAt"}`;
                    } else query += `&sort=-createdAt`;

                    if (sort && sort.mainText) {
                        query += `&sort=${sort.mainText === "ascend" ? "mainText" : "-mainText"}`;
                    }

                    if (sort && sort.author) {
                        query += `&sort=${sort.author === "ascend" ? "author" : "-author"}`;
                    }

                    if (sort && sort.price) {
                        query += `&sort=${sort.price === "ascend" ? "price" : "-price"}`;
                    }

                    const res = await getBooksAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        setCurrentDataTable(res.data?.result ?? []);
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }

                }}
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => {
                        return (<div> {range[0]} - {range[1]} trên {total} hàng</div>);
                    },
                    defaultCurrent: 1,
                    defaultPageSize: 20
                }}
                headerTitle="Table book"
                toolBarRender={() => [
                    <Button icon={<ExportOutlined />}
                        type="primary"
                    >
                        <CSVLink
                            data={currentDataTable}
                            filename="export-book.csv">
                            Export
                        </CSVLink>
                    </Button>,

                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => setOpenModalCreate(true)}
                        type="primary"
                    >
                        Add new
                    </Button>
                ]}
            />

            <DetailBook
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setdataViewDetail}
            />

            <CreateBook
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <UpdateBook
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setdataViewDetail}
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
            />

            {/* <ImportUser
                openModelImport={openModalImport}
                setOpenModelImport={setOpenModalImport}
                refreshTable={refreshTable}
            /> */}
        </>
    );
};

export default TableBook;