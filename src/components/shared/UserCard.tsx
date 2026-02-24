import avatar from "@assets/images/avatar.jpg"
import type { IprofileData } from "@/types";

interface UserCardProps {
    user: IprofileData;
    userChat: (user: IprofileData) => void;
}

const UserCard = ({ user, userChat }: UserCardProps) => {
  return (
      <div 
        onClick={() => userChat(user)}
        className="flex items-center gap-2 mt-2 hover:bg-tertiary cursor-pointer p-2 rounded-md group transition-colors"
      >
          <img 
              src={user?.avatar_url || avatar} 
              alt={user?.username || "User avatar"} 
              className="w-9 h-9 rounded-full object-cover" 
          />
          <div className="flex-1 overflow-hidden">
              <h1 className="userCard-name text-white font-semibold truncate">
                  {user?.username || "User"}
              </h1>
              <p className="last-message text-gray-400 text-sm group-hover:text-white truncate">
                  {user?.bio || "No bio available"}
              </p>
          </div>
      </div>
  )
}

export default UserCard