"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Popconfirm,
  message,
  Input,
  Flex,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { deleteProductByID, getProducts } from "@/services/productServices";

export default function Page() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });

  // KOREKSI 1: Ubah urutan parameter menjadi (query, page, limit) agar sesuai dengan cara Anda memanggilnya di bawah
  const fetchProducts = async (query = "", page = 1, limit = 10) => {
    setLoading(true);
    try {
      const { products, totalProduct } = await getProducts({
        page,
        limit,
        query,
      });

      setProducts(products);
      setTableParams({
        pagination: {
          current: page,
          pageSize: limit,
          total: totalProduct,
        },
      });
    } catch (error) {
      console.error("Gagal fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await deleteProductByID(productId);

      if (response.success) {
        message.success("Produk berhasil dihapus secara permanen!");
        // KOREKSI 2: Gunakan tableParams.pagination.current dan pertahankan parameter query
        fetchProducts(
          searchText,
          tableParams.pagination.current,
          tableParams.pagination.pageSize,
        );
      } else {
        message.error("Gagal menghapus produk.");
        console.log(response);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      message.error("Gagal terhubung ke server.");
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchText, 1, tableParams.pagination.pageSize);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const handleTableChange = (pagination) => {
    fetchProducts(searchText, pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      title: "No",
      key: "number",
      width: 70,
      align: "center",
      // KOREKSI 3: Gunakan tableParams.pagination karena 'pagination' tidak ada di scope ini
      render: (_, __, index) =>
        (tableParams.pagination.current - 1) * tableParams.pagination.pageSize +
        index +
        1,
    },
    {
      title: "Nama Produk",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "published",
      key: "published",
      render: (published) => (
        <Tag color={published ? "green" : "volcano"}>
          {published ? "Published" : "Draft"}
        </Tag>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Link href={`/dashboard/products/edit/${record.id}`}>
            <Button type="primary" icon={<EditOutlined />} size="small">
              Edit
            </Button>
          </Link>
          <Popconfirm
            title="Hapus Produk?"
            description="Produk dan semua gambar akan terhapus secara permanen. Yakin?"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Ya, Hapus"
            cancelText="Batal"
            okButtonProps={{ danger: true }}
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Flex
        gap="medium"
        justify="space-between"
        align="center"
        style={{ marginBottom: 16 }}
      >
        <Link href={`/dashboard/products/create`}>
          <Button type="primary" style={{ marginBottom: 10 }}>
            Tambah Produk
          </Button>
        </Link>
        <Input
          size="large"
          placeholder="Cari nama produk..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
          style={{ width: 300 }}
        />
      </Flex>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={products}
        loading={loading}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
        bordered
      />
    </div>
  );
}
