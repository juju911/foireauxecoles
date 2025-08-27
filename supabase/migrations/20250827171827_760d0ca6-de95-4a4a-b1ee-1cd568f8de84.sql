-- Create a table for storing registrations
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  eventbrite_response JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no authentication)
CREATE POLICY "Anyone can insert registrations" 
ON public.registrations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view registrations" 
ON public.registrations 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_registrations_updated_at
BEFORE UPDATE ON public.registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();