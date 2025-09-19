import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Space } from "antd";
import { Color } from "antd/es/color-picker";
import { Content } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import React from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";


const AdminDashBoard = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            <Layout
                style={{ minHeight: '100vh', backgroundColor: "black" }}
                className="layout-admin"
            >
                <Sider
                    theme='light'
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}>
                    <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                        Admin
                    </div>
                </Sider>

            </Layout>
        </>
    );

}

export default AdminDashBoard;