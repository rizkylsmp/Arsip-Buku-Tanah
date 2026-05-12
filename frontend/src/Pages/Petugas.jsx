import React from "react";
import Header from "../Components/Tools/Header";
import Add from "../Components/Tools/Add";
import Form from "../Components/Tools/Form";
import Table from "../Components/Tools/Table";
import ChangePassword from "../Components/Tools/ChangePassword";
import {
  getPetugas,
  createPetugas,
  updatePetugas,
  deletePetugas,
  changePassword,
} from "../api/petugasApi";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, ExclamationTriangleIcon } from "@radix-ui/react-icons";

const Petugas = () => {
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = React.useState(false);
  const [selectedPetugasId, setSelectedPetugasId] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [petugasList, setPetugasList] = React.useState([]);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [formData, setFormData] = React.useState({
    nama: "",
    username: "",
    password: "",
    confPassword: "",
    alamat: "",
    jenisKelamin: "",
    noHandphone: "",
  });

  // Dynamic fields based on mode
  const getFields = () => {
    const baseFields = [
      { label: "Nama", type: "text" },
      { label: "Username", type: "text" },
    ];

    // Add password fields only in create mode
    if (!isEditMode) {
      baseFields.push(
        { label: "Password", type: "password" },
        { label: "Conf Password", type: "password" }
      );
    }

    baseFields.push(
      { label: "Alamat", type: "text" },
      {
        label: "Jenis Kelamin",
        type: "select",
        options: [
          { value: "Pria", label: "Pria" },
          { value: "Wanita", label: "Wanita" },
        ],
      },
      { label: "No Handphone", type: "text" }
    );

    // Add role field only in edit mode
    if (isEditMode) {
      baseFields.push({
        label: "Role",
        type: "select",
        options: [
          { value: "admin", label: "Admin" },
          { value: "pegawai", label: "Pegawai" },
        ],
      });
    }

    return baseFields;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isEditMode && editingId) {
        // Update mode - password diubah melalui dialog terpisah
        const response = await updatePetugas(editingId, {
          nama: formData.nama,
          alamat: formData.alamat,
          jenis_kelamin: formData.jenisKelamin,
          no_handphone: formData.noHandphone,
          role: formData.role, // Include role in update
        });
        if (response.status === 200) {
          setIsAddOpen(false);
          setIsEditMode(false);
          setEditingId(null);
          setFormData({
            nama: "",
            username: "",
            password: "",
            confPassword: "",
            alamat: "",
            jenisKelamin: "",
            noHandphone: "",
          });
          await fetchPetugas();
        }
      } else {
        // Create mode - validate password match
        if (formData.password !== formData.confPassword) {
          setErrorMessage("Password dan Konfirmasi Password tidak cocok!");
          setErrorDialogOpen(true);
          return;
        }

        const response = await createPetugas({
          nama: formData.nama,
          username: formData.username,
          password: formData.password,
          conf_password: formData.confPassword,
          alamat: formData.alamat,
          jenis_kelamin: formData.jenisKelamin,
          no_handphone: formData.noHandphone,
        });
        if (response.status === 201) {
          setIsAddOpen(false);
          setFormData({
            nama: "",
            username: "",
            password: "",
            confPassword: "",
            alamat: "",
            jenisKelamin: "",
            noHandphone: "",
          });
          await fetchPetugas();
        }
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || error.message || "Terjadi kesalahan";
      setErrorMessage(errorMsg);
      setErrorDialogOpen(true);
      console.error("Error submitting data:", error);
    }
  };

  const handleEdit = async (row) => {
    setIsEditMode(true);
    setEditingId(row.id_petugas);
    setFormData({
      nama: row.nama || "",
      username: row.username || "",
      password: "",
      confPassword: "",
      alamat: row.alamat || "",
      jenisKelamin: row.jenis_kelamin || "",
      noHandphone: row.no_handphone || "",
      role: row.role || "pegawai", // Include role
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
        await deletePetugas(itemToDelete.id_petugas);
        await fetchPetugas();
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      } catch (error) {
        console.error("Error deleting petugas:", error);
        setErrorMessage("Gagal menghapus petugas");
        setErrorDialogOpen(true);
      }
    }
  };

  const handleChangePassword = (row) => {
    setSelectedPetugasId(row.id_petugas);
    setIsChangePasswordOpen(true);
  };

  const handleChangePasswordSubmit = async (passwordData) => {
    try {
      const response = await changePassword(selectedPetugasId, {
        newPassword: passwordData.newPassword,
      });
      if (response.status === 200) {
        setErrorMessage("Password berhasil diubah!");
        setErrorDialogOpen(true);
        setIsChangePasswordOpen(false);
        setSelectedPetugasId(null);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || error.message || "Terjadi kesalahan";
      setErrorMessage(errorMsg);
      setErrorDialogOpen(true);
      console.error("Error changing password:", error);
    }
  };

  const fetchPetugas = async () => {
    try {
      setLoading(true);
      const response = await getPetugas();
      setPetugasList(response.data.data);
    } catch (err) {
      console.error("Error fetching buku tanah:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPetugas();
  }, []);

  return (
    <div>
      <Header title="DATA PETUGAS">
        <Add
          title={isEditMode ? "Edit Petugas" : "Tambah Petugas"}
          textButton={isEditMode ? "Edit Petugas" : "Tambah Petugas"}
          open={isAddOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsEditMode(false);
              setEditingId(null);
              setFormData({
                nama: "",
                username: "",
                password: "",
                confPassword: "",
                alamat: "",
                jenisKelamin: "",
                noHandphone: "",
              });
            }
            setIsAddOpen(open);
          }}
        >
          <Form
            fields={getFields()}
            formData={formData}
            onSubmit={handleSubmit}
            setFormData={setFormData}
            disabledFields={isEditMode ? ["username"] : []}
            buttonText={isEditMode ? "Update" : "Simpan"}
          />
        </Add>
      </Header>
      <ChangePassword
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
        onSubmit={handleChangePasswordSubmit}
        title="Ubah Password Petugas"
      />
      <Table
        data={petugasList}
        columns={[
          { key: "nama", header: "Nama" },
          { key: "username", header: "Username" },
          { key: "alamat", header: "Alamat" },
          { key: "jenis_kelamin", header: "Jenis Kelamin" },
          { key: "no_handphone", header: "No Handphone" },
          {
            key: "role",
            header: "Role",
            render: (row) => (
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  row.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {row.role === "admin" ? "Admin" : "Pegawai"}
              </span>
            ),
          },
        ]}
        loading={loading}
        rowsPerPage={10}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChangePassword={handleChangePassword}
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
                  Apakah Anda yakin ingin menghapus petugas{" "}
                  <span className="font-semibold text-gray-900">
                    "{itemToDelete?.nama}"
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

      {/* Error/Success Dialog */}
      <Dialog.Root open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-overlayShow z-[100]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl w-[90vw] max-w-md z-[101] data-[state=open]:animate-contentShow">
            <div className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  errorMessage.includes("berhasil") ||
                  errorMessage.includes("Berhasil")
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                {errorMessage.includes("berhasil") ||
                errorMessage.includes("Berhasil") ? (
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <Dialog.Title className="text-lg font-bold text-gray-900 mb-2">
                  {errorMessage.includes("berhasil") ||
                  errorMessage.includes("Berhasil")
                    ? "Berhasil"
                    : "Error"}
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-600 mb-4">
                  {errorMessage}
                </Dialog.Description>
                <div className="flex justify-end">
                  <button
                    onClick={() => setErrorDialogOpen(false)}
                    className={`px-4 py-2 cursor-pointer rounded-lg font-medium transition-all shadow-md hover:shadow-lg ${
                      errorMessage.includes("berhasil") ||
                      errorMessage.includes("Berhasil")
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    OK
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

export default Petugas;
