import { FORMATE_DATE_VN } from "@/services/helper";
import Avatar from "antd/lib/avatar";
import Badge from "antd/lib/badge";
import Descriptions from "antd/lib/descriptions";
import Drawer from "antd/lib/drawer";
import dayjs from "dayjs";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (openViewDetail: boolean) => void;
    dataViewDetail: IUserTable | null;
    setDataViewDetail: (dataViewDetail: IUserTable | null) => void;
}

const DetailUser = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    const avatarURL = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataViewDetail?.avatar}`;
    return (
        <>
            <Drawer
                closable
                title={`Thông tin User ${dataViewDetail?._id}`}
                width={"50vw"}
                placement="right"
                open={openViewDetail}
                onClose={onClose}
            >
                {dataViewDetail && (
                    <>
                        <Descriptions title="User Info" layout='vertical' column={1} bordered>
                            <Descriptions.Item label="Id">{dataViewDetail._id}</Descriptions.Item>
                            <Descriptions.Item label="Fullname">{dataViewDetail.fullName}</Descriptions.Item>
                            <Descriptions.Item label="Role">
                                <Badge status="processing" text={dataViewDetail.role} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Avatar">
                                <Avatar size={40} src={avatarURL}></Avatar>
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">{dataViewDetail.email}</Descriptions.Item>
                            <Descriptions.Item label="Phone">{dataViewDetail.phone}</Descriptions.Item>
                            <Descriptions.Item label="Created At">{dayjs(dataViewDetail.createdAt).format(FORMATE_DATE_VN)}</Descriptions.Item>
                            <Descriptions.Item label="Updated At">{dayjs(dataViewDetail.updatedAt).format(FORMATE_DATE_VN)}</Descriptions.Item>
                        </Descriptions>
                    </>
                )}
            </Drawer>
        </>
    );
}

export default DetailUser;