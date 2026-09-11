"use client";

import { useState, useEffect } from "react";
import { Form, Input, Switch, Button, Upload, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Markdown from "./markdown/editor";
const { TextArea } = Input;
const IMAGE_BASE_URL = "/images/item/";

const EditProductForm = ({ initialValues, onFinish, onCancel }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (initialValues && initialValues.images) {
      const initialFileList = initialValues.images.map((image, index) => ({
        uid: `-${index}`,
        name: initialValues.name,
        status: "done",
        url: `${IMAGE_BASE_URL}/${initialValues.id}/${image.name}`,
      }));
      setFileList(initialFileList);
    }
  }, []);

  const handleEditorChange = ({ text }) => {
    form.setFieldsValue({ description: text });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
      style={{
        maxWidth: 800,
        backgroundColor: "#fff",
        padding: "24px",
        borderRadius: "8px",
      }}
    >
      {/* Komponen Tabs Ant Design */}
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
        {/* <TextArea rows={4} placeholder="Tuliskan deskripsi lengkap produk" /> */}
        <Markdown
          // value={form.description}
          handleEditorChange={handleEditorChange}
          name="description"
        />
      </Form.Item>

      <Form.Item
        name="published"
        label="Status Publish"
        valuePropName="checked"
      >
        <Switch checkedChildren="Published" unCheckedChildren="Draft" />
      </Form.Item>
      <Form.Item name="images" label="Gambar Produk" valuePropName="images">
        <Upload
          listType="picture-card"
          fileList={fileList}
          beforeUpload={() => false}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </Form.Item>
      <Form.Item name="metaDescription" label="Meta Description (SEO)">
        <TextArea
          rows={2}
          placeholder="Deskripsi ringkas untuk mesin pencari (Google)"
        />
      </Form.Item>

      <Form.Item name="metaKeywords" label="Meta Keywords (SEO)">
        <Input placeholder="Pisahkan kata kunci dengan koma (misal: sepatu, murah, lari)" />
      </Form.Item>

      <Form.Item label={null}>
        <Space>
          <Button type="primary" htmlType="submit">
            Simpan Perubahan
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default EditProductForm;
