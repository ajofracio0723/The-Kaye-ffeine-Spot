-- Enable RLS and basic policies for products so authenticated users can CRUD

-- Enable RLS on products (safe if already enabled)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view products
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'products'
      AND policyname = 'Authenticated users can view products'
  ) THEN
    CREATE POLICY "Authenticated users can view products"
      ON public.products
      FOR SELECT
      USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- Allow authenticated users to insert products
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'products'
      AND policyname = 'Authenticated users can insert products'
  ) THEN
    CREATE POLICY "Authenticated users can insert products"
      ON public.products
      FOR INSERT
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- Allow authenticated users to update products
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'products'
      AND policyname = 'Authenticated users can update products'
  ) THEN
    CREATE POLICY "Authenticated users can update products"
      ON public.products
      FOR UPDATE
      USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- Optional: keep updated_at in sync if the helper function exists
DO $$ BEGIN
  PERFORM 1 FROM pg_proc WHERE proname = 'update_updated_at_column';
  IF FOUND THEN
    -- Drop existing trigger if present, then recreate
    IF EXISTS (
      SELECT 1 FROM pg_trigger
      WHERE tgname = 'update_products_updated_at'
    ) THEN
      DROP TRIGGER update_products_updated_at ON public.products;
    END IF;
    CREATE TRIGGER update_products_updated_at
      BEFORE UPDATE ON public.products
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;


