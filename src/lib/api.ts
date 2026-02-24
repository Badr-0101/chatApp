import supabase from "./config";
import type { INewUser, ISignInUser, IMessage } from "../types/index";





export async function signUpUser(user: INewUser) {
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      data: {
        name: user.name,
      },
    },
  } );

    console.log("data",data)
    if (error) {
      console.log("error from signUpUser api",error);
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("User creation failed");
  }

  return { success: true, data };
}




export async function signInUser(user: ISignInUser) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: user.password,
        });
        
        console.log(data.user.id)

        const { data: profile, error: profileError } = await supabase
            .from("profile")
            .select("*")
            .eq("id", data.user.id)
            .single();

        if (profileError || !profile) {
            return { success: false, error: "Email or password is wrong" };
        }

        return { success: true, data };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "thier is some thing wrong please try again later",
        };
    }
}

export async function searchUsers(userName: string) {
    try {
        const { data, error } = await supabase
            .from("profile")
            .select("*")
            .ilike("username", `${userName}%`);

        if (error) {
            console.error(error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}

export interface IProfile {
    username?: string;
    email?: string;
    avatar_url?: string;
    bio?: string;
    is_online?: boolean;
    last_seen?: string;
}

export async function createProfile(userId: string, profileData: IProfile) {
    try {
        const { data, error } = await supabase
            .from("profile")
            .insert({
                id: userId,
                username: profileData.username,
                email: profileData.email,
            })
            .select()
            .limit(1)
            .single();

        if (error) {
            console.error(error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}

export async function updateProfile(userId: string, profileData: IProfile) {
    console.log(userId)
    try {
        const { data, error } = await supabase
            .from("profile")
            .update({
                avatar_url: profileData.avatar_url,
                bio: profileData.bio,
                updated_at: new Date(),
            })
            .eq("id", userId)
            .select()

            .single();

        if (error) {
            console.error(error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}

export async function checkOrCreateConversation(currentUserId: string, otherUserId: string) {
    try {

        const { data: myConversations, error: myConvsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', currentUserId);
    
        if (myConvsError) throw myConvsError;

        if (myConversations && myConversations.length > 0) {
                const conversationIds = myConversations.map(c => c.conversation_id);
                
                const { data: existingConversation, error: existingConvError } = await supabase
                .from('conversation_participants')
                .select('conversation_id')
                .eq('user_id', otherUserId)
                .in('conversation_id', conversationIds)
                .limit(1)
                .maybeSingle(); 
            
            if (existingConvError) throw existingConvError;
            
            if (existingConversation) {
                return { success: true, conversationId: existingConversation.conversation_id };
            }
        }

  
        console.log("Creating new conversation");
        const { data: newConversation, error: createError } = await supabase
            .from('conversations')
            .insert({})
            .select()
            .limit(1)
            .single();

        if (createError) throw createError;

        
        const { error: participantsError } = await supabase
            .from('conversation_participants')
            .insert([
                { conversation_id: newConversation.id, user_id: currentUserId },
                { conversation_id: newConversation.id, user_id: otherUserId }
            ]);

        if (participantsError) throw participantsError;

        return { success: true, conversationId: newConversation.id };

    } catch (error) {
        console.error("Error in checkOrCreateConversation:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to create conversation" };
    }
}

export async function getMessages(conversationId: string) {
    console.log("Fetching messages for conversation:", conversationId);
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error(error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}

export async function sendMessage(conversationId: string, senderId: string, content: string) {
    console.log("Sending message:",  content);
    try {
        const { data, error } = await supabase
            .from('messages')
            .insert({
                conversation_id: conversationId,
                sender_id: senderId,
                message_text: content,
                sent_at: new Date()
            })
             .select('*')
      

        if (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
        
       
        await supabase
            .from('conversations')
            .update({ last_message_at: new Date() })
            .eq('id', conversationId);

        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to send message" };
    }
}


export function subscribeToMessages(
    conversationId: string,
    callback: (message: IMessage) => void
) {
    return supabase
        .channel(`messages:${conversationId}`)   
        .on('postgres_changes', {                 
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
            const message = payload.new as IMessage; 
            if (message?.message_id) {
                callback(message);
            }
        })
        .subscribe();                             
}

export async function getUserProfile(userId: string) {
    try {
        const { data, error } = await supabase
            .from("profile")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) {
            console.error(error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}

