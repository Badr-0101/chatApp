

import type { IprofileData } from '@/types'
interface UserInfoProps {
    personHowUserChat: IprofileData | null;
}
const UserInfo = ({personHowUserChat}: UserInfoProps) => {
  return (
       <div className="p-4 flex flex-col items-center h-full overflow-y-auto">
      <img src={personHowUserChat?.avatar_url} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
      <h2 className="text-xl font-bold mt-4 text-white">{personHowUserChat?.username}</h2>
      <p className="text-gray-600 text-center mt-2"> {personHowUserChat?.bio} </p>

    </div>
  )
}
export default UserInfo


