"use client";

import { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Switch, message } from "antd";
<<<<<<< HEAD
import RichTextEditor from "@/components/editor/RichTextEditor";
=======
import TiptapEditor from "@/components/tiptap/editor"; // Sesuaikan path sesuai lokasi file TiptapEditor Anda
>>>>>>> 2e424394df13a777425261fb2a855b209f4bd35d

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
    let cleanedDescription = values.description;

    // 2. Bersihkan kode kotor jika deskripsi tidak kosong
    if (cleanedDescription) {
      // Ganti semua &nbsp; menjadi spasi biasa
      cleanedDescription = cleanedDescription.replace(/&nbsp;/g, " ");

      // (Opsional) Hapus tag paragraf kosong <p></p> yang terlihat di gambar
      cleanedDescription = cleanedDescription.replace(/<p><\/p>/g, "");
    }

    const payloadToSave = {
      ...values,
      description: cleanedDescription,
    };
    const apiUrl = isEditMode ? `/api/abouts/${initialData.id}` : "/api/abouts";
    const apiMethod = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(apiUrl, {
        method: apiMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadToSave),
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
<<<<<<< HEAD
  const handleEditorChange = (editor) => {
    form.setFieldsValue({ description: editor });
  };
=======

>>>>>>> 2e424394df13a777425261fb2a855b209f4bd35d
  return (
    <Modal
      title={isEditMode ? "Edit Profil (About)" : "Tambah Profil (About)"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={800}
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
<<<<<<< HEAD
          label="description"
          validateStatus={validationErrors.description ? "error" : ""}
          help={validationErrors.description}
        >
          {/* <QuillEditor /> */}
          <RichTextEditor
            onChange={handleEditorChange}
            placeholder="Tulis isi artikel di sini..."
            minHeight="400px"
          />
        </Form.Item>
=======
          label="Deskripsi"
          help={validationErrors?.description}
          validateStatus={validationErrors?.description && "error"}
          hasFeedback
        >
          {/* Ant Design Form akan otomatis mengalirkan prop 'value' dan 'onChange' ke TiptapEditor */}
          <TiptapEditor />
        </Form.Item>

>>>>>>> 2e424394df13a777425261fb2a855b209f4bd35d
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
