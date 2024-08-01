import { createContext, useContext, useState } from "react";

export const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const [userProfile, setUserProfile] = useState(null);
    const [allPosts, setAllPosts] = useState();

    const allData = { userProfile, setUserProfile, allPosts, setAllPosts}
    return (
        <AppContext.Provider value={allData}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}
