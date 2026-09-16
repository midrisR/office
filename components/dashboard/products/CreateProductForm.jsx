"use client";

import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Switch,
  Button,
  Upload,
  Flex,
  message,
  Space,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Markdown from "./markdown/editor"; // Sesuaikan path ini dengan struktur folder Anda
import { createProducts } from "@/services/productServices";

const { TextArea } = Input;

const CreateProductForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [select, setSelect] = useState([]);
  const [validate, setValidate] = useState(null);
  const getAllBrands = async () => {
    try {
      const response = await fetch("/api/brands");
      if (!response.ok) {
        throw new Error("Gagal mengambil data brand");
      }
      const { data } = await response.json();
      return data; // Mengembalikan data brand
    } catch (error) {
      console.error("Error fetching brands:", error);
      return []; // Mengembalikan array kosong jika terjadi error
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Gagal mengambil data kategori");
      }
      const { data } = await response.json();
      return data; // Mengembalikan data kategori
    } catch (error) {
      console.error("Error fetching categories:", error);
      return []; // Mengembalikan array kosong jika terjadi error
    }
  };
  const getAllData = async () => {
    const [brands, categories] = await Promise.all([
      getAllBrands(),
      getAllCategories(),
    ]);
    return { brands, categories };
  };

  useEffect(() => {
    getAllData()
      .then((data) => {
        setSelect(data); // Menyimpan data brand dan kategori ke state select
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, []);

  // Sinkronisasi data dari komponen Markdown ke Form Ant Design
  const handleEditorChange = ({ text }) => {
    form.setFieldsValue({ description: text });
  };

  // Fungsi saat form disubmit
  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();

    // 1. Masukkan data teks ke FormData
    formData.append("name", values.name);
    formData.append("tag", values.tag || "");
    formData.append("description", values.description || "");
    // Konversi nilai boolean menjadi string untuk dikirim via FormData
    formData.append("published", values.published ? "true" : "false");
    formData.append("metaDescription", values.metaDescription || "");
    formData.append("metaKeywords", values.metaKeywords || "");

    // Tambahan jika Anda menggunakan input untuk relasi kategori/brand
    if (values.categorieId) formData.append("categorieId", values.categorieId);
    if (values.brandId) formData.append("brandId", values.brandId);

    // 2. Masukkan file gambar fisik ke FormData
    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("images", file.originFileObj);
      }
    });

    try {
      const response = await createProducts(formData);

      console.log(response);

      if (response.success) {
        console.log(response);
        message.success("Produk berhasil ditambahkan!");
        form.resetFields(); // Kosongkan form setelah sukses
        setFileList([]); // Kosongkan daftar gambar
      } else {
        console.log("error");
      }
    } catch (error) {
      message.error("Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        published: false, // Default value untuk switch
      }}
      style={{
        maxWidth: 800,
        backgroundColor: "#fff",
        padding: "24px",
        borderRadius: "8px",
      }}
    >
      <Form.Item name="name" label="Nama Produk">
        <Input placeholder="Masukkan nama produk" />
      </Form.Item>

      <Form.Item name="tag" label="Tag Produk">
        <Input placeholder="Contoh: Elektronik, Diskon, Sepatu" />
      </Form.Item>

      {/* --- BAGIAN SELECT KATEGORI DAN BRAND --- */}
      <Flex gap={12} vertical>
        <Flex gap={8}>
          <Form.Item name="categorieId" label="Kategori" style={{ flex: 1 }}>
            <Select
              showSearch={{
                filterOption: (input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase()),
              }}
              placeholder="Pilih Kategori"
              options={select.categories?.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </Form.Item>

          <Form.Item name="brandId" label="Brand" style={{ flex: 1 }}>
            <Select
              showSearch // Mengaktifkan fitur ketik untuk mencari
              placeholder="Pilih Brand"
              options={select.brands?.map((brand) => ({
                label: brand.name,
                value: brand.id,
              }))}
            />
          </Form.Item>
        </Flex>
      </Flex>

      <Form.Item name="description" label="Deskripsi Produk">
        <Markdown handleEditorChange={handleEditorChange} name="description" />
      </Form.Item>

      <Form.Item
        name="published"
        label="Status Publish"
        valuePropName="checked"
      >
        <Switch checkedChildren="Published" unCheckedChildren="Draft" />
      </Form.Item>

      <Form.Item label="Gambar Produk">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={({ fileList: newFileList }) => setFileList(newFileList)}
          beforeUpload={() => false} // Mencegah upload otomatis, agar kita yang handle via fetch
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
          <Button type="primary" htmlType="submit" loading={loading}>
            Buat Produk
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CreateProductForm;
