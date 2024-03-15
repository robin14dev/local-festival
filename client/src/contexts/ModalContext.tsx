import LoginModal from "components/account/LoginModal";
import SignupModal from "components/account/SignupModal";
import React, { createContext, useRef, useState } from "react";


type Modal = {
    key : string;
}

type State = Modal[]
type Dispatch = React.Dispatch<React.SetStateAction<string>>;

export const ModalStateContext = createContext('')
export const ModalDispatchContext = createContext<Dispatch>(() => {})

type Props = {
    children : JSX.Element | JSX.Element[]
}

const candidates = [
    {key : 'LoginModal', component : () => <LoginModal/>},
    {key : 'SignupModal', component : () => <SignupModal />}
    
]

export const ModalContextProvider = ({children} : Props) => {

    const [modalKey, setModalKey] = useState('')

  
    const component = candidates.find(modal => modal.key === modalKey)?.component
    const Modal = component || null
    
 
    return (
        <ModalStateContext.Provider value={modalKey} >
            <ModalDispatchContext.Provider value={setModalKey}>
                {Modal && <Modal/>}
                {children}
            </ModalDispatchContext.Provider>
        </ModalStateContext.Provider>
    )
}