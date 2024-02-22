import { createContext } from "react";

export const ModalContext = createContext<ModalContext>({
  isLoginModal: false,
  setIsLoginModal: () => undefined,
});

export const induceLogin = (modalContext: ModalContext | null) => {
  modalContext && modalContext.setIsLoginModal(true);
};
