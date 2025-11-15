import React from "react";
import Header from "../Components/Tools/Header";
import Add from "../Components/Tools/Add";
import Form from "../Components/Tools/Form";
import Table from "../Components/Tools/Table";
import {
  getBukuTanah,
  createBukuTanah,
  updateBukuTanah,
  deleteBukuTanah,
} from "../api/bukuTanahApi";
import { Badge } from "@radix-ui/themes";

const BukuTanah = () => {
  const [formData, setFormData] = React.useState({
    kodeBuku: "",
    namaPemilik: "",
    kecamatan: "",
    jenisBuku: "",
    tanggalInput: "",
  });

  const [bukuTanahList, setBukuTanahList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);

  const handleEdit = (row) => {
    console.log("Edit buku:", row);
    setIsEditMode(true);
    setEditingId(row.id_buku);
    setFormData({
      kodeBuku: row.kode_buku || "",
      namaPemilik: row.nama_pemilik || "",
      kecamatan: row.kecamatan || "",
      jenisBuku: row.jenis_buku || "",
      tanggalInput: row.tanggal_input ? row.tanggal_input.split("T")[0] : "",
    });
    setIsAddOpen(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Hapus buku "${row.kode_buku}"?`)) {
      try {
        await deleteBukuTanah(row.id_buku);
        await fetchBukuTanah();
      } catch (error) {
        console.error("Error deleting buku tanah:", error);
      }
    }
  };

  const fetchBukuTanah = async () => {
    try {
      setLoading(true);
      const response = await getBukuTanah();
      console.log("Response dari API:", response);
      setBukuTanahList(response.data);
      console.log("Data yang disimpan di state:", response.data);
    } catch (error) {
      console.error("Error fetching buku tanah:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBukuTanah();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isEditMode && editingId) {
        // Update mode - DO NOT send kode_buku (it's unique and disabled)
        const response = await updateBukuTanah(editingId, {
          nama_pemilik: formData.namaPemilik,
          kecamatan: formData.kecamatan,
          jenis_buku: formData.jenisBuku,
          tanggal_input: formData.tanggalInput,
        });
        if (response.status === 200) {
          setIsAddOpen(false);
          setIsEditMode(false);
          setEditingId(null);
          setFormData({
            kodeBuku: "",
            namaPemilik: "",
            kecamatan: "",
            jenisBuku: "",
            tanggalInput: "",
          });
          await fetchBukuTanah();
        }
      } else {
        // Create mode
        const response = await createBukuTanah({
          kode_buku: formData.kodeBuku,
          nama_pemilik: formData.namaPemilik,
          kecamatan: formData.kecamatan,
          jenis_buku: formData.jenisBuku,
          tanggal_input: formData.tanggalInput,
        });
        if (response.status === 201) {
          setIsAddOpen(false);
          setFormData({
            kodeBuku: "",
            namaPemilik: "",
            kecamatan: "",
            jenisBuku: "",
            tanggalInput: "",
          });
          await fetchBukuTanah();
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Terjadi kesalahan";
      alert(`Error: ${errorMessage}`);
      console.error("Error submitting data:", error);
    }
  };

  const field = [
    { label: "Kode Buku", type: "text" },
    { label: "Nama Pemilik", type: "text" },
    { label: "Kecamatan", type: "text" },
    { label: "Jenis Buku", type: "text" },
    { label: "Tanggal Input", type: "date" },
  ];

  return (
    <div>
      <Header title="BUKU TANAH" input>
        <Add
          textButton={isEditMode ? "Edit Buku Tanah" : "Tambah Buku Tanah"}
          title={isEditMode ? "Edit Buku Tanah" : "Tambah Buku Tanah"}
          open={isAddOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsEditMode(false);
              setEditingId(null);
              setFormData({
                kodeBuku: "",
                namaPemilik: "",
                kecamatan: "",
                jenisBuku: "",
                tanggalInput: "",
              });
            }
            setIsAddOpen(open);
          }}
        >
          <Form
            fields={field}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            disabledFields={isEditMode ? ["kodeBuku"] : []}
            buttonText={isEditMode ? "Update" : "Simpan"}
          />
        </Add>
      </Header>
      <Table
        data={bukuTanahList}
        columns={[
          { key: "kode_buku", header: "Kode Buku" },
          { key: "nama_pemilik", header: "Nama Pemilik" },
          { key: "kecamatan", header: "Kecamatan" },
          { key: "jenis_buku", header: "Jenis Buku" },
          {
            key: "tanggal_input",
            header: "Tanggal Input",
            render: (row) => {
              const date = new Date(row.tanggal_input);
              return date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
            },
          },
          {
            key: "Petugas",
            header: "Petugas",
            render: (row) => row.Petugas?.nama || "-",
          },
          {
            key: "status",
            header: "Status",
            render: (row) => (
              <Badge color={row.status === "tersedia" ? "green" : "red"}>
                {row.status}
              </Badge>
            ),
          },
        ]}
        rowsPerPage={10}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default BukuTanah;
