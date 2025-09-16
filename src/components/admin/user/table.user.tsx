import { getUsersAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import DetailUser from './detail.user';
import CreateUser from './create.user';
import ImportUser from './data/import.user';
import { CSVLink } from 'react-csv';

type TSearch = {
    fullName: string,
    email: string,
    createdAt: string,
    createAtRange: string
}

const TableUser = () => {
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
    const [dataViewDetail, setdataViewDetail] = useState<IUserTable | null>(null);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [openModalImport, setOpenModalImport] = useState<boolean>(false);
    const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);



    const handleOpenDrawer = (record: IUserTable) => {
        setdataViewDetail(record);
        setOpenViewDetail(true);
    };

    const columns: ProColumns<IUserTable>[] = [
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
            title: 'FullName',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
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
            title: 'Action',
            hideInSearch: true,
            render(_) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor={"#f57800"}
                            style={{ cursor: "pointer", marginRight: 15 }}
                            onClick={() => setOpenModalUpdate(true)}
                        />
                        <DeleteTwoTone
                            twoToneColor={"#ff4d4f"}
                            style={{ cursor: "pointer" }}
                        />
                    </>
                )
            }
        }
    ];
    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);

                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`;
                        }
                        if (params.email) {
                            query += `&email=/${params.email}/i`;
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


                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`;
                    }

                    const res = await getUsersAPI(query);
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
                headerTitle="Table user"
                toolBarRender={() => [
                    <Button icon={<ExportOutlined />}
                        type="primary"
                    >
                        <CSVLink
                            data={currentDataTable}
                            filename="export-user.csv">
                            Export
                        </CSVLink>
                    </Button>,

                    <Button icon={<CloudUploadOutlined />}
                        onClick={() => setOpenModalImport(true)}
                        type="primary"
                    >Import
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

            <DetailUser
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setdataViewDetail}
            />

            <CreateUser
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <ImportUser
                openModelImport={openModalImport}
                setOpenModelImport={setOpenModalImport}
                refreshTable={refreshTable}
            />
        </>
    );
};

export default TableUser;