import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Chat from '@pages/Chat';
import ProfileUpdate from '@pages/ProfileUpdate' ;
import SignInForm from '@pages/auth/SignInForm';
import AuthLayout from '@pages/auth/AuthLayOut';
import SignUpForm from '@pages/auth/SignUpForm';
// import { useEffect } from 'react';
// import { useAppDispatch } from './store/hooks';
// import { setUser, logout } from './store/authSlice';
// import supabase from '@/lib/config';
// import { getUserProfile } from '@/lib/api';
// import type { IprofileData } from '@/types';

function App() {
  // const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  // const location = useLocation();

  // useEffect(() => {
  //   // Initial Session Check
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     if (session?.user) {
  //        getUserProfile(session.user.id).then((result) => {
  //           if (result.success && result.data) {
  //               dispatch(setUser(result.data as IprofileData));
  //           }
  //        });
  //     }
  //   });

  //   const { data: { subscription } } = supabase.auth.onAuthStateChange(
  //     async (_event, session) => {
  //       if (session && session.user) {
  //          const result = await getUserProfile(session.user.id);
  //          if (result.success && result.data) {
  //               const userData = result.data as IprofileData;
  //               dispatch(setUser(userData));
  //               if (location.pathname === '/signin' || location.pathname === '/signup') {
  //                   navigate('/');
  //               }
  //          }
  //       } else {
  //            dispatch(logout());
  //            if (location.pathname === '/' || location.pathname === '/profile-update') {
  //                navigate('/signin');
  //            }
  //       }
  //     }
  //   )
  //   return () => {
  //     subscription.unsubscribe();
  //   }
  // }, [dispatch, navigate, location.pathname])

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
