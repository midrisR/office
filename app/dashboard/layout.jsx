import Dashboard from "@/components/dashboard";
import { AntdRegistry } from "@ant-design/nextjs-registry";
export default function DashboardLayout({ children }) {
  return (
    <AntdRegistry>
      <Dashboard>{children}</Dashboard>
    </AntdRegistry>
  );
}
