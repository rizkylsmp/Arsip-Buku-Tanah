import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

const ChangePassword = ({
  open,
  onOpenChange,
  onSubmit,
  title = "Ubah Password",
}) => {
  const [formData, setFormData] = React.useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Password baru dan konfirmasi password tidak cocok!");
      return;
    }
    if (formData.newPassword.length < 6) {
      alert("Password baru minimal 6 karakter!");
      return;
    }
    onSubmit(formData);
    // Reset form
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleClose = (isOpen) => {
    if (!isOpen) {
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-dark/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-mauve11">
            Masukkan password lama dan password baru untuk mengubah password.
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-3 grid flex-col gap-4">
              {/* Password Lama */}
              <div className="flex gap-5">
                <div className="w-2/5">
                  <label className="text-md">Password Lama</label>
                </div>
                <div className="w-3/5">
                  <input
                    type="password"
                    className="box-border inline-flex h-8 w-full appearance-none rounded px-2.5 text-sm leading-none shadow-[0_0_0_1px] shadow-abu outline-none selection:bg-blackA6 selection:text-black hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                    required
                    placeholder="Masukkan password lama"
                    autoComplete="current-password"
                    value={formData.oldPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        oldPassword: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Password Baru */}
              <div className="flex gap-5">
                <div className="w-2/5">
                  <label className="text-md">Password Baru</label>
                </div>
                <div className="w-3/5">
                  <input
                    type="password"
                    className="box-border inline-flex h-8 w-full appearance-none rounded px-2.5 text-sm leading-none shadow-[0_0_0_1px] shadow-abu outline-none selection:bg-blackA6 selection:text-black hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                    required
                    placeholder="Masukkan password baru"
                    autoComplete="new-password"
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Konfirmasi Password Baru */}
              <div className="flex gap-5">
                <div className="w-2/5">
                  <label className="text-md">Konfirmasi Password</label>
                </div>
                <div className="w-3/5">
                  <input
                    type="password"
                    className="box-border inline-flex h-8 w-full appearance-none rounded px-2.5 text-sm leading-none shadow-[0_0_0_1px] shadow-abu outline-none selection:bg-blackA6 selection:text-black hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                    required
                    placeholder="Konfirmasi password baru"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 py-3 w-full text-center rounded bg-biru-terang font-medium leading-none text-white hover:bg-biru"
            >
              Ubah Password
            </button>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ChangePassword;
