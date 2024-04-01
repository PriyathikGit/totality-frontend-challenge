import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from '../api-client';
type ToastMessage={
    message:string,
    type: "SUCCESS" | "ERROR"

}

type AppContext={
    showToast:(toastMessage:ToastMessage)=>void
    isLoggedIn: boolean;
}

const AppContext=React.createContext<AppContext | undefined>(undefined);

export const AppContextProvider=({children}:{children:React.ReactNode})=>{
    const [toast,setToast] = useState<ToastMessage | undefined>(undefined)
    // validate the token if not then show error 401 and not then 200
    const {isError} = useQuery("validateToken",apiClient.validateToken,{ 
        retry: false,
    })
    return(
        <AppContext.Provider value={
            {
                showToast:(toastMessage)=> {
                    setToast(toastMessage)
                },
                isLoggedIn: !isError // if not error then token is good there is no error and it will be true
            }
        }>
            {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(undefined)}/>}
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext=()=>{
    const context = useContext(AppContext)
    return context as AppContext
}