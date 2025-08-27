-- Remove the insecure policy that allows anyone to view all registrations
DROP POLICY IF EXISTS "Anyone can view registrations" ON public.registrations;

-- Create a more secure policy that only allows system access for viewing registrations
-- In a real application, you would typically restrict this to authenticated admin users
-- For now, we'll remove public read access entirely since this is sensitive customer data
CREATE POLICY "System can view registrations" 
ON public.registrations 
FOR SELECT 
USING (false); -- This effectively blocks all public read access

-- Keep the insert policy as it allows new registrations
-- The insert policy is needed for the registration form to work