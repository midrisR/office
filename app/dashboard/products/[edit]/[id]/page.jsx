"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import EditProductForm from "@/components/dashboard/products/EditProductForm";
export default function Page() {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      // Panggil API Backend
      const response = await fetch(`/api/products/${id}`);
      const { data } = await response.json();
      console.log(data);

      // Set data produk
      setProduct(data);
    } catch (error) {
      console.error("Gagal fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);
  if (loading) {
    return <div>loading</div>;
  }
  return (
    <div>
      <EditProductForm initialValues={product} onFinish={onFinish} />
    </div>
  );
}
