import React from "react";
import Header from "../Components/Tools/Header";
import Add from "../Components/Tools/Add";
import Form from "../Components/Tools/Form";
import Table from "../Components/Tools/Table";
import {
  getPengembalian,
  createPengembalian,
  updatePengembalian,
  deletePengembalian,
} from "../api/pengembalianApi";
import { getBorrowedBukuTanah } from "../api/bukuTanahApi";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, ExclamationTriangleIcon } from "@radix-ui/react-icons";

const KUDUS_KECAMATAN_OPTIONS = [
  { value: "KALIWUNGU", label: "KALIWUNGU" },
  { value: "KOTA KUDUS", label: "KOTA KUDUS" },
  { value: "JATI", label: "JATI" },
  { value: "UNDAAN", label: "UNDAAN" },
  { value: "MEJOBO", label: "MEJOBO" },
  { value: "JEKULO", label: "JEKULO" },
  { value: "BAE", label: "BAE" },
  { value: "GEBOG", label: "GEBOG" },
  { value: "DAWE", label: "DAWE" },
];

const normalizeUpper = (value) => (value || "").toUpperCase();

const Pengembalian = () => {
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [pengembalianList, setPengembalianList] = React.useState([]);
  const [bukuTanahList, setBukuTanahList] = React.useState([]);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [loggedInPetugas, setLoggedInPetugas] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [formData, setFormData] = React.useState({
    idPetugas: "",
    namaPetugas: "",
    kecamatan: "",
    desaKelurahan: "",
    idBuku: "",
    jenisHak: "",
    namaPemilik: "",
    tanggalKembali: "",
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

    fetchPengembalian();
    fetchBukuTanah();
  }, []);

  const fetchPengembalian = async () => {
    setLoading(true);
    try {
      const response = await getPengembalian();
      if (response.data && response.data.data) {
        const formattedData = response.data.data.map((item) => ({
          id_kembali: item.id_kembali,
          kode_pengembalian: item.kode_pengembalian,
          nama_petugas: item.Petugas?.nama,
          kecamatan: normalizeUpper(item.BukuTanah?.kecamatan),
          desa_kelurahan: normalizeUpper(item.BukuTanah?.desa_kelurahan),
          jenis_hak: normalizeUpper(item.BukuTanah?.jenis_buku),
          kode_buku: item.BukuTanah?.nomor_hak,
          nama_pemilik: item.BukuTanah?.nama_pemilik,
          tanggal_kembali: item.tanggal_kembali,
          keterangan: item.keterangan,
          id_petugas: item.id_petugas,
          id_buku: item.id_buku,
        }));
        setPengembalianList(formattedData);
      }
    } catch (error) {
      console.error("Error fetching pengembalian:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBukuTanah = async () => {
    try {
      // Fetch only borrowed books (terpinjam) for pengembalian
      const response = await getBorrowedBukuTanah();
      if (response.data && response.data.data) {
        setBukuTanahList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching buku tanah:", error);
    }
  };

  const kecamatanOptions = KUDUS_KECAMATAN_OPTIONS.filter((option) =>
    bukuTanahList.some((b) => normalizeUpper(b.kecamatan) === option.value)
  );
  const desaKelurahanOptions = [
    ...new Set(
      bukuTanahList
        .filter((b) => normalizeUpper(b.kecamatan) === formData.kecamatan)
        .map((b) => normalizeUpper(b.desa_kelurahan))
        .filter(Boolean)
    ),
  ].map((desa) => ({ value: desa, label: desa }));
  const nomorHakOptions = bukuTanahList
    .filter(
      (b) =>
        normalizeUpper(b.kecamatan) === formData.kecamatan &&
        normalizeUpper(b.desa_kelurahan) === formData.desaKelurahan
    )
    .map((b) => ({
      value: b.id_buku,
      label: b.nomor_hak,
    }));
  const getSelectedBuku = (idBuku) =>
    bukuTanahList.find((b) => String(b.id_buku) === String(idBuku));

  const fields = [
    {
      label: "Nama Petugas",
      type: "text",
      disabled: true,
    },
    {
      label: "Kecamatan",
      type: "select",
      options: kecamatanOptions,
      resetFieldsOnChange: [
        "desaKelurahan",
        "idBuku",
        "jenisHak",
        "namaPemilik",
      ],
    },
    {
      label: "Desa/Kelurahan",
      type: "select",
      options: desaKelurahanOptions,
      disabled: !formData.kecamatan,
      resetFieldsOnChange: ["idBuku", "jenisHak", "namaPemilik"],
      placeholder: formData.kecamatan
        ? "Pilih Desa/Kelurahan"
        : "Pilih Kecamatan terlebih dahulu",
    },
    {
      label: "Nomor Hak",
      type: "select",
      fieldKey: "idBuku",
      options: nomorHakOptions,
      disabled: !formData.desaKelurahan,
      placeholder: formData.desaKelurahan
        ? "Pilih Nomor Hak"
        : "Pilih Desa/Kelurahan terlebih dahulu",
      onValueChange: (value) => {
        const selectedBuku = getSelectedBuku(value);

        return {
          jenisHak: normalizeUpper(selectedBuku?.jenis_buku),
          namaPemilik: selectedBuku?.nama_pemilik || "",
        };
      },
    },
    { label: "Jenis Hak", type: "text", disabled: true },
    { label: "Nama Pemilik", type: "text", disabled: true },
    { label: "Tanggal Kembali", type: "date" },
    { label: "Keterangan", type: "textarea" },
  ];

  const columns = [
    { key: "kode_pengembalian", header: "Kode Pengembalian" },
    { key: "nama_petugas", header: "Nama Petugas" },
    { key: "kecamatan", header: "Kecamatan" },
    { key: "desa_kelurahan", header: "Desa/Kelurahan" },
    { key: "jenis_hak", header: "Jenis Hak" },
    { key: "kode_buku", header: "Nomor Hak" },
    { key: "nama_pemilik", header: "Nama Pemilik" },
    { key: "tanggal_kembali", header: "Tanggal Kembali" },
    { key: "keterangan", header: "Keterangan" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isEditMode && editingId) {
        // Update mode
        const response = await updatePengembalian(editingId, {
          id_petugas: formData.idPetugas,
          id_buku: formData.idBuku,
          tanggal_kembali: formData.tanggalKembali,
          keterangan: formData.keterangan,
        });
        if (response.status === 200) {
          setIsAddOpen(false);
          setIsEditMode(false);
          setEditingId(null);
          resetForm();
          await fetchPengembalian();
          await fetchBukuTanah(); // Refresh to update status
        }
      } else {
        // Create mode
        const response = await createPengembalian({
          id_petugas: formData.idPetugas,
          id_buku: formData.idBuku,
          tanggal_kembali: formData.tanggalKembali,
          keterangan: formData.keterangan,
        });
        if (response.status === 201) {
          setIsAddOpen(false);
          resetForm();
          await fetchPengembalian();
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
      kecamatan: "",
      desaKelurahan: "",
      idBuku: "",
      jenisHak: "",
      namaPemilik: "",
      tanggalKembali: "",
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
        await deletePengembalian(itemToDelete.id_kembali);
        await fetchPengembalian();
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      } catch (error) {
        console.error("Error deleting pengembalian:", error);
        alert("Error menghapus pengembalian");
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
      <Header title="DATA PENGEMBALIAN">
        <Add
          onClick={handleAddClick}
          title="Tambah Pengembalian"
          isOpen={isAddOpen}
          onClose={handleDialogClose}
          textButton="Tambah Pengembalian"
        >
          <Form
            fields={fields}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            disabledFields={[]}
            buttonText={isEditMode ? "Update" : "Simpan"}
            disableAutofill={true}
          />
        </Add>
      </Header>
      <Table
        data={pengembalianList}
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
                  Apakah Anda yakin ingin menghapus pengembalian dengan kode{" "}
                  <span className="font-semibold text-gray-900">
                    "{itemToDelete?.kode_pengembalian}"
                  </span>
                  ? Tindakan ini tidak dapat dibatalkan.
                </Dialog.Description>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setDeleteDialogOpen(false)}
                    className="px-4 py-2 cursor-pointer rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 cursor-pointer rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                className="absolute right-3 top-3 inline-flex size-[28px] cursor-pointer appearance-none items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all"
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

export default Pengembalian;
