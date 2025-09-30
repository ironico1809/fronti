-- TABLAS PARA CONFIGURACIÓN DE PRECIOS (EXPENSAS, SERVICIOS, MULTAS)
CREATE TABLE cuota_servicio (
    id_cuota INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200),
    monto DECIMAL(10,2) NOT NULL,
    tipo VARCHAR(50),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE multa (
    id_multa INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(200),
    monto DECIMAL(10,2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE usuario (
    id_usuario INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    estado VARCHAR(20) DEFAULT 'ACTIVO'
);

CREATE TABLE rol (
    id_rol INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(100)
);

CREATE TABLE usuario_rol (
    id_usuario INT REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_rol INT REFERENCES rol(id_rol) ON DELETE CASCADE,
    PRIMARY KEY (id_usuario, id_rol)
);

CREATE TABLE permiso (
    id_permiso INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(100)
);

CREATE TABLE rol_permiso (
    id_rol INT REFERENCES rol(id_rol) ON DELETE CASCADE,
    id_permiso INT REFERENCES permiso(id_permiso) ON DELETE CASCADE,
    PRIMARY KEY (id_rol, id_permiso)
);

CREATE TABLE recuperacion_contrasena (
    id_token INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    token VARCHAR(100) NOT NULL,
    fecha_expiracion TIMESTAMP NOT NULL,
    usado BOOLEAN DEFAULT FALSE
);

CREATE TABLE cuota_servicio (
    id_cuota INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200),
    monto DECIMAL(10,2) NOT NULL,
    tipo VARCHAR(50),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE multa (
    id_multa INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(200),
    monto DECIMAL(10,2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pago (
    id_pago INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    id_cuota INT REFERENCES cuota_servicio(id_cuota) ON DELETE SET NULL,
    id_multa INT REFERENCES multa(id_multa) ON DELETE SET NULL,
    monto_pagado DECIMAL(10,2) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comprobante VARCHAR(255)
);

CREATE TABLE aviso (
    id_aviso INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    cuerpo TEXT NOT NULL,
    segmento VARCHAR(100) NOT NULL,
    fecha_publicacion TIMESTAMP,
    fecha_programada TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'PENDIENTE',
    id_admin INT REFERENCES usuario(id_usuario)
);

CREATE TABLE aviso_adjuntos (
    id_adjunto INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_aviso INT REFERENCES aviso(id_aviso) ON DELETE CASCADE,
    url_archivo VARCHAR(255) NOT NULL
);

CREATE TABLE notificacion (
    id_notificacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    titulo VARCHAR(150) NOT NULL,
    cuerpo TEXT NOT NULL,
    tipo VARCHAR(50),
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'ENVIADA',
    token_notificacion VARCHAR(255)
);

CREATE TABLE area_comun (
    id_area INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    aforo_maximo INT,
    reglas TEXT,
    estado VARCHAR(20) DEFAULT 'ACTIVO'
);

CREATE TABLE disponibilidad_area (
    id_disponibilidad INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_area INT REFERENCES area_comun(id_area) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    aforo INT,
    reservado BOOL DEFAULT FALSE
);

CREATE TABLE reserva (
    id_reserva INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    id_area INT REFERENCES area_comun(id_area) ON DELETE SET NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    detalles TEXT,
    estado VARCHAR(20) DEFAULT 'PENDIENTE',
    monto DECIMAL(10,2),
    comprobante_pago VARCHAR(255)
);

CREATE TABLE activo (
    id_activo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_adquisicion DATE,
    estado VARCHAR(50)
);

CREATE TABLE tarea_mantenimiento (
    id_tarea INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_activo INT REFERENCES activo(id_activo),
    descripcion TEXT NOT NULL,
    tipo VARCHAR(50),
    fecha_programada DATE,
    estado VARCHAR(20) DEFAULT 'PENDIENTE',
    id_admin INT REFERENCES usuario(id_usuario)
);

CREATE TABLE asignacion_tarea (
    id_asignacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_tarea INT REFERENCES tarea_mantenimiento(id_tarea) ON DELETE CASCADE,
    id_personal INT REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    fecha_asignacion DATE,
    fecha_aceptacion DATE,
    estado VARCHAR(20) DEFAULT 'ASIGNADA'
);

CREATE TABLE evidencia_mantenimiento (
    id_evidencia INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_tarea INT REFERENCES tarea_mantenimiento(id_tarea) ON DELETE CASCADE,
    descripcion TEXT,
    url_archivo VARCHAR(255)
);

CREATE TABLE costo_reparacion (
    id_costo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_tarea INT REFERENCES tarea_mantenimiento(id_tarea) ON DELETE SET NULL,
    monto DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE token_notificacion (
    id_token INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valido BOOLEAN DEFAULT TRUE
);

CREATE TABLE camara (
    id_camara INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ubicacion VARCHAR(150) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'ACTIVA'
);

CREATE TABLE camara_evento (
    id_evento INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_camara INT REFERENCES camara(id_camara) ON DELETE CASCADE,
    tipo_evento VARCHAR(50),
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT,
    url_video VARCHAR(255)
);
CREATE TABLE perfil_facial (
    id_facial INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    vector_facial BYTEA,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reconocimiento_facial (
    id_reconocimiento INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_facial INT REFERENCES perfil_facial(id_facial) ON DELETE SET NULL,
    id_camara INT REFERENCES camara(id_camara) ON DELETE SET NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resultado VARCHAR(50),
    confianza DECIMAL(5,2),
    url_imagen VARCHAR(255)
);

CREATE TABLE visitante (
    id_visitante INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100),
    motivo_visita VARCHAR(150),
    documento_identidad VARCHAR(50),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE deteccion_visitante (
    id_deteccion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_visitante INT REFERENCES visitante(id_visitante) ON DELETE SET NULL,
    id_camara INT REFERENCES camara(id_camara) ON DELETE SET NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    url_imagen VARCHAR(255)
);

CREATE TABLE vehiculo (
    id_vehiculo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    placa VARCHAR(20) UNIQUE NOT NULL,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    color VARCHAR(30),
    id_usuario INT REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

CREATE TABLE ocr_vehiculo (
    id_ocr INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_vehiculo INT REFERENCES vehiculo(id_vehiculo) ON DELETE SET NULL,
    id_camara INT REFERENCES camara(id_camara) ON DELETE SET NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    placa_detectada VARCHAR(20),
    confianza DECIMAL(5,2),
    url_imagen VARCHAR(255)
);

CREATE TABLE reporte_financiero (
    id_reporte INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    url_archivo VARCHAR(255)
);

CREATE TABLE estadistica_seguridad (
    id_estadistica INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo VARCHAR(100),
    valor INT,
    periodo VARCHAR(50),
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analitica_morosidad (
    id_analitica INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    probabilidad_morosidad DECIMAL(5,2),
    fecha_analisis TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    detalles TEXT
);

CREATE TABLE exportacion_reporte (
    id_exportacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo_reporte VARCHAR(100),
    formato VARCHAR(10),
    url_archivo VARCHAR(255) NOT NULL,
    fecha_exportacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- INSERTS DE EJEMPLO PARA UNIDAD
INSERT INTO unidad (id_unidad, numero, propietario, piso) VALUES
    (1, 'A101', 'Juan Pérez', 1),
    (2, 'A102', 'María López', 1),
    (3, 'B201', 'Carlos Ruiz', 2);

-- INSERTS DE EJEMPLO PARA CUOTA_SERVICIO
INSERT INTO cuota_servicio (id_cuota, nombre, descripcion, monto, tipo, fecha_creacion) VALUES
    (1, 'Expensa mensual', 'Expensa ordinaria', 1500.00, 'expensa', CURRENT_TIMESTAMP),
    (2, 'Luz común', 'Servicio de luz de áreas comunes', 300.00, 'servicio', CURRENT_TIMESTAMP),
    (3, 'Agua', 'Servicio de agua', 200.00, 'servicio', CURRENT_TIMESTAMP);

-- INSERTS DE EJEMPLO PARA CUOTA_GENERADA
INSERT INTO cuota_generada (id_cuota_generada, id_unidad, id_cuota, fecha_generacion, monto, estado) VALUES
    (1, 1, 1, '2025-09-01', 1500.00, 'pendiente'),
    (2, 2, 1, '2025-09-01', 1500.00, 'pendiente'),
    (3, 3, 1, '2025-09-01', 1500.00, 'pendiente'),
    (4, 1, 2, '2025-09-01', 300.00, 'pendiente'),
    (5, 2, 2, '2025-09-01', 300.00, 'pendiente'),
    (6, 3, 3, '2025-09-01', 200.00, 'pendiente');
