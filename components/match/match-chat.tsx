"use client";

import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface MatchChatProps {
  matchId: string;
}

interface ChatMessage {
  id: string;
  message: string;
  created_at: string;
  sender: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export function MatchChat({ matchId }: MatchChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Subscribe to new messages
  useEffect(() => {
    const channel = supabase
      .channel(`match-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'match_chat',
          filter: `match_id=eq.${matchId}`
        },
        async (payload) => {
          // Fetch the complete message with sender info
          const { data: newMessage } = await supabase
            .from('match_chat')
            .select(`
              id,
              message,
              created_at,
              sender:sender_id(
                full_name,
                avatar_url
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (newMessage) {
            setMessages(prev => [...prev, {
              ...newMessage,
              sender: newMessage.sender[0] || { full_name: null, avatar_url: null }
            } as ChatMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  // Load existing messages
  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('match_chat')
        .select(`
          id,
          message,
          created_at,
          sender:sender_id(
            full_name,
            avatar_url
          )
        `)
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      setMessages(data?.map(msg => ({
        ...msg,
        sender: msg.sender[0] || { full_name: null, avatar_url: null }
      })) || []);
    };

    loadMessages();
  }, [matchId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('match_chat')
        .insert({
          match_id: matchId,
          message: newMessage.trim(),
          sender_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={msg.sender.avatar_url || undefined} />
              <AvatarFallback>
                {msg.sender.full_name?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-sm">
                  {msg.sender.full_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm">{msg.message}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !newMessage.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
} 