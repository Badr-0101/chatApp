import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import supabase from '@/lib/config';
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import {clearChat} from "@/store/chatSlice"
import Logo from "@assets/images/logo-Big.png"
import ChatUserBar from "./ChatUserBar"
import { toggleSidebar } from "@/store/styleSlice";

import type { ChatBoxProps } from "@/types";

const UserBar = ({ chatData }: ChatBoxProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const handleLogout = async () => {
        await supabase.auth.signOut();
        dispatch(logout());
        dispatch(clearChat());
        navigate('/signin');
        
    };
    const handleMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    return (
        <div>
                        {/* Header */}
            <div className="flex  gap-4 items-center justify-between  p-4 bg-primary">
                <div className="flex items-center gap-1 justify-between bg-primary" >
                    <div className="flex items-center gap-2">
                    <div className="">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover:bg-transparent cursor-pointer hover:bg-blue-500 "
                            aria-label="Menu options"
                            onClick={() => dispatch(toggleSidebar())}

                        >
                            <RxHamburgerMenu color="white" size={24} />
                        </Button>
                    </div>
                    <img src={Logo} alt="Chat App Logo" className="w-24" />
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className=" relative hover:bg-blue-500 "
                        aria-label="Menu options"
                        onClick={handleMenuOpen}
                    >
                        <HiOutlineDotsVertical color="white" size={24} />
                        <div className={`absolute top-7 right-0 flex ${isMenuOpen ? "flex" : "hidden"} flex-col gap-2 bg-white transition-all duration-300 ease-in-out p-2 rounded-lg shadow-lg z-10`}>
                            <div 
                                onClick={() => navigate('/profile-update')}
                                className="cursor-pointer bg-white hover:bg-gray-200 p-2 text-center rounded-md text-black transition-colors"
                            >
                                Edit Profile
                            </div>
                            <div 
                                onClick={handleLogout}
                                className="cursor-pointer bg-white hover:bg-gray-200 p-2 text-center rounded-md text-black transition-colors"
                            >
                                Logout
                            </div>
                        </div>
                    </Button>
                </div>
                {/* Chat User Bar */}
                {chatData && <ChatUserBar chatData={chatData} />}

   
            </div>
        </div>
    )
}

export default UserBar
