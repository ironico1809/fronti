-- ============================================================================
-- SCRIPT DE INSERTS PARA AREAS COMUNES - SMART CONDOMINIUM (DJANGO)
-- ============================================================================
-- Este script está adaptado para usar los nombres de tabla y campos que Django genera

-- ============================================================================
-- INSERTS DE DATOS DE EJEMPLO
-- ============================================================================

-- 1. INSERTAR ÁREAS COMUNES (tabla: areas_areacomun)
INSERT INTO areas_areacomun (nombre, descripcion, aforo_maximo, precio_hora, reglas, estado) VALUES
('Salón de Eventos', 'Amplio salón para celebraciones y eventos especiales con capacidad para 100 personas', 100, 150.00, 
 'No se permiten mascotas. Prohibido fumar. Limpieza obligatoria después del evento. Música hasta las 22:00h.', 'ACTIVO'),

('Piscina Adultos', 'Piscina principal para adultos con sistema de filtración y calefacción', 25, 0.00,
 'Uso exclusivo para mayores de 18 años. Horario: 6:00 - 22:00. Obligatorio uso de gorro de baño.', 'ACTIVO'),

('Piscina Infantil', 'Piscina diseñada especialmente para niños menores de 12 años', 15, 0.00,
 'Niños menores de 8 años deben estar acompañados por un adulto. Profundidad máxima 0.80m.', 'ACTIVO'),

('Cancha de Tenis', 'Cancha profesional de tenis con superficie de polvo de ladrillo', 4, 25.00,
 'Reserva máxima 2 horas por día. Traer raquetas y pelotas propias. Calzado deportivo obligatorio.', 'ACTIVO'),

('Cancha Multideporte', 'Cancha versátil para fútbol, básquet y vóley', 20, 30.00,
 'Reserva máxima 2 horas por día. Prohibido uso de zapatos con tapones de metal.', 'ACTIVO'),

('Gimnasio', 'Gimnasio equipado con máquinas cardiovasculares y pesas', 15, 0.00,
 'Uso de toalla obligatorio. Limpiar equipos después del uso. Menores de 16 años con supervisión.', 'ACTIVO'),

('Sala de Juegos', 'Sala de entretenimiento con mesa de pool, ping pong y juegos de mesa', 12, 10.00,
 'No se permite ingreso de bebidas. Mantener orden y limpieza.', 'ACTIVO'),

('Quincho BBQ', 'Área de parrilla con mesas y sillas para asados familiares', 30, 40.00,
 'Traer carbón propio. Limpiar parrilla después del uso. Prohibido dejar brasas encendidas.', 'ACTIVO'),

('Sala de Reuniones', 'Sala equipada con proyector y sistema de audio para reuniones', 20, 20.00,
 'Reserva con 24h de anticipación. No consumo de alimentos. Devolver mobiliario a su lugar.', 'ACTIVO'),

('Jardín Infantil', 'Área de juegos para niños con juegos seguros y superficie amortiguada', 25, 0.00,
 'Niños menores de 5 años con supervisión de adultos. Uso durante horario diurno únicamente.', 'MANTENIMIENTO');

-- 2. INSERTAR HORARIOS PARA CADA ÁREA (tabla: areas_horarioarea)
-- Nota: Los IDs de las áreas se obtienen de la tabla anterior. Asumiendo que se insertaron con IDs 1-10.

-- Salón de Eventos (ID: 1)
INSERT INTO areas_horarioarea (area_id, dia_semana, activo, hora_apertura, hora_cierre, slots_por_hora) VALUES
(1, 'lunes', true, '08:00', '22:00', 1),
(1, 'martes', true, '08:00', '22:00', 1),
(1, 'miercoles', true, '08:00', '22:00', 1),
(1, 'jueves', true, '08:00', '22:00', 1),
(1, 'viernes', true, '08:00', '23:00', 1),
(1, 'sabado', true, '08:00', '23:00', 1),
(1, 'domingo', true, '08:00', '22:00', 1);

