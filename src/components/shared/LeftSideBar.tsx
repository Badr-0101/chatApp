import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { Button } from "../ui/button";
import UserCard from "./UserCard"
import { searchUsers, checkOrCreateConversation } from "@/lib/api";
import type { IprofileData } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setChat } from "@/store/chatSlice";

const LeftSideBar = () => {
    const isSidebarOpen = useAppSelector(state => state.style.isSidebarOpen);
    const dispatch = useAppDispatch();
    const currentUserId = useAppSelector(state => state.auth.id);
    const currentChat = useAppSelector(state => state.chat.currentChat);
    
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<IprofileData[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    
   

  const handleSelectUser = async (selectedUser: IprofileData) => {
        if (!currentUserId) return;
        if (currentChat?.user.id === selectedUser.id) {
            return;
        }
        
    const result = await checkOrCreateConversation(currentUserId, selectedUser.id);
    console.log("result",result);
        
        if (result.success && result.conversationId) {
            dispatch(setChat({
                conversationId: result.conversationId,
                user: selectedUser
            }));
             setSearchQuery("");
        } else {
            console.error("Failed to start conversation:", result.error);
        }
    };


    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setError("");
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsSearching(true);
            setError("");

            try {
                const result = await searchUsers(searchQuery);
                
                if (result.success && result.data) {
                    setSearchResults(result.data as IprofileData[]);
                } else {
                    setError(result.error || "Failed to fetch users");
                    setSearchResults([]);
                }
            } catch {
                setError("An unexpected error occurred");
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 500); 

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

  
    return (
        <>
                        
          {/* Header Section */}
                

            
            <div className={`w-[250px] h-1/2 overflow-y-auto absolute bg-primary p-4  flex-col lg:flex ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'} transition-all duration-300 ease-in-out`}>

            {/* Search Section */}
            <div className="bg-secondary flex items-center mt-4 rounded-md px-2 py-1">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-transparent"
                    aria-label="Search users"
                >
                    <CiSearch color="white" size={20} />
                </Button>
                <input
                    type="text"
                    placeholder="Search users..."
                    className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search input"
                />
            </div>

            {/* Search Status Messages */}
            {isSearching && (
                <p className="text-gray-400 text-sm mt-2 text-center">Searching...</p>
            )}
            {error && (
                <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
            )}

            <div className="flex-1 overflow-y-auto mt-4 space-y-1">
                {searchQuery.trim() === "" ? (
                    <p className="text-gray-400 text-sm text-center mt-4">Search for users to chat</p>
                ) : searchResults.length > 0 ? (
                    // Show search results
                searchResults.map((user) => (
          
                        <UserCard 
                            key={user.id} 
                            user={user}
                            userChat={handleSelectUser}
                        />
                    ))
                ) : !isSearching && !error ? (
                    <p className="text-gray-400 text-sm text-center mt-4">
                        No users found
                    </p>
                ) : null}
            </div>
          
            </div>
            </>
    )
}

export default  LeftSideBar
