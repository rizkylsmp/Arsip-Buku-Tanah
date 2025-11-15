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

const Petugas = () => {
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = React.useState(false);
  const [selectedPetugasId, setSelectedPetugasId] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [petugasList, setPetugasList] = React.useState([]);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
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
        { label: "Konfirmasi Password", type: "password" }
      );
    }

    baseFields.push(
      { label: "Alamat", type: "text" },
      { label: "Jenis Kelamin", type: "text" },
      { label: "No Handphone", type: "text" }
    );

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
        // Create mode
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
      const errorMessage =
        error.response?.data?.error || error.message || "Terjadi kesalahan";
      alert(`Error: ${errorMessage}`);
      console.error("Error submitting data:", error);
    }
  };

  const handleEdit = async (row) => {
    console.log("Edit petugas:", row);
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
    });
    setIsAddOpen(true);
  };

  const handleDelete = async (row) => {
    console.log("Delete petugas:", row);
    if (window.confirm(`Yakin ingin menghapus petugas ${row.nama}?`)) {
      try {
        await deletePetugas(row.id_petugas);
        await fetchPetugas();
      } catch (error) {
        console.error("Error deleting petugas:", error);
      }
    }
  };

  const handleChangePassword = (row) => {
    console.log("Change password for:", row);
    setSelectedPetugasId(row.id_petugas);
    setIsChangePasswordOpen(true);
  };

  const handleChangePasswordSubmit = async (passwordData) => {
    try {
      const response = await changePassword(selectedPetugasId, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      if (response.status === 200) {
        alert("Password berhasil diubah!");
        setIsChangePasswordOpen(false);
        setSelectedPetugasId(null);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Terjadi kesalahan";
      alert(`Error: ${errorMessage}`);
      console.error("Error changing password:", error);
    }
  };

  const fetchPetugas = async () => {
    try {
      setLoading(true);
      const response = await getPetugas();
      console.log("Response dari API:", response.data);
      setPetugasList(response.data.data);
      console.log("Data yang disimpan di state:", response.data);
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
        ]}
        loading={loading}
        rowsPerPage={10}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChangePassword={handleChangePassword}
      />
    </div>
  );
};

export default Petugas;
