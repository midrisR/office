"use client";
import { useState } from "react";
import { Breadcrumb, Layout, Menu, theme } from "antd";
const { Header, Content, Footer, Sider } = Layout;
import items from "./items";

export default function Dashboard({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [key, setKey] = useState(["1"]);

  return (
    <Layout style={{ minHeight: "100vh" }} theme="light">
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="min-h-8 rounded m-4 bg-gray-100 p-4">DASHBOARD</div>

        <Menu
          selectedKeys={key}
          // openKeys={["1"]}
          mode="inline"
          items={items}
          onSelect={({ key, keyPath, selectedKeys, domEvent }) =>
            setKey(selectedKeys)
          }
        />
      </Sider>
      <Layout style={{ background: "#f4f6f9" }}>
        <Header style={{ padding: 0, backgroundColor: "#ffffff" }} />
        <Content style={{ margin: "0 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}
