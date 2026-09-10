'use client'

import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function Page () {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Inisialisasi state pagination dengan objek yang lengkap
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0, // PENTING: Antd butuh total data untuk mengaktifkan tombol Next
  });

  // 2. Fungsi fetch data ke backend
  const fetchProducts = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      // Panggil API Backend
      const response = await fetch(`/api/products?page=${page}&limit=${pageSize}`);
      const result = await response.json();

      // Set data produk
      setProducts(result.data);

      // PENTING: Update state pagination dengan data dari backend
      setPagination({
        current: page,
        pageSize: pageSize,
        total: result.total, // backend HARUS mengembalikan total data (misal: prisma.products.count())
      });
    } catch (error) {
      console.error('Gagal fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(pagination.current, pagination.pageSize);
  }, []);

  // 3. Handler saat tombol Next / Nomor Halaman diklik
  const handleTableChange = (newPagination) => {
    fetchProducts(newPagination.current, newPagination.pageSize);
  };

  // 4. Definisi Kolom Tabel
  const columns = [
    {
      title: 'No',
      key: 'number',
      width: 70,
      align: 'center',
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'Nama Produk',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'published',
      key: 'published',
      render: (published) => (
        <Tag color={published ? 'green' : 'volcano'}>
          {published ? 'Published' : 'Draft'}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Link href={`/dashboard/products/edit/${record.id}`}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
            >
              Edit
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={products}
        loading={loading}
        // Kirimkan konfigurasi pagination & handler event-nya
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true, // Menampilkan opsi jumlah row per halaman (10, 20, 50)
        }}
        onChange={handleTableChange}
        bordered
      />
    </div>
  );
};
