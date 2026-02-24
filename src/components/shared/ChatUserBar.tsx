import { GoDotFill } from "react-icons/go";
import avatar from "@assets/images/avatar.jpg";
import { IoIosInformationCircleOutline } from "react-icons/io";
import type { ChatBoxProps } from "@/types";

const ChatUserBar = ({ chatData }: ChatBoxProps) => {
    return (
               <div className="flex flex-1 justify-between items-center gap-3">
                    <div className="flex items-center gap-2">
                        <img
                            src={chatData?.user.avatar_url || avatar}
                            alt="avatar"
                            className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                            <h3 className="font-semibold text-white ">{chatData?.user.username}</h3>
                            <p className=" items-center gap-1 text-sm text-green-500 hidden lg:flex">
                                <GoDotFill /> Online
                            </p>
                        </div>
                    </div>


                    <button className="hidden lg:block" aria-label="Conversation info">
                    <IoIosInformationCircleOutline size={24} color="white" />
                </button>
                </div>
                 
    )
}

export default ChatUserBar