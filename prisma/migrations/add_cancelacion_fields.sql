-- Agregar campos de cancelación a la tabla compras
ALTER TABLE compras 
ADD COLUMN motivo_cancelacion TEXT,
ADD COLUMN fecha_cancelacion TIMESTAMP,
ADD COLUMN cancelado_por VARCHAR(20);

-- Crear índice para mejorar consultas por estado de cancelación
CREATE INDEX idx_compras_estado_cancelacion ON compras(estado, fecha_cancelacion);

-- Agregar comentarios a los nuevos campos
COMMENT ON COLUMN compras.motivo_cancelacion IS 'Motivo de la cancelación del pedido';
COMMENT ON COLUMN compras.fecha_cancelacion IS 'Fecha y hora cuando se canceló el pedido';
COMMENT ON COLUMN compras.cancelado_por IS 'Quién canceló el pedido: admin, sistema, cliente'; 