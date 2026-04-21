import React from "react";
import Header from "../Components/Tools/Header";
import Add from "../Components/Tools/Add";
import Form from "../Components/Tools/Form";
import Table from "../Components/Tools/Table";
import {
  getPeminjaman,
  createPeminjaman,
  updatePeminjaman,
  deletePeminjaman,
} from "../api/peminjamanApi";
import { getPetugas } from "../api/petugasApi";
import { getAvailableBukuTanah } from "../api/bukuTanahApi";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, ExclamationTriangleIcon } from "@radix-ui/react-icons";

const Peminjaman = () => {
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [peminjamanList, setPeminjamanList] = React.useState([]);
  const [petugasList, setPetugasList] = React.useState([]);
  const [bukuTanahList, setBukuTanahList] = React.useState([]);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [loggedInPetugas, setLoggedInPetugas] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [formData, setFormData] = React.useState({
    idPetugas: "",
    namaPetugas: "",
    idBuku: "",
    tanggalPinjam: "",
    keterangan: "",
  });

  React.useEffect(() => {
    // Get logged-in petugas from localStorage
    const profile = localStorage.getItem("profile");
    if (profile) {
      try {
        const parsedProfile = JSON.parse(profile);

        const petugasData = {
          id: parsedProfile.result?.id,
          nama: parsedProfile.result?.name,
        };
        setLoggedInPetugas(petugasData);
        // Set default petugas to logged-in user
        setFormData((prev) => {
          return {
            ...prev,
            idPetugas: petugasData.id || "",
            namaPetugas: petugasData.nama || "",
          };
        });
      } catch (error) {
        console.error("Error parsing profile:", error);
      }
    }

    fetchPeminjaman();
    fetchPetugas();
    fetchBukuTanah();
  }, []);

  const fetchPeminjaman = async () => {
    setLoading(true);
    try {
      const response = await getPeminjaman();
      if (response.data && response.data.data) {
        const formattedData = response.data.data.map((item) => {
          return {
            id_pinjam: item.id_pinjam,
            kode_peminjaman: item.kode_peminjaman,
            nama_peminjam: item.Petugas?.nama,
            kode_buku: item.BukuTanah?.nomor_hak,
            nama_pemilik: item.BukuTanah?.nama_pemilik,
            tanggal_pinjam: item.tanggal_pinjam,
            keterangan: item.keterangan,
            id_petugas: item.id_petugas,
            id_buku: item.id_buku,
          };
        });
        setPeminjamanList(formattedData);
      }
    } catch (error) {
      console.error("Error fetching peminjaman:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPetugas = async () => {
    try {
      const response = await getPetugas();
      if (response.data && response.data.data) {
        setPetugasList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching petugas:", error);
    }
  };

  const fetchBukuTanah = async () => {
    try {
      // Fetch only available books (not borrowed)
      const response = await getAvailableBukuTanah();
      if (response.data && response.data.data) {
        setBukuTanahList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching buku tanah:", error);
    }
  };

  const fields = [
    {
      label: "Nama Petugas",
      type: "text",
      disabled: true,
    },
    {
      label: "Id Buku",
      type: "select",
      options: bukuTanahList.map((b) => ({
        value: b.id_buku,
        label: `${b.nomor_hak} - ${b.nama_pemilik}`,
      })),
    },
    { label: "Tanggal Pinjam", type: "date" },
    { label: "Keterangan", type: "textarea" },
  ];

  const columns = [
    { key: "kode_peminjaman", header: "Kode Peminjaman" },
    { key: "nama_peminjam", header: "Nama Peminjam" },
    { key: "kode_buku", header: "Nomor Hak" },
    { key: "nama_pemilik", header: "Nama Pemilik" },
    { key: "tanggal_pinjam", header: "Tanggal Pinjam" },
    { key: "keterangan", header: "Keterangan" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isEditMode && editingId) {
        // Update mode
        const response = await updatePeminjaman(editingId, {
          id_petugas: formData.idPetugas,
          id_buku: formData.idBuku,
          tanggal_pinjam: formData.tanggalPinjam,
          keterangan: formData.keterangan,
        });
        if (response.status === 200) {
          setIsAddOpen(false);
          setIsEditMode(false);
          setEditingId(null);
          resetForm();
          await fetchPeminjaman();
          await fetchBukuTanah(); // Refresh to update status
        }
      } else {
        // Create mode - kode_peminjaman will be auto-generated by backend
        const payload = {
          id_petugas: formData.idPetugas,
          id_buku: formData.idBuku,
          tanggal_pinjam: formData.tanggalPinjam,
          keterangan: formData.keterangan,
        };
        const response = await createPeminjaman(payload);
        if (response.status === 201) {
          setIsAddOpen(false);
          resetForm();
          await fetchPeminjaman();
          await fetchBukuTanah(); // Refresh to update status
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Terjadi kesalahan";
      alert(`Error: ${errorMessage}`);
      console.error("Error submitting data:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      idPetugas: loggedInPetugas?.id || "",
      namaPetugas: loggedInPetugas?.nama || "",
      idBuku: "",
      tanggalPinjam: "",
      keterangan: "",
    });
  };

  const handleDelete = (row) => {
    setItemToDelete(row);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deletePeminjaman(itemToDelete.id_pinjam);
        await fetchPeminjaman();
        await fetchBukuTanah();
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      } catch (error) {
        console.error("Error deleting peminjaman:", error);
        alert("Error menghapus peminjaman");
      }
    }
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setEditingId(null);
    resetForm();
    setIsAddOpen(true);
  };

  const handleDialogClose = () => {
    setIsAddOpen(false);
    setIsEditMode(false);
    setEditingId(null);
    resetForm();
  };

  return (
    <div>
      <Header title="DATA PEMINJAMAN">
        <Add
          textButton="Tambah Peminjaman"
          title="Tambah Peminjaman"
          onClick={handleAddClick}
          isOpen={isAddOpen}
          onClose={handleDialogClose}
        >
          <Form
            fields={fields}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            disabledFields={isEditMode ? ["namaPetugas"] : ["namaPetugas"]}
            buttonText={isEditMode ? "Update" : "Simpan"}
            disableAutofill={true}
          />
        </Add>
      </Header>
      <Table
        data={peminjamanList}
        columns={columns}
        rowsPerPage={10}
        loading={loading}
        onDelete={handleDelete}
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
                  Apakah Anda yakin ingin menghapus peminjaman dengan kode{" "}
                  <span className="font-semibold text-gray-900">
                    "{itemToDelete?.kode_peminjaman}"
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

export default Peminjaman;
