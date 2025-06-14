
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarContent, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

type Message = {
  id: string;
  lease_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender?: {
    first_name?: string;
    last_name?: string;
    email: string;
    role: string;
  };
};

type MessageThreadProps = {
  leaseId: string;
  tenantName: string;
  isLandlord?: boolean;
};

const MessageThread = ({ leaseId, tenantName, isLandlord = false }: MessageThreadProps) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (
            first_name,
            last_name,
            email,
            role
          )
        `)
        .eq('lease_id', leaseId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    setSending(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          lease_id: leaseId,
          sender_id: user.id,
          message: newMessage.trim(),
        })
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (
            first_name,
            last_name,
            email,
            role
          )
        `)
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      setNewMessage('');
      
      toast({
        title: "Message sent",
        description: "Your message has been delivered",
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const getSenderName = (message: Message) => {
    if (message.sender?.first_name || message.sender?.last_name) {
      return [message.sender.first_name, message.sender.last_name].filter(Boolean).join(' ');
    }
    return message.sender?.email || 'Unknown User';
  };

  useEffect(() => {
    fetchMessages();
  }, [leaseId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`messages_${leaseId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `lease_id=eq.${leaseId}`,
        },
        (payload) => {
          // Only add message if it's not from current user (to avoid duplicates)
          if (payload.new.sender_id !== user.id) {
            fetchMessages(); // Refetch to get sender info
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [leaseId, user]);

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0 border-b border-slate-700/50">
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <MessageCircle size={20} className="text-yellow-400" />
          Conversation with {isLandlord ? tenantName : 'Landlord'}
          {messages.length > 0 && (
            <Badge variant="outline" className="ml-auto text-slate-400 border-slate-600">
              {messages.length} messages
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.sender_id === user?.id;
              const senderName = getSenderName(message);
              const initials = getInitials(
                message.sender?.first_name,
                message.sender?.last_name,
                message.sender?.email
              );

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  {!isOwnMessage && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-slate-700 text-slate-300 text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[70%] ${isOwnMessage ? 'order-first' : ''}`}>
                    <div className={`rounded-2xl px-4 py-2 ${
                      isOwnMessage 
                        ? 'bg-yellow-500 text-slate-900' 
                        : 'bg-slate-700 text-slate-100'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.message}
                      </p>
                    </div>
                    
                    <div className={`flex items-center gap-2 mt-1 text-xs text-slate-400 ${
                      isOwnMessage ? 'justify-end' : 'justify-start'
                    }`}>
                      {!isOwnMessage && <span>{senderName}</span>}
                      <span>
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  {isOwnMessage && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-yellow-500 text-slate-900 text-xs">
                        {getInitials(profile?.first_name, profile?.last_name, profile?.email)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="flex-shrink-0 border-t border-slate-700/50 p-4">
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              className="flex-1 min-h-[40px] max-h-[120px] bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 resize-none"
              disabled={sending}
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-3"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageThread;
