"use client";

import { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Switch, message } from "antd";
import RichTextEditor from "@/components/editor/RichTextEditor";
const FormModal = ({ isOpen, onClose, initialData, refreshData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const isEditMode = !!initialData;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        form.setFieldsValue({
          title: initialData.title,
          description: initialData.description,
          published: initialData.published,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ published: false, description: "" });
      }
      setValidationErrors({});
    }
  }, [isOpen, initialData, form, isEditMode]);

  const onFinish = async (values) => {
    setLoading(true);
    setValidationErrors({});

    const apiUrl = isEditMode ? `/api/abouts/${initialData.id}` : "/api/abouts";
    const apiMethod = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(apiUrl, {
        method: apiMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok) {
        message.success(
          `Data berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}`,
        );
        form.resetFields();
        onClose();
        refreshData();
      } else if (response.status === 422) {
        setValidationErrors(result.error);
      } else {
        message.error(result.error || "Gagal menyimpan data");
      }
    } catch (error) {
      message.error("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };
  const handleEditorChange = (editor) => {
    form.setFieldsValue({ description: editor });
  };
  return (
    <Modal
      title={isEditMode ? "Edit Profil (About)" : "Tambah Profil (About)"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={1200}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Judul"
          validateStatus={validationErrors.title ? "error" : ""}
          help={validationErrors.title}
        >
          <Input placeholder="Masukkan judul" size="large" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Deskripsi"
          help={validationErrors?.description}
          validateStatus={validationErrors?.description && "error"}
          hasFeedback
        >
          <RichTextEditor
            onChange={handleEditorChange}
            placeholder="Tulis isi artikel di sini..."
            minHeight="400px"
          />
        </Form.Item>

        <Form.Item
          name="published"
          label="Status Publish"
          valuePropName="checked"
        >
          <Switch checkedChildren="Published" unCheckedChildren="Draft" />
        </Form.Item>

        <Form.Item className="mb-0 flex justify-end mt-6">
          <Button onClick={onClose} className="mr-2" size="large">
            Batal
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
          >
            Simpan
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormModal;
