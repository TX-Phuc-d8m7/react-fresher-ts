import { Button, Result } from "antd";
import { userCurrentApp } from "components/context/app.context";

interface IProps {
    children: React.ReactNode
}
const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated } = userCurrentApp();
    if (isAuthenticated === false) {
        return (
            <Result
                status="403"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary">Back Home</Button>} />
        )
    }
    return (
        <>
            {props.children}
        </>
    )
}

export default ProtectedRoute;