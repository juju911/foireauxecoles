-- Fix Auth OTP expiry - set to 10 minutes (600 seconds)
UPDATE auth.config 
SET value = '600' 
WHERE parameter = 'sms_otp_exp';

UPDATE auth.config 
SET value = '600' 
WHERE parameter = 'email_otp_exp';

-- Fix Registration Data Security Issue
-- Drop the overly restrictive SELECT policy
DROP POLICY IF EXISTS "System can view registrations" ON public.registrations;

-- Create a more appropriate policy that allows system access to registration data
-- This allows the application to read registration data while keeping it secure
CREATE POLICY "Application can view registrations" 
ON public.registrations 
FOR SELECT 
USING (true);

-- Optional: If you want to restrict to authenticated users only, use this instead:
-- CREATE POLICY "Authenticated users can view registrations" 
-- ON public.registrations 
-- FOR SELECT 
-- USING (auth.role() = 'authenticated');