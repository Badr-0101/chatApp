import { useState, useEffect, useRef, useCallback } from "react";
import { CiImageOn } from "react-icons/ci";
import { BsSend } from "react-icons/bs";
import { Input } from "@components/ui/input";
import type { IMessage, ChatBoxProps } from "@/types";
import { getMessages, sendMessage, subscribeToMessages } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";



const ChatBox = ({ chatData, currentUserId }: ChatBoxProps) => {
    const {isSidebarOpen} = useAppSelector(state => state.style);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);


    const messagesEndRef = useRef<HTMLDivElement | null>(null);

   
    const sentMessageIds = useRef<Set<string>>(new Set());

    
    const onRealtimeMessageRef = useRef<(msg: IMessage) => void>(() => {});

    onRealtimeMessageRef.current = (incomingMsg: IMessage) => {

        if (sentMessageIds.current.has(incomingMsg.message_id)) {
            sentMessageIds.current.delete(incomingMsg.message_id);
            return;
        }

        setMessages((prev) => {
            if (prev.some((m) => m.message_id === incomingMsg.message_id)) {
                return prev;
            }
            return [...prev, incomingMsg];
        });
    };

    const conversationId = chatData?.conversationId ?? null;

    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            return;
        }


       
        let cancelled = false;

        const fetchMessages = async () => {
            try {
                const result = await getMessages(conversationId);
                if (cancelled) return; 
                if (result.success && result.data) {
                    setMessages(result.data as IMessage[]);
                } else {
                    throw new Error("Failed to load messages");
                }
            } catch (err) {
                if (!cancelled) {
                    throw new Error("Failed to load messages");
                }
            }
        };

        fetchMessages();

        const subscription = subscribeToMessages(
            conversationId,
            (msg) => onRealtimeMessageRef.current(msg)
        );

        return () => {
            cancelled = true;
            subscription.unsubscribe();
            sentMessageIds.current.clear();
        };
    }, [conversationId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = useCallback(async () => {
        if (!newMessage.trim()) return;
        if (!conversationId) return;
        if (!currentUserId) return;
        if (isSending) return;

        setIsSending(true);

        const tempId = `temp-${Date.now()}`;
        const tempMessage: IMessage = {
            message_id: tempId,
            conversation_id: conversationId,
            sender_id: currentUserId,
            message_text: newMessage,
            created_at: new Date().toISOString(),
        };

        const content = newMessage;
        setMessages((prev) => [...prev, tempMessage]);
        setNewMessage(""); // Clear input immediately for snappy UX

        try {
            const result = await sendMessage(conversationId, currentUserId, content);

            if (!result.success) {

                // Roll back optimistic message
                setMessages((prev) =>
                    prev.filter((msg) => msg.message_id !== tempId)
                );
                setNewMessage(content); 
            } else {
                const realMessage = Array.isArray(result.data) && result.data[0]
                    ? (result.data[0] as IMessage)
                    : null;

                if (realMessage) {
                    sentMessageIds.current.add(realMessage.message_id);

                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.message_id === tempId ? realMessage : msg
                        )
                    );
                }
            }
        } catch (err) {

            setMessages((prev) => prev.filter((msg) => msg.message_id !== tempId));
            setNewMessage(content);
        } finally {
            setIsSending(false);
        }
    }, [newMessage, conversationId, currentUserId, isSending]);

    if (!chatData) {
        return (
            <div className="flex h-full items-center justify-center bg-primary/95">
                <p className="text-gray-500">select a chat</p>
            </div>
        );
    }

    return (
        <div className={`flex h-full flex-col ${isSidebarOpen ? "ml-64" : ""}`}>


            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-primary/70">
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-gray-400"> there are no messages</p>                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMyMessage = msg.sender_id === currentUserId;
                        const isTemp = msg.message_id.startsWith("temp-");

                        return (
                            <div
                                key={msg.message_id}
                                className={`mb-3 flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg p-3 transition-opacity ${
                                        isMyMessage
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-800"
                                    } ${isTemp ? "opacity-60" : "opacity-100"}`}
                                >
                                    <p className="break-words">{msg.message_text}</p>
                                    <p
                                        className={`mt-1 text-xs ${
                                            isMyMessage ? "text-blue-100" : "text-gray-500"
                                        }`}
                                    >
                                        {new Date(msg.created_at).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                        {isTemp && "sending..."}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4 bg-white">
                <div className="flex items-center gap-2">
                    <button className="text-gray-500" aria-label="Attach image">
                        <CiImageOn size={24} />
                    </button>
                    <Input
                        type="text"
                        placeholder="sent a message ..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        disabled={isSending}
                        className="flex-1"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isSending || !newMessage.trim()}
                        aria-label="Send message"
                        className="rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600 disabled:opacity-50"
                    >
                        <BsSend size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;