import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

const GuestRoute = () => {
  const { access_token } = useSelector((state: RootState) => state.auth);
  return !access_token ? <Outlet /> : <Navigate to="/" replace />;
};

export default GuestRoute;