"use client";

import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Switch,
  Button,
  Upload,
  Space,
  message,
  Modal,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Markdown from "./markdown/editor";
import { updateProductByID } from "@/services/productServices";
const { TextArea } = Input;
const IMAGE_BASE_URL = "/images/item/";

const EditProductForm = ({ initialValues }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {
    const formData = new FormData();

    // Masukkan data teks biasa ke FormData
    formData.append("name", values.name);
    formData.append("tag", values.tag || "");
    formData.append("description", values.description || "");
    formData.append("published", values.published ? "true" : "false");
    formData.append("metaDescription", values.metaDescription || "");
    formData.append("metaKeywords", values.metaKeywords || "");

    fileList.forEach((file) => {
      if (file.originFileObj) {
        // Ini adalah file baru yang di-upload user
        formData.append("newImages", file.originFileObj);
      } else if (file.url) {
        // Ini adalah gambar lama yang dipertahankan.
        // Kita ekstrak HANYA nama filenya saja dari URL
        const fileName = file.url.split("/").pop();
        formData.append("keptImages", fileName);
      }
    });
    // Lakukan fetch ke API dengan method PUT
    const response = await updateProductByID({
      id: initialValues.id,
      formData,
    });

    if (response.success) {
      message.success("Produk berhasil diperbarui!");
    } else {
      message.error(errorData.error || "Gagal memperbarui produk.");
    }
  };
  useEffect(() => {
    if (initialValues && initialValues.images) {
      const initialFileList = initialValues.images.map((image, index) => ({
        id: image.id,
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

  const onRemove = async (imageId) => {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: "Konfirmasi Hapus Gambar",
        content:
          "Apakah Anda yakin ingin menghapus gambar ini? Gambar akan terhapus secara permanen.",
        okText: "Ya, Hapus",
        okType: "danger",
        cancelText: "Batal",
        centered: true,
        mask: { closable: true },
        onOk: async () => {
          try {
            if (file.url) {
              const res = await fetch(`/api/images/${imageId.id}`, {
                method: "DELETE",
              });

              if (!res.ok)
                throw new Error("Gagal menghapus gambar dari server");
              message.success("Gambar berhasil dihapus!");
            }
            // Resolve akan menghapus gambar dari tampilan UI (fileList)
            resolve(true);
          } catch (error) {
            message.error(error.message);
            reject(false); // Reject akan membatalkan penghapusan di UI
          }
        },
        onCancel: () => {},
      });
    });
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
          onChange={({ fileList }) => setFileList(fileList)}
          onRemove={(data) => onRemove(data)}
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
