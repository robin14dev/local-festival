import { createContext } from 'react';

export const ModalContext = createContext<ModalContext | null>(null);

export const induceLogin = (modalContext: ModalContext | null) => {
  modalContext && modalContext.setLoginModal(true);
};