-- Piscina Adultos (ID: 2)
INSERT INTO areas_horarioarea (area_id, dia_semana, activo, hora_apertura, hora_cierre, slots_por_hora) VALUES
(2, 'lunes', true, '06:00', '22:00', 25),
(2, 'martes', true, '06:00', '22:00', 25),
(2, 'miercoles', true, '06:00', '22:00', 25),
(2, 'jueves', true, '06:00', '22:00', 25),
(2, 'viernes', true, '06:00', '23:00', 25),
(2, 'sabado', true, '07:00', '23:00', 25),
(2, 'domingo', true, '07:00', '22:00', 25);

-- Piscina Infantil (ID: 3)
INSERT INTO areas_horarioarea (area_id, dia_semana, activo, hora_apertura, hora_cierre, slots_por_hora) VALUES
(3, 'lunes', true, '08:00', '20:00', 15),
(3, 'martes', true, '08:00', '20:00', 15),
(3, 'miercoles', true, '08:00', '20:00', 15),
(3, 'jueves', true, '08:00', '20:00', 15),
(3, 'viernes', true, '08:00', '21:00', 15),
(3, 'sabado', true, '08:00', '21:00', 15),
(3, 'domingo', true, '08:00', '20:00', 15);

-- Cancha de Tenis (ID: 4)
INSERT INTO areas_horarioarea (area_id, dia_semana, activo, hora_apertura, hora_cierre, slots_por_hora) VALUES
(4, 'lunes', true, '07:00', '21:00', 1),
(4, 'martes', true, '07:00', '21:00', 1),
(4, 'miercoles', true, '07:00', '21:00', 1),
(4, 'jueves', true, '07:00', '21:00', 1),
(4, 'viernes', true, '07:00', '22:00', 1),
(4, 'sabado', true, '07:00', '22:00', 1),
(4, 'domingo', true, '08:00', '20:00', 1);

-- Cancha Multideporte (ID: 5)
INSERT INTO areas_horarioarea (area_id, dia_semana, activo, hora_apertura, hora_cierre, slots_por_hora) VALUES
(5, 'lunes', true, '07:00', '21:00', 1),
(5, 'martes', true, '07:00', '21:00', 1),
(5, 'miercoles', true, '07:00', '21:00', 1),
(5, 'jueves', true, '07:00', '21:00', 1),
(5, 'viernes', true, '07:00', '22:00', 1),
(5, 'sabado', true, '07:00', '22:00', 1),
(5, 'domingo', true, '08:00', '20:00', 1);

-- Gimnasio (ID: 6)
INSERT INTO areas_horarioarea (area_id, dia_semana, activo, hora_apertura, hora_cierre, slots_por_hora) VALUES
(6, 'lunes', true, '05:00', '23:00', 15),
(6, 'martes', true, '05:00', '23:00', 15),
(6, 'miercoles', true, '05:00', '23:00', 15),
(6, 'jueves', true, '05:00', '23:00', 15),
(6, 'viernes', true, '05:00', '23:00', 15),
(6, 'sabado', true, '06:00', '22:00', 15),
(6, 'domingo', false, null, null, 15); -- Cerrado los domingos

-- Sala de Juegos (ID: 7)
INSERT INTO areas_horarioarea (area_id, dia_semana, activo, hora_apertura, hora_cierre, slots_por_hora) VALUES
(7, 'lunes', true, '10:00', '22:00', 12),
(7, 'martes', true, '10:00', '22:00', 12),
(7, 'miercoles', true, '10:00', '22:00', 12),
(7, 'jueves', true, '10:00', '22:00', 12),
(7, 'viernes', true, '10:00', '23:00', 12),
(7, 'sabado', true, '09:00', '23:00', 12),
(7, 'domingo', true, '10:00', '22:00', 12);

-- Quincho BBQ (ID: 8)
INSERT INTO areas_horarioarea (area_id, dia_semana, activo, hora_apertura, hora_cierre, slots_por_hora) VALUES
(8, 'lunes', true, '09:00', '22:00', 1),
(8, 'martes', true, '09:00', '22:00', 1),
(8, 'miercoles', true, '09:00', '22:00', 1),
(8, 'jueves', true, '09:00', '22:00', 1),
(8, 'viernes', true, '09:00', '23:00', 1),
(8, 'sabado', true, '08:00', '23:00', 1),
(8, 'domingo', true, '08:00', '22:00', 1);

