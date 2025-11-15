import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Dialog, Separator } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";

const Add = ({ textButton = "", title = "", children, open, onOpenChange }) => {
  return (
    <div>
      {/* support controlled open state via `open` and `onOpenChange` props */}
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Trigger asChild>
          <button className="inline-flex h-[35px] gap-2 cursor-pointer items-center justify-center rounded bg-biru-terang text-white px-[15px] leading-none outline-none outline-offset-1 hover:bg-biru focus-visible:outline-2 focus-visible:outline-biru select-none">
            <PlusCircledIcon />
            {textButton}
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-dark/40 data-[state=open]:animate-overlayShow" />
          <Dialog.Content className="fixed space-y-6 left-1/2 top-1/2 max-h-5/6 w-full max-w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
            <Dialog.Title className="mb-3 text-lg font-semibold">
              {title}
            </Dialog.Title>
            <Separator.Root className="bg-abu/50 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px" />
            {children}
            <Dialog.Close asChild>
              <button
                className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:shadow-abu focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Add;
