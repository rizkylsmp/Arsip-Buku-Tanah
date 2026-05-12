import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Form,
  unstable_PasswordToggleField as PasswordToggleField,
} from "radix-ui";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Cross2Icon,
  ExclamationTriangleIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";
import { MoonLoader } from "react-spinners";

const Auth = () => {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [nama, setNama] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [adminCode, setAdminCode] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogContent, setDialogContent] = React.useState({
    type: "error", // "error" or "success"
    title: "",
    message: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL;

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // if token exists but no profile stored, fetch profile
      const profile = localStorage.getItem("profile");
      if (!profile) {
        (async () => {
          try {
            const res = await fetch(`${API_URL}/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const data = await res.json();
              // store a small profile object expected by navbar
              const p = {
                result: {
                  name: data.user.nama,
                  id: data.user.id_petugas,
                  jabatan: data.user.jabatan,
                  role: data.user.role, // Include role
                },
              };
              localStorage.setItem("profile", JSON.stringify(p));
            } else {
              // token might be invalid, remove it
              localStorage.removeItem("token");
            }
          } catch (err) {
            console.error("Failed to fetch profile:", err);
          }
        })();
      }
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      // client-side validation
      if (!nama || !username || !password) {
        setDialogContent({
          type: "error",
          title: "Form Tidak Lengkap",
          message: "Mohon isi semua field yang diperlukan.",
        });
        setDialogOpen(true);
        return;
      }

      if (password.length < 6) {
        setDialogContent({
          type: "error",
          title: "Password Terlalu Pendek",
          message: "Password harus minimal 6 karakter.",
        });
        setDialogOpen(true);
        return;
      }

      if (password !== confirmPassword) {
        setDialogContent({
          type: "error",
          title: "Password Tidak Cocok",
          message:
            "Password dan konfirmasi password tidak sama. Silakan periksa kembali.",
        });
        setDialogOpen(true);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama,
            username,
            password,
            ...(adminCode && { adminCode }), // Include adminCode if provided
          }),
        });

        const data = await res.json();
        if (res.ok) {
          // Registration successful
          setDialogContent({
            type: "success",
            title: "Registrasi Berhasil!",
            message:
              "Akun Anda telah berhasil dibuat. Silakan login untuk melanjutkan.",
          });
          setDialogOpen(true);
          // Switch to login after closing dialog
          setTimeout(() => {
            setIsSignUp(false);
            setPassword("");
            setConfirmPassword("");
            setErrors({});
          }, 2000);
        } else {
          setDialogContent({
            type: "error",
            title: "Registrasi Gagal",
            message:
              data.error ||
              data.message ||
              "Terjadi kesalahan saat registrasi. Silakan coba lagi.",
          });
          setDialogOpen(true);
        }
      } catch (error) {
        setDialogContent({
          type: "error",
          title: "Kesalahan Koneksi",
          message:
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
        });
        setDialogOpen(true);
      } finally {
        setLoading(false);
      }
    } else {
      // login flow
      if (!username || !password) {
        setDialogContent({
          type: "error",
          title: "Form Tidak Lengkap",
          message: "Mohon isi username dan password.",
        });
        setDialogOpen(true);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          const profile = {
            result: {
              name: data.user.nama,
              id: data.user.id,
              role: data.user.role, // Store role
            },
          };
          localStorage.setItem("profile", JSON.stringify(profile));
          const from = location.state?.from || "/";
          navigate(from, { replace: true });
        } else {
          setDialogContent({
            type: "error",
            title: "Login Gagal",
            message:
              "Username atau password salah. Jika belum punya akun, silakan registrasi terlebih dahulu.",
          });
          setDialogOpen(true);
        }
      } catch (error) {
        setDialogContent({
          type: "error",
          title: "Kesalahan Koneksi",
          message:
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
        });
        setDialogOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-yellow-400 flex justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-yellow-500/20 animate-pulse"></div>

      {/* Geometric pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border-4 border-white rounded-lg rotate-45 animate-spin-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border-4 border-white rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 border-4 border-white rounded-lg -rotate-12 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 border-4 border-white rounded-full animate-spin-slow"></div>
      </div>

      {/* Large decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-300/30 to-amber-400/30 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 animate-blob"></div>
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl translate-x-1/3 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-cyan-400/30 to-yellow-400/30 rounded-full blur-3xl translate-y-1/3 animate-blob animation-delay-4000"></div>

      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/40 rounded-full animate-float"></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white/30 rounded-full animate-float animation-delay-1000"></div>
      <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-white/20 rounded-full animate-float animation-delay-3000"></div>
      <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-white/40 rounded-full animate-float animation-delay-2000"></div>

      <Form.Root
        onSubmit={handleSubmit}
        errors={errors}
        onClearServerErrors={setErrors}
        className="relative flex h-fit w-full max-w-md flex-col gap-5 p-8 md:p-10 rounded-2xl bg-white backdrop-blur-sm shadow-2xl z-10 border border-white/20"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-2">
          <div className="w-20 h-20 md:w-24 md:h-24 mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <img
              src="/bpn.png"
              alt="Logo"
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            {isSignUp ? "Buat Akun Baru" : "Selamat Datang"}
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            {isSignUp
              ? "Daftar untuk membuat akun baru"
              : "Silakan login untuk melanjutkan"}
          </p>
        </div>
        {isSignUp && (
          <Form.Field name="url" className="flex flex-col items-start gap-2">
            <Form.Label className="text-sm font-semibold text-gray-700">
              Nama Lengkap
            </Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Masukkan nama lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="h-11 w-full rounded-lg border-2 border-gray-200 px-4 text-base text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <Form.Message
              className="text-xs text-red-600 font-medium"
              match="valueMissing"
            >
              Nama harus diisi
            </Form.Message>
          </Form.Field>
        )}
        <Form.Field name="url" className="flex flex-col items-start gap-2">
          <Form.Label className="text-sm font-semibold text-gray-700">
            Username
          </Form.Label>
          <Form.Control
            type="username"
            required
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-11 w-full rounded-lg border-2 border-gray-200 px-4 text-base text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <Form.Message
            className="text-xs text-red-600 font-medium"
            match="valueMissing"
          >
            Username harus diisi
          </Form.Message>
        </Form.Field>
        <Form.Field name="url" className="flex flex-col items-start gap-2">
          <Form.Label className="text-sm font-semibold text-gray-700">
            Password
          </Form.Label>
          <Form.Control
            type="password"
            required
            value={password}
            placeholder="Masukkan password"
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-lg border-2 border-gray-200 px-4 text-base text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <Form.Message
            className="text-xs text-red-600 font-medium"
            match="valueMissing"
          >
            Password harus diisi
          </Form.Message>
        </Form.Field>
        {isSignUp && (
          <Form.Field name="url" className="flex flex-col items-start gap-2">
            <Form.Label className="text-sm font-semibold text-gray-700">
              Konfirmasi Password
            </Form.Label>
            <Form.Control
              type="password"
              required
              value={confirmPassword}
              placeholder="Masukkan ulang password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`h-11 w-full rounded-lg border-2 px-4 text-base text-gray-900 transition-all focus:outline-none focus:ring-2 ${
                confirmPassword && password !== confirmPassword
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                <ExclamationTriangleIcon className="w-3 h-3" />
                Password tidak cocok
              </p>
            )}
            <Form.Message
              className="text-xs text-red-600 font-medium"
              match="valueMissing"
            >
              Konfirmasi password harus diisi
            </Form.Message>
          </Form.Field>
        )}
        {isSignUp && (
          <Form.Field
            name="adminCode"
            className="flex flex-col items-start gap-2"
          >
            <Form.Label className="text-sm font-semibold text-gray-700">
              Kode Admin{" "}
              <span className="text-gray-400 font-normal">(Opsional)</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={adminCode}
              placeholder="Masukkan kode admin jika punya"
              onChange={(e) => setAdminCode(e.target.value)}
              className="h-11 w-full rounded-lg border-2 border-gray-200 px-4 text-base text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <p className="text-xs text-gray-500">
              Kosongkan jika Anda mendaftar sebagai pegawai
            </p>
          </Form.Field>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-12 w-full cursor-pointer rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-base shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <MoonLoader color="#ffffff" size={20} />
              <span>{isSignUp ? "Mendaftar..." : "Masuk..."}</span>
            </>
          ) : (
            <span>{isSignUp ? "Daftar Sekarang" : "Masuk"}</span>
          )}
        </button>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              {isSignUp ? "Sudah punya akun?" : "Belum punya akun?"}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full h-11 cursor-pointer rounded-lg border-2 border-blue-500 text-blue-600 font-semibold text-base hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          {isSignUp ? "Login" : "Register"}
        </button>
      </Form.Root>

      {/* Error/Success Dialog */}
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md rounded-xl bg-white p-6 shadow-2xl focus:outline-none data-[state=open]:animate-contentShow z-50">
            <div className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  dialogContent.type === "error" ? "bg-red-100" : "bg-green-100"
                }`}
              >
                {dialogContent.type === "error" ? (
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                ) : (
                  <CheckCircledIcon className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <Dialog.Title
                  className={`text-lg font-semibold mb-2 ${
                    dialogContent.type === "error"
                      ? "text-red-900"
                      : "text-green-900"
                  }`}
                >
                  {dialogContent.title}
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-600 leading-relaxed">
                  {dialogContent.message}
                </Dialog.Description>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Dialog.Close asChild>
                <button
                  className={`px-6 py-2.5 cursor-pointer rounded-lg font-semibold text-sm transition-all ${
                    dialogContent.type === "error"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    dialogContent.type === "error"
                      ? "focus:ring-red-500"
                      : "focus:ring-green-500"
                  }`}
                >
                  Mengerti
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button
                className="absolute right-4 top-4 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none"
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

export default Auth;
