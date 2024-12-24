import { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  message: string;
  created_at: string;
  sender: {
    full_name: string;
    avatar_url: string;
  };
}

interface MatchChatProps {
  matchId: string;
  isParticipant: boolean;
}

interface DatabaseMessage {
  id: string;
  message: string;
  created_at: string;
  sender: {
    full_name: string;
    avatar_url: string;
  };
}

export function MatchChat({ matchId, isParticipant }: MatchChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isParticipant) return;

    // Fetch existing messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('match_chat')
        .select(`
          id,
          message,
          created_at,
          sender:profiles!match_chat_sender_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      if (data) {
        console.log('Initial messages loaded:', data);
        setMessages(data as unknown as Message[]);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`match_chat:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'match_chat',
          filter: `match_id=eq.${matchId}`,
        },
        async (payload) => {
          console.log('Received real-time update:', payload);

          // Get the sender info
          const { data: senderData, error: senderError } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();

          if (senderError) {
            console.error('Error fetching sender:', senderError);
            return;
          }

          console.log('Sender data:', senderData);

          const newMessage: Message = {
            id: payload.new.id,
            message: payload.new.message,
            created_at: payload.new.created_at,
            sender: {
              full_name: senderData.full_name,
              avatar_url: senderData.avatar_url
            }
          };

          console.log('Adding new message to state:', newMessage);
          setMessages(current => [...current, newMessage]);
        }
      )
      .subscribe((status) => {
        console.log('Chat channel status:', status);
      });

    return () => {
      console.log('Cleaning up subscription');
      channel.unsubscribe();
    };
  }, [matchId, isParticipant]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('match_chat')
        .insert({
          match_id: matchId,
          message: newMessage.trim(),
          sender_id: userData.user?.id,
        });

      if (error) throw error;
      console.log('Message sent successfully');
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isParticipant) {
    return null;
  }

  return (
    <div className="flex flex-col h-[400px] border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={message.sender.avatar_url} />
              <AvatarFallback>{message.sender.full_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-sm">
                  {message.sender.full_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(message.created_at), 'HH:mm')}
                </span>
              </div>
              <p className="text-sm">{message.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
} 