-- Sala de Reuniones (ID: 9)
INSERT INTO areas_horarioarea (area_id, dia_semana, activo, hora_apertura, hora_cierre, slots_por_hora) VALUES
(9, 'lunes', true, '08:00', '20:00', 2),
(9, 'martes', true, '08:00', '20:00', 2),
(9, 'miercoles', true, '08:00', '20:00', 2),
(9, 'jueves', true, '08:00', '20:00', 2),
(9, 'viernes', true, '08:00', '18:00', 2),
(9, 'sabado', true, '09:00', '17:00', 2),
(9, 'domingo', false, null, null, 2); -- Cerrado los domingos

-- Jardín Infantil (ID: 10) - En mantenimiento
INSERT INTO areas_horarioarea (area_id, dia_semana, activo, hora_apertura, hora_cierre, slots_por_hora) VALUES
(10, 'lunes', false, null, null, 25),
(10, 'martes', false, null, null, 25),
(10, 'miercoles', false, null, null, 25),
(10, 'jueves', false, null, null, 25),
(10, 'viernes', false, null, null, 25),
(10, 'sabado', false, null, null, 25),
(10, 'domingo', false, null, null, 25);

-- 3. INSERTAR FECHAS ESPECIALES (tabla: areas_fechaespecial)
INSERT INTO areas_fechaespecial (nombre, fecha, tipo, descripcion, activo) VALUES
('Año Nuevo', '2024-01-01', 'FERIADO', 'Año Nuevo - Todas las áreas cerradas', true),
('Navidad', '2024-12-25', 'FERIADO', 'Navidad - Todas las áreas cerradas', true),
('Día de la Independencia', '2024-07-20', 'FERIADO', 'Día de la Independencia - Todas las áreas cerradas', true),
('Día del Trabajador', '2024-05-01', 'FERIADO', 'Día del Trabajador - Todas las áreas cerradas', true),
('Mantenimiento Piscinas', '2024-03-15', 'MANTENIMIENTO', 'Mantenimiento general de piscinas', true),
('Reparación Tenis', '2024-06-10', 'MANTENIMIENTO', 'Reparación de cancha de tenis', true),
('Fiesta de la Primavera', '2024-08-15', 'EVENTO_ESPECIAL', 'Fiesta de la Primavera - Salón reservado para evento del condominio', true),
('Mantenimiento Gimnasio', '2024-11-30', 'MANTENIMIENTO', 'Mantenimiento anual del gimnasio', true),
('Fiestas Patrias', '2024-09-18', 'FERIADO', 'Fiestas Patrias - Todas las áreas cerradas', true),
('Asamblea General', '2024-10-12', 'EVENTO_ESPECIAL', 'Asamblea General de Propietarios', true);

-- ============================================================================
-- CONSULTAS DE VERIFICACIÓN
-- ============================================================================

-- Verificar que se insertaron las áreas correctamente
SELECT 'Áreas insertadas:' as info;
SELECT id, nombre, estado, precio_hora FROM areas_areacomun ORDER BY id;

-- Verificar horarios por área (primeras 3 áreas)
SELECT 'Horarios por área:' as info;
SELECT a.nombre, h.dia_semana, h.activo, h.hora_apertura, h.hora_cierre, h.slots_por_hora 
FROM areas_areacomun a 
JOIN areas_horarioarea h ON a.id = h.area_id 
WHERE a.id <= 3 
ORDER BY a.id, 
    CASE h.dia_semana 
        WHEN 'lunes' THEN 1 
        WHEN 'martes' THEN 2 
        WHEN 'miercoles' THEN 3 
        WHEN 'jueves' THEN 4 
        WHEN 'viernes' THEN 5 
        WHEN 'sabado' THEN 6 
        WHEN 'domingo' THEN 7 
    END;

-- Verificar fechas especiales
SELECT 'Fechas especiales:' as info;
SELECT nombre, fecha, tipo, descripcion FROM areas_fechaespecial ORDER BY fecha;

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================