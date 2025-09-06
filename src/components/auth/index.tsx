import { Button, Result } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useCurrentApp } from "../context/app.context";

interface IProps {
    children: React.ReactNode
}
const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp();
    const location = useLocation();
    console.log('location: ', location.pathname);
    if (isAuthenticated === false) {
        return (
            <Result
                status="404"
                title="Not Login"
                subTitle="Bạn vui lòng đăng nhập để sử dụng tính năng này."
                extra={<Button type="primary"><Link to="/login">Đăng nhập</Link></Button>} />
        )
    }

    const isAdminRoute = location.pathname.includes('/admin');
    if (isAuthenticated === true && isAdminRoute === true) {
        const role = user?.role;
        if (role !== 'ADMIN') {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Bạn không có quyền truy cập trang này."
                    extra={<Button type="primary"><Link to="/">Quay lại trang chủ</Link></Button>} />
            )
        }
    }

    return (
        <>
            {props.children}
        </>
    )
}

export default ProtectedRoute;