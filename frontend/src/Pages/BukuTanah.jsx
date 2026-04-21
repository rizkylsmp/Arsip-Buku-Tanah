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
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, ExclamationTriangleIcon } from "@radix-ui/react-icons";

const BukuTanah = () => {
  const [formData, setFormData] = React.useState({
    nomorHak: "",
    namaPemilik: "",
    kecamatan: "",
    desaKelurahan: "",
    jenisBuku: "",
    luasTanah: "",
    tanggalInput: "",
  });

  const [bukuTanahList, setBukuTanahList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);

  // Get user role from localStorage
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  const userRole = profile?.result?.role || "pegawai";
  const isAdmin = userRole === "admin";

  const handleEdit = (row) => {
    setIsEditMode(true);
    setEditingId(row.id_buku);
    setFormData({
      nomorHak: row.nomor_hak || "",
      namaPemilik: row.nama_pemilik || "",
      kecamatan: row.kecamatan || "",
      desaKelurahan: row.desa_kelurahan || "",
      jenisBuku: row.jenis_buku || "",
      luasTanah: row.luas_tanah || "",
      tanggalInput: row.tanggal_input ? row.tanggal_input.split("T")[0] : "",
    });
    setIsAddOpen(true);
  };

  const handleDelete = (row) => {
    setItemToDelete(row);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteBukuTanah(itemToDelete.id_buku);
        await fetchBukuTanah();
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      } catch (error) {
        console.error("Error deleting buku tanah:", error);
        alert("Gagal menghapus data");
      }
    }
  };

  const fetchBukuTanah = async () => {
    try {
      setLoading(true);
      const response = await getBukuTanah();
      // API returns full axios response {data: {data: [...]}}
      if (response.data && response.data.data) {
        setBukuTanahList(response.data.data);
      }
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
        // Update mode - DO NOT send nomor_hak (it's unique and disabled)
        const response = await updateBukuTanah(editingId, {
          nama_pemilik: formData.namaPemilik,
          kecamatan: formData.kecamatan,
          desa_kelurahan: formData.desaKelurahan,
          jenis_buku: formData.jenisBuku,
          luas_tanah: formData.luasTanah,
          tanggal_input: formData.tanggalInput,
        });
        if (response.status === 200) {
          setIsAddOpen(false);
          setIsEditMode(false);
          setEditingId(null);
          setFormData({
            nomorHak: "",
            namaPemilik: "",
            kecamatan: "",
            desaKelurahan: "",
            jenisBuku: "",
            luasTanah: "",
            tanggalInput: "",
          });
          await fetchBukuTanah();
        }
      } else {
        // Create mode - user must input nomor_hak manually
        const response = await createBukuTanah({
          nomor_hak: formData.nomorHak,
          nama_pemilik: formData.namaPemilik,
          kecamatan: formData.kecamatan,
          desa_kelurahan: formData.desaKelurahan,
          jenis_buku: formData.jenisBuku,
          luas_tanah: formData.luasTanah,
          tanggal_input: formData.tanggalInput,
        });
        if (response.status === 201) {
          setIsAddOpen(false);
          setFormData({
            nomorHak: "",
            namaPemilik: "",
            kecamatan: "",
            desaKelurahan: "",
            jenisBuku: "",
            luasTanah: "",
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
    { label: "Nomor Hak", type: "text" },
    { label: "Nama Pemilik", type: "text" },
    { label: "Kecamatan", type: "text" },
    { label: "Desa/Kelurahan", type: "text" },
    { label: "Jenis Buku", type: "text" },
    { label: "Luas Tanah", type: "text" },
    { label: "Tanggal Input", type: "date" },
  ];

  return (
    <div>
      <Header title="BUKU TANAH" input>
        {isAdmin && (
          <Add
            textButton="Tambah Buku Tanah"
            title="Tambah Buku Tanah"
            open={isAddOpen}
            onOpenChange={(open) => {
              if (!open) {
                setIsEditMode(false);
                setEditingId(null);
                setFormData({
                  nomorHak: "",
                  namaPemilik: "",
                  kecamatan: "",
                  desaKelurahan: "",
                  jenisBuku: "",
                  luasTanah: "",
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
              disabledFields={isEditMode ? ["nomorHak"] : []}
              buttonText={isEditMode ? "Update" : "Simpan"}
            />
          </Add>
        )}
      </Header>
      <Table
        data={bukuTanahList}
        columns={[
          { key: "nomor_hak", header: "Nomor Hak" },
          { key: "nama_pemilik", header: "Nama Pemilik" },
          { key: "kecamatan", header: "Kecamatan" },
          { key: "desa_kelurahan", header: "Desa/Kelurahan" },
          { key: "jenis_buku", header: "Jenis Buku" },
          { key: "luas_tanah", header: "Luas Tanah" },
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
        onEdit={isAdmin ? handleEdit : null}
        onDelete={isAdmin ? handleDelete : null}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-overlayShow z-[100]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl w-[90vw] max-w-md z-[101] data-[state=open]:animate-contentShow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <Dialog.Title className="text-lg font-bold text-gray-900 mb-2">
                  Konfirmasi Hapus
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-600 mb-4">
                  Apakah Anda yakin ingin menghapus buku tanah dengan nomor hak{" "}
                  <span className="font-semibold text-gray-900">
                    "{itemToDelete?.nomor_hak}"
                  </span>
                  ? Tindakan ini tidak dapat dibatalkan.
                </Dialog.Description>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setDeleteDialogOpen(false)}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                className="absolute right-3 top-3 inline-flex size-[28px] appearance-none items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all"
                aria-label="Close"
              >
                <Cross2Icon className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default BukuTanah;
