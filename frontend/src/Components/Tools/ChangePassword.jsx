import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, ExclamationTriangleIcon } from "@radix-ui/react-icons";

const ChangePassword = ({
  open,
  onOpenChange,
  onSubmit,
  title = "Ubah Password",
}) => {
  const [formData, setFormData] = React.useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Password baru dan konfirmasi password tidak cocok!");
      setErrorDialogOpen(true);
      return;
    }
    if (formData.newPassword.length < 6) {
      setErrorMessage("Password baru minimal 6 karakter!");
      setErrorDialogOpen(true);
      return;
    }
    onSubmit(formData);
    // Reset form
    setFormData({
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleClose = (isOpen) => {
    if (!isOpen) {
      setFormData({
        newPassword: "",
        confirmPassword: "",
      });
    }
    onOpenChange(isOpen);
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={handleClose}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-overlayShow z-[100]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl w-[90vw] max-w-md z-[101] data-[state=open]:animate-contentShow">
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-2">
              {title}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-600 mb-6">
              Masukkan password baru untuk mengubah password petugas.
            </Dialog.Description>

            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-4 grid flex-col gap-4">
                {/* Password Baru */}
                <div className="flex flex-col md:flex-row gap-2 md:gap-5">
                  <div className="w-full md:w-1/3">
                    <label className="text-sm font-semibold text-gray-700">
                      Password Baru
                    </label>
                  </div>
                  <div className="w-full md:w-2/3">
                    <input
                      type="password"
                      className="box-border inline-flex w-full appearance-none rounded-lg px-3 py-2 text-sm leading-none border-2 border-slate-200 outline-none bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:border-slate-300 transition-all shadow-sm"
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
                <div className="flex flex-col md:flex-row gap-2 md:gap-5">
                  <div className="w-full md:w-1/3">
                    <label className="text-sm font-semibold text-gray-700">
                      Konfirmasi Password
                    </label>
                  </div>
                  <div className="w-full md:w-2/3">
                    <input
                      type="password"
                      className="box-border inline-flex w-full appearance-none rounded-lg px-3 py-2 text-sm leading-none border-2 border-slate-200 outline-none bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:border-slate-300 transition-all shadow-sm"
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
                className="mt-6 py-3 w-full text-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold leading-none text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
              >
                Ubah Password
              </button>
            </form>

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

      {/* Error Dialog */}
      <Dialog.Root open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-overlayShow z-[102]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl w-[90vw] max-w-md z-[103] data-[state=open]:animate-contentShow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <Dialog.Title className="text-lg font-bold text-gray-900 mb-2">
                  Error
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-600 mb-4">
                  {errorMessage}
                </Dialog.Description>
                <div className="flex justify-end">
                  <button
                    onClick={() => setErrorDialogOpen(false)}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    OK
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
    </>
  );
};

export default ChangePassword;
