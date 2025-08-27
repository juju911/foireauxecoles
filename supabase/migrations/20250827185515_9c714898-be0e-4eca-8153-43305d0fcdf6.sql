-- Créer un système de gestion des rôles pour sécuriser l'accès aux registrations

-- 1. Créer un enum pour les rôles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. Créer la table des rôles utilisateur
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 3. Activer RLS sur la table user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Créer une fonction sécurisée pour vérifier les rôles
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

-- 5. Créer une fonction pour vérifier si l'utilisateur actuel est admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- 6. Supprimer la politique actuelle non sécurisée
DROP POLICY IF EXISTS "Application can view registrations" ON public.registrations;

-- 7. Créer une nouvelle politique sécurisée - seuls les admins peuvent voir les registrations
CREATE POLICY "Only admins can view registrations" 
ON public.registrations 
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- 8. Créer des politiques pour la gestion des rôles
CREATE POLICY "Admins can view all user roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can manage user roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (public.is_admin());

-- 9. Politique pour permettre aux utilisateurs de voir leurs propres rôles
CREATE POLICY "Users can view their own roles" 
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
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();