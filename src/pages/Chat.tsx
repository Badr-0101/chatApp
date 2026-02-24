import LeftSideBar from '../components/shared/LeftSideBar'
import RightSideBar from '../components/shared/RightSideBar'
import ChatBox from '../components/shared/ChatBox'
import { useAppSelector } from '@/store/hooks'
import UserBar from '../components/shared/UserBar'

const Chat = () => {
  const currentChat = useAppSelector(state => state.chat.currentChat);
  const currentUserId = useAppSelector(state => state.auth.id);

  return (
    <div className=' h-screen flex justify-center items-center' style={{ background: 'linear-gradient(#596aff, #383699)' }} >
      <div className='w-[80%] h-[80%]'>
        <UserBar chatData={currentChat} />
        <div className='flex h-[80%]  '>
        
        <LeftSideBar />
        <div className='flex-1 bg-primary'>
          <ChatBox chatData={currentChat} currentUserId={currentUserId || null} />
        </div>
        
        <RightSideBar personHowUserChat={currentChat?.user} />
        </div>
      </div>
      
    </div>
  )
}

export default Chat
