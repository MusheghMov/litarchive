"use client";

import {
  useState,
  createContext,
  useContext,
  ComponentPropsWithoutRef,
} from "react";
import dynamic from "next/dynamic";
import { Dialog } from "@/components/ui/dialog";

const SignUpSuggestionModal = dynamic(
  () => import("@/components/modals/SignUpSuggestionModal")
);

const UpsertAuthorReviewModal = dynamic(
  () => import("@/components/modals/UpsertAuthorReviewModal")
);

interface BaseModalProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  onClose?: () => void;
}

const Modals = {
  SignUpSuggestionModal,
  UpsertAuthorReviewModal,
} as const;

type ModalComponents = {
  [K in keyof typeof Modals]: (typeof Modals)[K] extends React.ComponentType<
    infer P
  >
    ? React.ComponentType<P & BaseModalProps>
    : (typeof Modals)[K];
};

type ModalContextType = {
  openModal: ({
    modalName,
    props,
  }: {
    modalName: keyof typeof Modals;
    props?: ComponentPropsWithoutRef<ModalComponents[keyof ModalComponents]>;
  }) => void;
  isOpen: boolean;
};

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  isOpen: false,
});

export function useModal() {
  const modal = useContext(ModalContext);
  return modal;
}

type ModalState<T = any> = {
  component: keyof typeof Modals | null;
  props?: T;
};

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({ component: null });

  const ModalComponent = modalState.component
    ? Modals[modalState.component]
    : null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      modalState.props?.onClose?.();
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };
  return (
    <ModalContext.Provider
      value={{
        openModal: ({ modalName, props }) => {
          setModalState({ component: modalName, props });
          setIsOpen(true);
        },
        isOpen,
      }}
    >
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        {ModalComponent && (
          <ModalComponent
            {...modalState.props}
            isOpen={isOpen}
            setIsOpen={(open: boolean) => {
              handleOpenChange(open);
            }}
          />
        )}
      </Dialog>
      {children}
    </ModalContext.Provider>
  );
}
