import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Dialog, Separator } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";

const Add = ({ textButton = "", title = "", children, open, onOpenChange }) => {
  return (
    <div>
      {/* support controlled open state via `open` and `onOpenChange` props */}
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Trigger asChild>
          <button className="inline-flex h-[38px] gap-2 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 md:px-5 text-sm md:text-base font-semibold leading-none outline-none shadow-md hover:shadow-lg transform hover:scale-105 transition-all select-none">
            <PlusCircledIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{textButton}</span>
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-overlayShow z-[100]" />
          <Dialog.Content
            className="fixed space-y-4 md:space-y-6 left-1/2 top-1/2 max-h-[85vh] w-[90vw] md:w-full md:max-w-[600px] lg:max-w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gradient-to-br from-white to-blue-50/70 p-5 md:p-7 shadow-2xl border border-blue-100 focus:outline-none data-[state=open]:animate-contentShow overflow-y-auto z-[101]"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Dialog.Title className="mb-2 md:mb-3 text-lg md:text-xl font-bold text-gray-800 pr-8">
              {title}
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Form untuk {title}
            </Dialog.Description>
            <Separator.Root className="bg-blue-200/50 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px" />
            {children}
            <Dialog.Close asChild>
              <button
                className="absolute right-3 top-3 inline-flex size-[28px] appearance-none items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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

export default Add;
