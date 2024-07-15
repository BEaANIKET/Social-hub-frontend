import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { userContext } from "../App";

export const socketContext = createContext();


export const SocketContextProvider = ({children}) => {

    const [socket, setSocket] = useState(null);
    const {state} = useContext(userContext)

    useEffect(() => {
        if(state){
            const socket = io(`${import.meta.env.VITE_URL}`, {
                query: {
                    userId: state.id
                }
            })
            setSocket(socket)

            return () => socket.close()
        }else {
            if(socket){
                socket.close()
                setSocket(null)
            }
        }
    }, [state])

    const exportData = {socket }

    return (
        <socketContext.Provider value={ exportData }>
            {children}
        </socketContext.Provider>
    )
}

export const useSocketContext = () => {
    return useContext(socketContext)
}