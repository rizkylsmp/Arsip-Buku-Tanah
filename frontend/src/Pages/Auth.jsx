import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Form,
  unstable_PasswordToggleField as PasswordToggleField,
} from "radix-ui";

const Auth = () => {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [nama, setNama] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [errors, setErrors] = React.useState({});
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
        setErrors({ server: "Please fill all required fields." });
        return;
      }
      if (password !== confirmPassword) {
        setErrors({ server: "Password and confirmation do not match." });
        return;
      }

      try {
        const res = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nama, username, password }),
        });

        const data = await res.json();
        if (res.ok) {
          // Registration successful - switch to login view and prefill username
          setIsSignUp(false);
          setPassword("");
          setConfirmPassword("");
          setErrors({});
          alert("Registrasi berhasil. Silakan login.");
        } else {
          setErrors({
            server: data.error || data.message || "Registration failed.",
          });
        }
      } catch (error) {
        setErrors({
          server: "An error occurred during registration. Please try again.",
        });
      }
    } else {
      // login flow
      try {
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
              id: data.user.id_petugas,
              jabatan: data.user.jabatan,
            },
          };
          localStorage.setItem("profile", JSON.stringify(profile));
          const from = location.state?.from || "/";
          navigate(from, { replace: true });
        } else {
          // Show user-friendly error message for login failure
          const errorMessage =
            "Username/Password salah. Tidak punya akun? Silahkan registrasi dahulu";
          setErrors({ server: errorMessage });
          alert(errorMessage);
        }
      } catch (error) {
        setErrors({
          server: "An error occurred during login. Please try again.",
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Form.Root
        onSubmit={handleSubmit}
        errors={errors}
        onClearServerErrors={setErrors}
        className="flex h-fit w-full max-w-1/2 flex-col gap-4 border border-gray-200 p-8 rounded-3xl"
      >
        <h2 className="text-xl font-bold  text-center">SELAMAT DATANG</h2>
        <h1 className="text-lg mb-5 text-center">
          {isSignUp
            ? "Silahkan register terlebih dahulu"
            : "Silahkan login terlebih dahulu"}
        </h1>
        {isSignUp && (
          <Form.Field name="url" className="flex flex-col items-start gap-1">
            <Form.Label className="text-sm font-medium text-gray-900">
              Nama
            </Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline focus:-outline-offset-1 focus:outline-blue-800"
            />
            <Form.Message
              className="text-[13px] text-red-500 opacity-80"
              match="valueMissing"
            >
              Masukkan nama
            </Form.Message>
          </Form.Field>
        )}
        <Form.Field name="url" className="flex flex-col items-start gap-1">
          <Form.Label className="text-sm font-medium text-gray-900">
            Username
          </Form.Label>
          <Form.Control
            type="username"
            required
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-10 w-full rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline focus:-outline-offset-1 focus:outline-blue-800"
          />
          <Form.Message
            className="text-[13px] text-red-500 opacity-80"
            match="valueMissing"
          >
            Masukkan username
          </Form.Message>
        </Form.Field>
        <Form.Field name="url" className="flex flex-col items-start gap-1">
          <Form.Label className="text-sm font-medium text-gray-900">
            Password
          </Form.Label>
          <Form.Control
            type="password"
            required
            value={password}
            placeholder="************"
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 w-full rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline focus:-outline-offset-1 focus:outline-blue-800"
          />
          <Form.Message
            className="text-[13px] text-red-500 o pacity-80"
            match="valueMissing"
          >
            Please enter a question
          </Form.Message>
        </Form.Field>
        {isSignUp && (
          <Form.Field name="url" className="flex flex-col items-start gap-1">
            <Form.Label className="text-sm font-medium text-gray-900">
              Konfirmasi Password
            </Form.Label>
            <Form.Control
              type="password"
              required
              value={confirmPassword}
              placeholder="************"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline focus:-outline-offset-1 focus:outline-blue-800"
            />
            <Form.Message
              className="text-[13px] text-red-500 o pacity-80"
              match="valueMissing"
            >
              Please enter a question
            </Form.Message>
          </Form.Field>
        )}
        <button
          type="submit"
          className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
        >
          Submit
        </button>
        <p
          onClick={() => setIsSignUp(!isSignUp)}
          className="flex text-sm text-blue-600 text-center mt-3 cursor-pointer justify-center"
        >
          {isSignUp ? "Sudah punya akun? Login" : "Belum punya akun? Register"}
        </p>
      </Form.Root>
    </div>
  );
};

export default Auth;
