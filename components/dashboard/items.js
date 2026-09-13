import {
  ShoppingCartOutlined,
  AppstoreOutlined,
  TagsOutlined,
  UsergroupAddOutlined,
  PictureOutlined,
  ShopOutlined,
  UserSwitchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Link from "next/link";
const items = [
  {
    key: "1",
    icon: <ShoppingCartOutlined />,
    label: <Link href="/dashboard/products">Products</Link>,
  },

  {
    key: "2",
    icon: <AppstoreOutlined />,
    label: <Link href="/dashboard/categories">Categories</Link>,
  },

  {
    key: "3",
    icon: <TagsOutlined />,
    label: <Link href="/dashboard/brands">Brands</Link>,
  },

  {
    key: "4",
    icon: <UsergroupAddOutlined />,
    label: <Link href="/dashboard/clients">Client</Link>,
  },
  {
    key: "5",
    icon: <ShopOutlined />,
    label: <Link href="/dashboard/vendors">Vendor</Link>,
  },
  {
    key: "6",
    icon: <PictureOutlined />,
    label: <Link href="/dashboard/banners">Banner</Link>,
  },
  {
    key: "7",
    icon: <UserSwitchOutlined />,
    label: <Link href="/dashboard/employees">Employees</Link>,
  },
  {
    key: "78",
    icon: <TeamOutlined />,
    label: <Link href="/dashboard/roles">Role</Link>,
  },
];

export default items;
