
import UserInfo from './UserInfo'
import { Button } from '../ui/button'
import type { IprofileData } from '@/types'
import { logout } from '@/store/authSlice'
import {clearChat} from "@/store/chatSlice"
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/store/hooks'
import supabase from '@/lib/config'
interface RightSideBarProps {
    personHowUserChat: IprofileData | null;
}
const RightSideBar = ({ personHowUserChat }: RightSideBarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logout());
    dispatch(clearChat());
    navigate("/signin");
  };
  return (
    <div className='w-[250px] h-full bg-primary p-4   hidden lg:flex flex-col-reverse'>
     
      <Button className='bg-tertiary hover:bg-tertiary/80 text-white ' onClick={handleLogout}>log out</Button>
      {personHowUserChat ? (
        <UserInfo personHowUserChat={personHowUserChat} />
      ) : (
        <div className='flex items-center justify-center h-full text-gray-500'>
            Select a user to start chatting
        </div>
      )}
    </div>
  )
}

export default RightSideBar