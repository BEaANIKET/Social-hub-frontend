import './App.css'
import { Navbar } from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Profile } from './pages/Profile'
import { CreatePost } from './pages/Createpost'
import { createContext, useContext, useEffect, useReducer } from 'react'
import { initialState, reducer } from './reducer/userReducer'
import { Userprofile } from './pages/Userprofile'
import { FollowingPost } from './pages/FollowingPost'
import { Forgetpassword } from './pages/Forgetpassword'
import { Search } from './pages/Search'
import { AppProvider, useAppContext } from './context/Appcontext'
import { SocketContextProvider, useSocketContext } from './context/SocketContext'
import { initializeSocketListeners } from './socketLishner/SocketLishner'

export const userContext = createContext()


const Routing = () => {
  const { state, dispatch } = useContext(userContext);
  const { setAllPosts, setUserProfile, userProfile, allPosts } = useAppContext();
  const { socket } = useSocketContext();

  useEffect(() => {
    const cleanup = initializeSocketListeners(socket, setAllPosts, setUserProfile, userProfile, allPosts);

    return () => {
      cleanup();
    };
  }, [socket, setAllPosts, setUserProfile, userProfile, allPosts]);

  useEffect(() => {
    const getcurrentUser = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_URL}/api/getcurrentuser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
          dispatch({
            type: 'USER',
            payload: data.user,
          });
        }
      } catch (error) {
        console.log("get current user ", error);
      }
    };

    getcurrentUser();
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/profile/:id" element={<Userprofile />} />
        <Route path="/followingpost" element={<FollowingPost />} />
        <Route path="/forgetpassword" element={<Forgetpassword />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <userContext.Provider value={{ state, dispatch }}>
      <SocketContextProvider>
        <AppProvider>
          <BrowserRouter>
            <Navbar />
            <Routing />
          </BrowserRouter>
        </AppProvider>
      </SocketContextProvider>
    </userContext.Provider>
  )
}

export default App;
