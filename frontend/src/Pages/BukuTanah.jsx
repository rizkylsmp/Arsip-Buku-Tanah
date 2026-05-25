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

const STATUS_OPTIONS = [
  { value: "tersedia", label: "TERSEDIA" },
  { value: "terpinjam", label: "TERPINJAM" },
];

const JENIS_HAK_OPTIONS = [
  { value: "HAK MILIK", label: "HAK MILIK" },
  { value: "HAK GUNA BANGUNAN", label: "HAK GUNA BANGUNAN" },
  { value: "HAK PAKAI", label: "HAK PAKAI" },
  { value: "HAK PENGELOLAAN", label: "HAK PENGELOLAAN" },
  { value: "HAK WAKAF", label: "HAK WAKAF" },
  {
    value: "HAK MILIK SATUAN RUMAH SUSUN",
    label: "HAK MILIK SATUAN RUMAH SUSUN",
  },
];

const KUDUS_DESA_KELURAHAN_SOURCE = [
  { value: "Bakalankrapyak", label: "Bakalankrapyak - Kaliwungu" },
  { value: "Prambatan Kidul", label: "Prambatan Kidul - Kaliwungu" },
  { value: "Prambatan Lor", label: "Prambatan Lor - Kaliwungu" },
  { value: "Garung Kidul", label: "Garung Kidul - Kaliwungu" },
  { value: "Setrokalangan", label: "Setrokalangan - Kaliwungu" },
  { value: "Banget", label: "Banget - Kaliwungu" },
  { value: "Blimbing Kidul", label: "Blimbing Kidul - Kaliwungu" },
  { value: "Sidorekso", label: "Sidorekso - Kaliwungu" },
  { value: "Gamong", label: "Gamong - Kaliwungu" },
  { value: "Kedungdowo", label: "Kedungdowo - Kaliwungu" },
  { value: "Garung Lor", label: "Garung Lor - Kaliwungu" },
  { value: "Karangampel", label: "Karangampel - Kaliwungu" },
  { value: "Mijen", label: "Mijen - Kaliwungu" },
  { value: "Kaliwungu", label: "Kaliwungu - Kaliwungu" },
  { value: "Papringan", label: "Papringan - Kaliwungu" },
  { value: "Purwosari", label: "Purwosari - Kota Kudus" },
  { value: "Sunggingan", label: "Sunggingan - Kota Kudus" },
  { value: "Panjunan", label: "Panjunan - Kota Kudus" },
  { value: "Wergu Wetan", label: "Wergu Wetan - Kota Kudus" },
  { value: "Wergu Kulon", label: "Wergu Kulon - Kota Kudus" },
  { value: "Mlati Kidul", label: "Mlati Kidul - Kota Kudus" },
  { value: "Mlati Norowito", label: "Mlati Norowito - Kota Kudus" },
  { value: "Kerjasan", label: "Kerjasan - Kota Kudus" },
  { value: "Kajeksan", label: "Kajeksan - Kota Kudus" },
  { value: "Janggalan", label: "Janggalan - Kota Kudus" },
  { value: "Demangan", label: "Demangan - Kota Kudus" },
  { value: "Mlati Lor", label: "Mlati Lor - Kota Kudus" },
  { value: "Nganguk", label: "Nganguk - Kota Kudus" },
  { value: "Kramat", label: "Kramat - Kota Kudus" },
  { value: "Demaan", label: "Demaan - Kota Kudus" },
  { value: "Langgardalem", label: "Langgardalem - Kota Kudus" },
  { value: "Kauman", label: "Kauman - Kota Kudus" },
  { value: "Damaran", label: "Damaran - Kota Kudus" },
  { value: "Krandon", label: "Krandon - Kota Kudus" },
  { value: "Singocandi", label: "Singocandi - Kota Kudus" },
  { value: "Glantengan", label: "Glantengan - Kota Kudus" },
  { value: "Kaliputu", label: "Kaliputu - Kota Kudus" },
  { value: "Barongan", label: "Barongan - Kota Kudus" },
  { value: "Burikan", label: "Burikan - Kota Kudus" },
  { value: "Rendeng", label: "Rendeng - Kota Kudus" },
  { value: "Jetiskapuan", label: "Jetiskapuan - Jati" },
  { value: "Tanjungkarang", label: "Tanjungkarang - Jati" },
  { value: "Jati Wetan", label: "Jati Wetan - Jati" },
  { value: "Pasuruhan Kidul", label: "Pasuruhan Kidul - Jati" },
  { value: "Pasuruhan Lor", label: "Pasuruhan Lor - Jati" },
  { value: "Ploso", label: "Ploso - Jati" },
  { value: "Jati Kulon", label: "Jati Kulon - Jati" },
  { value: "Getaspejaten", label: "Getaspejaten - Jati" },
  { value: "Loram Kulon", label: "Loram Kulon - Jati" },
  { value: "Loram Wetan", label: "Loram Wetan - Jati" },
  { value: "Jepangpakis", label: "Jepangpakis - Jati" },
  { value: "Megawon", label: "Megawon - Jati" },
  { value: "Ngembal Kulon", label: "Ngembal Kulon - Jati" },
  { value: "Tumpangkrasak", label: "Tumpangkrasak - Jati" },
  { value: "Wonosoco", label: "Wonosoco - Undaan" },
  { value: "Lambangan", label: "Lambangan - Undaan" },
  { value: "Kalirejo", label: "Kalirejo - Undaan" },
  { value: "Medini", label: "Medini - Undaan" },
  { value: "Sambung", label: "Sambung - Undaan" },
  { value: "Glagahwaru", label: "Glagahwaru - Undaan" },
  { value: "Kutuk", label: "Kutuk - Undaan" },
  { value: "Undaan Kidul", label: "Undaan Kidul - Undaan" },
  { value: "Undaan Tengah", label: "Undaan Tengah - Undaan" },
  { value: "Karangrowo", label: "Karangrowo - Undaan" },
  { value: "Larikrejo", label: "Larikrejo - Undaan" },
  { value: "Undaan Lor", label: "Undaan Lor - Undaan" },
  { value: "Wates", label: "Wates - Undaan" },
  { value: "Ngemplak", label: "Ngemplak - Undaan" },
  { value: "Terangmas", label: "Terangmas - Undaan" },
  { value: "Berugenjang", label: "Berugenjang - Undaan" },
  { value: "Gulang", label: "Gulang - Mejobo" },
  { value: "Jepang", label: "Jepang - Mejobo" },
  { value: "Payaman", label: "Payaman - Mejobo" },
  { value: "Kirig", label: "Kirig - Mejobo" },
  { value: "Temulus", label: "Temulus - Mejobo" },
  { value: "Kesambi", label: "Kesambi - Mejobo" },
  { value: "Jojo", label: "Jojo - Mejobo" },
  { value: "Hadiwarno", label: "Hadiwarno - Mejobo" },
  { value: "Mejobo", label: "Mejobo - Mejobo" },
  { value: "Golantepus", label: "Golantepus - Mejobo" },
  { value: "Tenggeles", label: "Tenggeles - Mejobo" },
  { value: "Sadang", label: "Sadang - Jekulo" },
  { value: "Bulungcangkring", label: "Bulungcangkring - Jekulo" },
  { value: "Bulung Kulon", label: "Bulung Kulon - Jekulo" },
  { value: "Sidomulyo", label: "Sidomulyo - Jekulo" },
  { value: "Gondoharum", label: "Gondoharum - Jekulo" },
  { value: "Terban", label: "Terban - Jekulo" },
  { value: "Pladen", label: "Pladen - Jekulo" },
  { value: "Klaling", label: "Klaling - Jekulo" },
  { value: "Jekulo", label: "Jekulo - Jekulo" },
  { value: "Hadipolo", label: "Hadipolo - Jekulo" },
  { value: "Honggosoco", label: "Honggosoco - Jekulo" },
  { value: "Tanjungrejo", label: "Tanjungrejo - Jekulo" },
  { value: "Dersalam", label: "Dersalam - Bae" },
  { value: "Ngembalrejo", label: "Ngembalrejo - Bae" },
  { value: "Karangbener", label: "Karangbener - Bae" },
  { value: "Gondangmanis", label: "Gondangmanis - Bae" },
  { value: "Pedawang", label: "Pedawang - Bae" },
  { value: "Bacin", label: "Bacin - Bae" },
  { value: "Panjang", label: "Panjang - Bae" },
  { value: "Peganjaran", label: "Peganjaran - Bae" },
  { value: "Purworejo", label: "Purworejo - Bae" },
  { value: "Bae", label: "Bae - Bae" },
  { value: "Gribig", label: "Gribig - Gebog" },
  { value: "Klumpit", label: "Klumpit - Gebog" },
  { value: "Getassrabi", label: "Getassrabi - Gebog" },
  { value: "Padurenan", label: "Padurenan - Gebog" },
  { value: "Karangmalang", label: "Karangmalang - Gebog" },
  { value: "Besito", label: "Besito - Gebog" },
  { value: "Jurang", label: "Jurang - Gebog" },
  { value: "Gondosari", label: "Gondosari - Gebog" },
  { value: "Kedungsari", label: "Kedungsari - Gebog" },
  { value: "Menawan", label: "Menawan - Gebog" },
  { value: "Rahtawu", label: "Rahtawu - Gebog" },
  { value: "Samirejo", label: "Samirejo - Dawe" },
  { value: "Cendono", label: "Cendono - Dawe" },
  { value: "Margorejo", label: "Margorejo - Dawe" },
  { value: "Rejosari", label: "Rejosari - Dawe" },
  { value: "Kandangmas", label: "Kandangmas - Dawe" },
  { value: "Glagah Kulon", label: "Glagah Kulon - Dawe" },
  { value: "Tergo", label: "Tergo - Dawe" },
  { value: "Cranggang", label: "Cranggang - Dawe" },
  { value: "Lau", label: "Lau - Dawe" },
  { value: "Piji", label: "Piji - Dawe" },
  { value: "Puyoh", label: "Puyoh - Dawe" },
  { value: "Soco", label: "Soco - Dawe" },
  { value: "Ternadi", label: "Ternadi - Dawe" },
  { value: "Kajar", label: "Kajar - Dawe" },
  { value: "Kuwukan", label: "Kuwukan - Dawe" },
  { value: "Dukuhwaringin", label: "Dukuhwaringin - Dawe" },
  { value: "Japan", label: "Japan - Dawe" },
  { value: "Colo", label: "Colo - Dawe" },
];

