import { Routes, Route, Navigate    } from 'react-router-dom';
import Chat from '@pages/Chat';
import ProfileUpdate from '@pages/ProfileUpdate' ;
import SignInForm from '@pages/auth/SignInForm';
import AuthLayout from '@pages/auth/AuthLayOut';
import SignUpForm from '@pages/auth/SignUpForm';
import GuestRoute from '@components/GuestRoute';
import ProtectedRoute from "@components/ProtectedRoute ";
function App() {
  return (
    <Routes>
      {/* Guest-only routes */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Route>
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Chat />} />
        <Route path="/profile-update" element={<ProfileUpdate />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export default App
