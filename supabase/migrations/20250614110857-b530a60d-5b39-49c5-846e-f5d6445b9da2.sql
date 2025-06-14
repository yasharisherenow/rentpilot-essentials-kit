
-- Create messages table for landlord-tenant communication
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lease_id UUID NOT NULL REFERENCES public.leases(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for messages
-- Policy 1: Users can view messages for leases they are involved in (landlord or tenant)
CREATE POLICY "Users can view messages for their leases"
ON public.messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.leases l
    WHERE l.id = lease_id 
    AND (l.landlord_id = auth.uid() OR l.tenant_id = auth.uid())
  )
);

-- Policy 2: Users can insert messages for leases they are involved in
CREATE POLICY "Users can send messages for their leases"
ON public.messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.leases l
    WHERE l.id = lease_id 
    AND (l.landlord_id = auth.uid() OR l.tenant_id = auth.uid())
  )
  AND sender_id = auth.uid()
);

-- Policy 3: Users can update their own messages
CREATE POLICY "Users can update their own messages"
ON public.messages
FOR UPDATE
USING (sender_id = auth.uid())
WITH CHECK (sender_id = auth.uid());

-- Policy 4: Users can delete their own messages
CREATE POLICY "Users can delete their own messages"
ON public.messages
FOR DELETE
USING (sender_id = auth.uid());

-- Add trigger to update the updated_at column
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for tracking message read status
CREATE TABLE public.message_read_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- Enable RLS on message_read_status table
ALTER TABLE public.message_read_status ENABLE ROW LEVEL SECURITY;

-- RLS policy for message read status
CREATE POLICY "Users can manage their own read status"
ON public.message_read_status
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Add indexes for better performance
CREATE INDEX idx_messages_lease_id ON public.messages(lease_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_message_read_status_message_id ON public.message_read_status(message_id);
CREATE INDEX idx_message_read_status_user_id ON public.message_read_status(user_id);