const getUpperOption = (value) => {
  const upperValue = value.toUpperCase();
  return { value: upperValue, label: upperValue };
};

const KUDUS_DESA_BY_KECAMATAN = KUDUS_DESA_KELURAHAN_SOURCE.reduce(
  (acc, item) => {
    const [, kecamatan = ""] = item.label.split(" - ");
    const kecamatanKey = kecamatan.toUpperCase();

    return {
      ...acc,
      [kecamatanKey]: [...(acc[kecamatanKey] || []), item.value.toUpperCase()],
    };
  },
  {}
);

const getDesaKelurahanOptions = (kecamatan) =>
  (KUDUS_DESA_BY_KECAMATAN[kecamatan] || []).map(getUpperOption);

const normalizeUpper = (value) => (value || "").toUpperCase();

const BukuTanah = () => {
  const [formData, setFormData] = React.useState({
    nomorHak: "",
    namaPemilik: "",
    kecamatan: "",
    desaKelurahan: "",
    jenisHak: "",
    tanggalInput: "",
  });

  const [bukuTanahList, setBukuTanahList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);

  const handleEdit = (row) => {
    setIsEditMode(true);
    setEditingId(row.id_buku);
    setFormData({
      nomorHak: row.nomor_hak || "",
      namaPemilik: row.nama_pemilik || "",
      kecamatan: normalizeUpper(row.kecamatan),
      desaKelurahan: normalizeUpper(row.desa_kelurahan),
      jenisHak: normalizeUpper(row.jenis_buku),
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
        const response = await updateBukuTanah(editingId, {
          nomor_hak: formData.nomorHak,
          nama_pemilik: formData.namaPemilik,
          kecamatan: formData.kecamatan,
          desa_kelurahan: formData.desaKelurahan,
          jenis_buku: formData.jenisHak,
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
            jenisHak: "",
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
          jenis_buku: formData.jenisHak,
          tanggal_input: formData.tanggalInput,
        });
        if (response.status === 201) {
          setIsAddOpen(false);
          setFormData({
            nomorHak: "",
            namaPemilik: "",
            kecamatan: "",
            desaKelurahan: "",
            jenisHak: "",
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
    {
      label: "Kecamatan",
      type: "select",
      options: KUDUS_KECAMATAN_OPTIONS,
      resetFieldsOnChange: ["desaKelurahan"],
    },
    {
      label: "Desa/Kelurahan",
      type: "select",
      options: getDesaKelurahanOptions(formData.kecamatan),
      disabled: !formData.kecamatan,
      placeholder: formData.kecamatan
        ? "Pilih Desa/Kelurahan"
        : "Pilih Kecamatan terlebih dahulu",
    },
    { label: "Jenis Hak", type: "select", options: JENIS_HAK_OPTIONS },
    { label: "Nomor Hak", type: "text" },
    { label: "Nama Pemilik", type: "text" },
    { label: "Tanggal Input", type: "date" },
  ];

  return (
    <div>
      <Header title="BUKU TANAH" input>
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
                jenisHak: "",
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
            buttonText={isEditMode ? "Update" : "Simpan"}
          />
        </Add>
      </Header>
      <Table
        data={bukuTanahList}
        columns={[
          {
            key: "kecamatan",
            header: "Kecamatan",
            filterOptions: KUDUS_KECAMATAN_OPTIONS,
            resetFiltersOnChange: ["desa_kelurahan"],
          },
          {
            key: "desa_kelurahan",
            header: "Desa/Kelurahan",
            filterOptions: (filters) =>
              getDesaKelurahanOptions(filters.kecamatan),
            disabledUntilFilter: "kecamatan",
            disabledPlaceholder: "Pilih Kecamatan dulu",
            placeholder: "Semua Desa/Kelurahan",
          },
          {
            key: "jenis_buku",
            header: "Jenis Hak",
            filterOptions: JENIS_HAK_OPTIONS,
          },
          { key: "nomor_hak", header: "Nomor Hak" },
          { key: "nama_pemilik", header: "Nama Pemilik" },
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
            filterOptions: STATUS_OPTIONS,
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

export default BukuTanah;
