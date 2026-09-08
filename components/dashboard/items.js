import {
  ShoppingCartOutlined,
  AppstoreOutlined,
  TagsOutlined,
  UsergroupAddOutlined,
  PictureOutlined,
  ShopOutlined,
  UserSwitchOutlined,
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
    label: <Link href="/dashboard/categorie">Categories</Link>,
  },

  {
    key: "3",
    icon: <TagsOutlined />,
    label: <Link href="/dashboard/brand">Brands</Link>,
  },

  {
    key: "4",
    icon: <UsergroupAddOutlined />,
    label: <Link href="/dashboard/client">Client</Link>,
  },
  {
    key: "5",
    icon: <ShopOutlined />,
    label: <Link href="/dashboard/vendor">Vendor</Link>,
  },
  {
    key: "6",
    icon: <PictureOutlined />,
    label: <Link href="/dashboard/banner">Banner</Link>,
  },
  {
    key: "7",
    icon: <UserSwitchOutlined />,
    label: <Link href="/dashboard/employe">Employe</Link>,
  },
];

export default items;
