-- Nettoyer et sécuriser complètement l'accès aux registrations

-- 1. Supprimer toutes les politiques existantes sur registrations
DROP POLICY IF EXISTS "Only admins can view registrations" ON public.registrations;
DROP POLICY IF EXISTS "Application can view registrations" ON public.registrations;
DROP POLICY IF EXISTS "System can view registrations" ON public.registrations;
DROP POLICY IF EXISTS "Anyone can insert registrations" ON public.registrations;

-- 2. Créer l'enum pour les rôles s'il n'existe pas déjà
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Créer la table des rôles utilisateur si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 4. Activer RLS sur la table user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 5. Supprimer les politiques existantes sur user_roles
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- 6. Créer une fonction sécurisée pour vérifier les rôles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 7. Créer une fonction pour vérifier si l'utilisateur actuel est admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- 8. NOUVELLES POLITIQUES SÉCURISÉES pour registrations
-- Seuls les admins authentifiés peuvent voir les registrations
CREATE POLICY "secure_registrations_select" 
ON public.registrations 
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- Permettre les inscriptions publiques (nécessaire pour le formulaire)
CREATE POLICY "public_registrations_insert" 
ON public.registrations 
FOR INSERT 
WITH CHECK (true);

-- 9. POLITIQUES pour user_roles
CREATE POLICY "admin_view_roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "admin_manage_roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (public.is_admin());

CREATE POLICY "user_view_own_role" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- 10. Créer une fonction pour attribuer le rôle admin au premier utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Si c'est le premier utilisateur, le faire admin automatiquement
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    -- Sinon, attribuer le rôle user par défaut
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  
  RETURN NEW;
END;
$$;

-- 11. Créer le trigger pour attribuer automatiquement les rôles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();