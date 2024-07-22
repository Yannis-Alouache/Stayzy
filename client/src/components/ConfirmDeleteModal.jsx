import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { IoWarningOutline } from "react-icons/io5";


export default function ConfirmDeleteModal(props) {
    const { thingToDelete, setThingToDelete, handleConfirmDelete } = props;

  return (
    <Dialog
      open={thingToDelete !== null}
      onClose={() => setThingToDelete(null)}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <DialogPanel className="w-2/6 space-y-4 border rounded-lg bg-white p-8">
          <div className="flex flex-col gap-4 items-center">
            <div className="bg-rose-200 rounded-full p-3 w-fit">
              <IoWarningOutline size={24} className="text-primary" />
            </div>

            <DialogTitle className="text-lg font-medium">
              êtes-vous sûrs ?
            </DialogTitle>
            <span className="text-sm">Cette action ne peut être annulée</span>

            <button
              className="bg-gray-200 py-2 px-6 rounded-full w-full mr-2"
              onClick={() => setThingToDelete(null)}
            >
              Annuler
            </button>
            <button
              className="bg-primary text-white py-2 px-6 w-full rounded-full"
              onClick={() => handleConfirmDelete()}
            >
              Supprimer
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
