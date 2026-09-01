-- ====================================================================
-- ESTOY EN CLARO — GUÍA COMERCIAL Y TURÍSTICA DE CLAROMECÓ, ARGENTINA
-- Esquema de Base de Datos Supabase (PostgreSQL) con Políticas RLS
-- ====================================================================

-- 1. EXTENSIONES Y TIPOS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE tipo_promo AS ENUM ('dia_semana', 'rango_fecha');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABLA: CATEGORIAS
CREATE TABLE IF NOT EXISTS categorias (
    id TEXT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    orden INT NOT NULL DEFAULT 0,
    icono VARCHAR(50) NOT NULL DEFAULT 'tag',
    subcategorias TEXT[] DEFAULT '{}',
    color VARCHAR(30) DEFAULT 'blue',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABLA: PLANES
CREATE TABLE IF NOT EXISTS planes (
    id TEXT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    precio NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    muestra_redes BOOLEAN NOT NULL DEFAULT false,
    destacado_categoria BOOLEAN NOT NULL DEFAULT false,
    destacado_home BOOLEAN NOT NULL DEFAULT false,
    permite_promos BOOLEAN NOT NULL DEFAULT false,
    permite_imagen_historia BOOLEAN NOT NULL DEFAULT false,
    color_badge VARCHAR(30) DEFAULT 'slate',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABLA: COMERCIOS
CREATE TABLE IF NOT EXISTS comercios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(150) NOT NULL,
    slug VARCHAR(180) UNIQUE NOT NULL,
    categoria_id TEXT NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
    subcategoria VARCHAR(80) NOT NULL,
    descripcion TEXT NOT NULL,
    telefono VARCHAR(50),
    whatsapp VARCHAR(50),
    direccion VARCHAR(200) NOT NULL,
    lat NUMERIC(10, 7),
    lng NUMERIC(10, 7),
    horario VARCHAR(150) NOT NULL DEFAULT 'Consultar horario',
    plan_id TEXT NOT NULL REFERENCES planes(id) ON DELETE RESTRICT DEFAULT 'gratis',
    logo_url TEXT,
    imagen_portada_url TEXT,
    fotos TEXT[] DEFAULT '{}',
    instagram VARCHAR(100),
    facebook VARCHAR(100),
    web TEXT,
    activo BOOLEAN NOT NULL DEFAULT true,
    zona VARCHAR(80) DEFAULT 'Claromecó Centro',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABLA: PROMOS
CREATE TABLE IF NOT EXISTS promos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comercio_id UUID NOT NULL REFERENCES comercios(id) ON DELETE CASCADE,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    tipo tipo_promo NOT NULL DEFAULT 'dia_semana',
    dia_semana INT CHECK (dia_semana >= 0 AND dia_semana <= 6), -- 0=Domingo, 1=Lunes, ... 6=Sábado
    fecha_inicio DATE,
    fecha_fin DATE,
    activa BOOLEAN NOT NULL DEFAULT true,
    descuento_porcentaje INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_promo_tipo CHECK (
        (tipo = 'dia_semana' AND dia_semana IS NOT NULL) OR
        (tipo = 'rango_fecha' AND fecha_inicio IS NOT NULL AND fecha_fin IS NOT NULL)
    )
);

-- 6. ÍNDICES DE ALTO RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_comercios_categoria ON comercios(categoria_id) WHERE activo = true;
CREATE INDEX IF NOT EXISTS idx_comercios_slug ON comercios(slug);
CREATE INDEX IF NOT EXISTS idx_comercios_plan ON comercios(plan_id);
CREATE INDEX IF NOT EXISTS idx_promos_comercio ON promos(comercio_id) WHERE activa = true;
CREATE INDEX IF NOT EXISTS idx_promos_dia_semana ON promos(dia_semana) WHERE activa = true;

-- 7. TRIGGER PARA UPDATED_AT EN COMERCIOS
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_comercios_updated_at ON comercios;
CREATE TRIGGER trigger_comercios_updated_at
    BEFORE UPDATE ON comercios
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- ====================================================================
-- 8. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- El frontend público (anon key) SOLO puede LEER registros activos.
-- Escritura/modificación bloqueada para usuarios anónimos.
-- ====================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE planes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comercios ENABLE ROW LEVEL SECURITY;
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;

-- Reglas para CATEGORIAS
DROP POLICY IF EXISTS "Lectura publica de categorias" ON categorias;
CREATE POLICY "Lectura publica de categorias"
    ON categorias FOR SELECT
    TO anon, authenticated
    USING (true);

-- Reglas para PLANES
DROP POLICY IF EXISTS "Lectura publica de planes" ON planes;
CREATE POLICY "Lectura publica de planes"
    ON planes FOR SELECT
    TO anon, authenticated
    USING (true);

-- Reglas para COMERCIOS: Público solo lee comercios activos
DROP POLICY IF EXISTS "Lectura publica de comercios activos" ON comercios;
CREATE POLICY "Lectura publica de comercios activos"
    ON comercios FOR SELECT
    TO anon, authenticated
    USING (activo = true);

-- Reglas para PROMOS: Público solo lee promos activas de comercios activos
DROP POLICY IF EXISTS "Lectura publica de promos activas" ON promos;
CREATE POLICY "Lectura publica de promos activas"
    ON promos FOR SELECT
    TO anon, authenticated
    USING (
        activa = true AND
        EXISTS (
            SELECT 1 FROM comercios c
            WHERE c.id = promos.comercio_id AND c.activo = true
        )
    );

-- Políticas de administración (requiere rol service_role o usuario autenticado admin)
DROP POLICY IF EXISTS "Admin full access categorias" ON categorias;
CREATE POLICY "Admin full access categorias"
    ON categorias FOR ALL
    TO service_role
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access planes" ON planes;
CREATE POLICY "Admin full access planes"
    ON planes FOR ALL
    TO service_role
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access comercios" ON comercios;
CREATE POLICY "Admin full access comercios"
    ON comercios FOR ALL
    TO service_role
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access promos" ON promos;
CREATE POLICY "Admin full access promos"
    ON promos FOR ALL
    TO service_role
    USING (true) WITH CHECK (true);

-- ====================================================================
-- 9. VISTAS AUXILIARES ÚTILES PARA EL FRONTEND
-- ====================================================================

-- Vista para consultar comercios con los datos del plan y promos vigentes hoy
CREATE OR REPLACE VIEW vista_comercios_publicos AS
SELECT 
    c.*,
    p.nombre AS plan_nombre,
    p.muestra_redes,
    p.destacado_categoria,
    p.destacado_home,
    p.permite_promos
FROM comercios c
JOIN planes p ON c.plan_id = p.id
WHERE c.activo = true;

-- ====================================================================
-- 10. DATOS INICIALES (SEED DATA) — CLAROMECÓ Y DUNAMAR
-- ====================================================================

-- Insertar Planes
INSERT INTO planes (id, nombre, precio, muestra_redes, destacado_categoria, destacado_home, permite_promos, permite_imagen_historia, color_badge)
VALUES
    ('gratis', 'Plan Gratis', 0.00, false, false, false, false, false, 'slate'),
    ('bronce', 'Plan Bronce', 5500.00, true, false, false, false, false, 'amber-700'),
    ('plata', 'Plan Plata', 11500.00, true, true, false, true, false, 'slate-400'),
    ('oro', 'Plan Oro', 22000.00, true, true, true, true, true, 'amber-400')
ON CONFLICT (id) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    muestra_redes = EXCLUDED.muestra_redes,
    destacado_categoria = EXCLUDED.destacado_categoria,
    destacado_home = EXCLUDED.destacado_home,
    permite_promos = EXCLUDED.permite_promos,
    permite_imagen_historia = EXCLUDED.permite_imagen_historia,
    color_badge = EXCLUDED.color_badge;

-- Insertar las 8 Categorías Oficiales de Claromecó y Dunamar
INSERT INTO categorias (id, nombre, orden, icono, subcategorias, color)
VALUES
    ('gastronomia', 'Gastronomía', 1, 'utensils', ARRAY['Parrillas y Asadores', 'Pizzerías y Empanadas', 'Restaurantes y Minutas', 'Cafeterías y Desayunos', 'Heladerías Artesanales', 'Cervecerías y Hamburguesas', 'Pastas Caseras'], 'amber'),
    ('alojamiento', 'Alojamiento', 2, 'hotel', ARRAY['Cabañas en Dunamar', 'Hoteles y Hosterías', 'Casas y Deptos Temporarios', 'Campings y Complejos'], 'sky'),
    ('inmobiliarias_alquileres', 'Inmobiliarias y Alquileres', 3, 'building-2', ARRAY['Alquileres de Temporada', 'Venta de Casas y Chalets', 'Terrenos y Lotes en Dunamar', 'Tasaciones e Inversiones'], 'blue'),
    ('almacenes_kioscos', 'Almacenes y Kioscos', 4, 'shopping-bag', ARRAY['Supermercados y Autoservicios', 'Kioscos 24hs y Bebidas', 'Panaderías y Confiterías', 'Carnicerías y Pescaderías', 'Verdulerías y Fruterías'], 'emerald'),
    ('servicios_oficios', 'Servicios y Oficios', 5, 'wrench', ARRAY['Ferretería', 'Electricista', 'Plomero', 'Gasista', 'Cerrajero', 'Gomería', 'Construcción y Corralón', 'Veterinarias y Mascotas'], 'indigo'),
    ('compras_regaleria', 'Compras y Regalería', 6, 'gift', ARRAY['Regalerías y Souvenirs', 'Indumentaria y Mallas', 'Artículos de Playa y Juguetes', 'Artesanías y Decoración', 'Bazar y Accesorios'], 'rose'),
    ('comercios_gral', 'Comercios en Gral.', 7, 'store', ARRAY['Casas de Pesca y Carnada', 'Kioscos de Diarios y Revistas', 'Librerías e Impresiones', 'Ópticas y Fotografía', 'Varios y Distribución'], 'slate'),
    ('turismo_deportes', 'Turismo y Deportes', 8, 'compass', ARRAY['Alquileres y Excursiones (Kayak, Bicis, Pesca Embarcada)', 'Entretenimiento y Paseos', 'Paradores de Playa', 'Deportes (Pádel, Fútbol 5, Surf)'], 'cyan')
ON CONFLICT (id) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    orden = EXCLUDED.orden,
    icono = EXCLUDED.icono,
    subcategorias = EXCLUDED.subcategorias,
    color = EXCLUDED.color;
