import { Routes, Route,    } from 'react-router-dom';
import Chat from '@pages/Chat';
import ProfileUpdate from '@pages/ProfileUpdate' ;
import SignInForm from '@pages/auth/SignInForm';
import AuthLayout from '@pages/auth/AuthLayOut';
import SignUpForm from '@pages/auth/SignUpForm';

function App() {

  return (
   <>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/profile-update" element={<ProfileUpdate />} />
        <Route element={<AuthLayout />} >
            <Route path="/signin" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
        </Route>
      </Routes>
    </>

  )
}

export default App
