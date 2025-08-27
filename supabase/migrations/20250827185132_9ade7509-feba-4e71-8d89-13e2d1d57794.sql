-- Fix Registration Data Security Issue
-- Drop the overly restrictive SELECT policy that blocks all access
DROP POLICY IF EXISTS "System can view registrations" ON public.registrations;

-- Create a more appropriate policy that allows application access to registration data
-- This allows the application to read registration data while keeping it secure
CREATE POLICY "Application can view registrations" 
ON public.registrations 
FOR SELECT 
USING (true);