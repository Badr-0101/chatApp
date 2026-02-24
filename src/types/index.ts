export interface ISignInUser {
    email: string;
    password: string;
}
export interface INewUser {
    name: string;
    email: string;
    password: string;
}

export interface IprofileData {
    id: string;
    created_at: string;
    username: string;
    email: string;
    avatar_url: string;
    bio: string;
    is_online: boolean;
    last_seen: string;
    updated_at: string;
}
export interface ICurentUser {
    id: string;
    email: string;
    access_token: string;
}
export interface IMessage {
    message_id: string;
    created_at: string;
    conversation_id: string;
    sender_id: string;
    message_text: string;
    sent_at: string;
}

export interface IChatData {
    conversationId: string;
    user: IprofileData;
}
export type RequestStatus = "idle" | "loading" | "success" | "error";
export interface ChatBoxProps {
    chatData: IChatData | null;
    currentUserId?: string | null;
}