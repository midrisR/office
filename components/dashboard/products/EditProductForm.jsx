"use client";
import React from "react";
import { Form, Input, Switch, Button, Tabs, Upload, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const EditProductForm = ({ initialValues, onFinish, onCancel }) => {
  const [form] = Form.useForm();

  // Tab 1: Informasi Dasar Produk
  const basicInfoTab = (
    <>
      <Form.Item
        name="name"
        label="Nama Produk"
        rules={[{ required: true, message: "Nama produk wajib diisi" }]}
      >
        <Input placeholder="Masukkan nama produk" />
      </Form.Item>

      <Form.Item name="tag" label="Tag Produk">
        <Input placeholder="Contoh: Elekronik, Diskon, Sepatu" />
      </Form.Item>

      <Form.Item name="description" label="Deskripsi Produk">
        <TextArea rows={4} placeholder="Tuliskan deskripsi lengkap produk" />
      </Form.Item>

      <Form.Item
        name="published"
        label="Status Publish"
        valuePropName="checked"
      >
        <Switch checkedChildren="Published" unCheckedChildren="Draft" />
      </Form.Item>
    </>
  );

  // Tab 2: Upload Gambar
  const imagesTab = (
    <Form.Item name="images" label="Gambar Produk" valuePropName="images">
      <Upload listType="picture-card" beforeUpload={() => false}>
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      </Upload>
    </Form.Item>
  );

  // Tab 3: SEO & Meta Data
  const seoTab = (
    <>
      <Form.Item name="metaDescription" label="Meta Description (SEO)">
        <TextArea
          rows={3}
          placeholder="Deskripsi ringkas untuk mesin pencari (Google)"
        />
      </Form.Item>

      <Form.Item name="metaKeywords" label="Meta Keywords (SEO)">
        <Input placeholder="Pisahkan kata kunci dengan koma (misal: sepatu, murah, lari)" />
      </Form.Item>
    </>
  );

  // Konfigurasi Item Tabs Ant Design (Versi v5 API)
  const tabItems = [
    {
      key: "1",
      label: "Informasi Umum",
      children: basicInfoTab,
    },
    {
      key: "2",
      label: "Gambar Produk",
      children: imagesTab,
    },
    {
      key: "3",
      label: "SEO / Meta",
      children: seoTab,
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      {/* Komponen Tabs Ant Design */}
      <Tabs defaultActiveKey="1" items={tabItems} />

      <Space
        style={{ marginTop: 24, justifyContent: "flex-end", width: "100%" }}
      >
        <Button onClick={onCancel}>Batal</Button>
        <Button type="primary" htmlType="submit">
          Simpan Perubahan
        </Button>
      </Space>
    </Form>
  );
};

export default EditProductForm;
