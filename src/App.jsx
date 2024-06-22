
import './App.css'
import { Navbar } from './components/Navbar'
import { BrowserRouter, Route, Routes, json, useNavigate } from 'react-router-dom'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Profile } from './pages/Profile'
import { CreatePost } from './pages/Createpost'
import { createContext, useContext, useEffect, useReducer } from 'react'
import { initialState, reducer } from './reducer/userReducer'
import { Userprofile } from './pages/Userprofile'
import { FollowingPost } from './pages/FollowingPost'

export const userContext = createContext()

function getCookie(name) {
  let cookies = document.cookie.split(';');
  for (let cookie of cookies) {
      let [cookieName, cookieValue] = cookie.split('=');
      cookieName = cookieName.trim();
      if (cookieName === name) {
          const cookieUser = decodeURIComponent(cookieValue);
          const startIndex = cookieUser.indexOf('{')
          const endIndex = cookieUser.indexOf('}') + 1;
          const user = cookieUser.substring(startIndex, endIndex);
          console.log(user);
          return JSON.parse(user)
      }
  }
  return null;
}

const Routing = () => {

  const navigate = useNavigate()
  const {state, dispatch} = useContext(userContext)
  useEffect(() => {
    const user = getCookie('user');
    if(user){
      console.log(user);
      dispatch({type:"USER", payload: user})
      // navigate('/')
    }
    else{
      navigate('/login')
    }
  }, [])

  
// console.log(state);
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
      </Routes>
    </>
  )
}
function App() {

  const [state, dispatch] = useReducer(reducer, initialState )

  return (
    <userContext.Provider value={ {state, dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </userContext.Provider>
  )
}

export default App
