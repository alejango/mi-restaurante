-- ==========================================
-- CATEGORÍAS (orden único)
-- ==========================================
INSERT INTO categorias (nombre, orden) VALUES ('Entrantes', 1);
INSERT INTO categorias (nombre, orden) VALUES ('Ensaladas', 2);
INSERT INTO categorias (nombre, orden) VALUES ('Carnes', 3);
INSERT INTO categorias (nombre, orden) VALUES ('Pescados', 4);
INSERT INTO categorias (nombre, orden) VALUES ('Arroces', 5);
INSERT INTO categorias (nombre, orden) VALUES ('Pastas', 6);
INSERT INTO categorias (nombre, orden) VALUES ('Tapas', 7);
INSERT INTO categorias (nombre, orden) VALUES ('Postres', 8);
INSERT INTO categorias (nombre, orden) VALUES ('Bebidas', 9);

-- ==========================================
-- ENTRANTES (idcategoria = 1)
-- ==========================================
INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Pan de cristal con tomate y AOVE', 1, 3.00, NULL, 'pan_cristal.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Jamón ibérico de bellota (80g)', 1, 18.00, 10.00, 'jamon_iberico.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Queso manchego curado', 1, 10.50, 6.00, 'queso_manchego.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Croquetas de jamón ibérico (6 uds)', 1, 9.50, 5.00, 'croquetas_jamon.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Croquetas de boletus (6 uds)', 1, 10.50, 6.00, 'croquetas_boletus.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Gambas al ajillo', 1, 14.00, 8.00, 'gambas_ajillo.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Calamares a la andaluza', 1, 12.00, 7.00, 'calamares_andaluza.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Boquerones en vinagre', 1, 9.00, 5.00, 'boquerones_vinagre.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Tortilla de patatas con cebolla', 1, 6.50, 4.00, 'tortilla_patatas.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Patatas bravas con salsa casera', 1, 7.50, 4.50, 'patatas_bravas.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Patatas alioli', 1, 7.00, 4.00, 'patatas_alioli.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Mejillones al vapor', 1, 10.00, 6.00, 'mejillones_vapor.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Anchoas del Cantábrico (6 uds)', 1, 12.00, 7.00, 'anchoas_cantabrico.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Pulpo a la gallega', 1, 17.00, 10.00, 'pulpo_gallega.jpg');

-- ==========================================
-- ENSALADAS (idcategoria = 2)
-- ==========================================
INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Ensalada mixta mediterránea', 2, 8.50, NULL, 'ensalada_mixta.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Ensalada César con pollo crujiente', 2, 9.50, NULL, 'ensalada_cesar.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Tomate de temporada con ventresca de atún', 2, 11.00, NULL, 'tomate_ventresca.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Ensalada de queso de cabra, nueces y miel', 2, 10.50, NULL, 'ensalada_cabra.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Ensalada de burrata con pesto y cherry', 2, 12.00, NULL, 'burrata_pesto.jpg');

-- ==========================================
-- CARNES (idcategoria = 3)
-- ==========================================
INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Solomillo de ternera a la brasa', 3, 22.00, NULL, 'solomillo_ternera.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Chuletas de cordero a la parrilla', 3, 19.50, NULL, 'chuletas_cordero.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Rabo de toro estofado', 3, 18.50, NULL, 'rabo_toro.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Pollo de corral al horno', 3, 15.00, NULL, 'pollo_corral.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Secreto ibérico a la brasa', 3, 17.00, NULL, 'secreto_iberico.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Carrillada ibérica al vino tinto', 3, 16.00, NULL, 'carrillada.jpg');

-- ==========================================
-- PESCADOS (idcategoria = 4)
-- ==========================================
INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Lubina a la espalda con ajos tiernos', 4, 19.00, NULL, 'lubina_espalda.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Dorada a la brasa', 4, 18.50, NULL, 'dorada_brasa.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Bacalao al pil-pil', 4, 20.00, NULL, 'bacalao_pilpil.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Pulpo a la brasa con parmentier', 4, 22.00, NULL, 'pulpo_brasa.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Caldereta de pescado y marisco', 4, 21.50, NULL, 'caldereta_marisco.jpg');

-- ==========================================
-- ARROCES (idcategoria = 5)
-- ==========================================
INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Paella valenciana', 5, 17.50, 10.00, 'paella_valenciana.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Paella de marisco', 5, 19.50, 11.00, 'paella_marisco.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Arroz negro con alioli', 5, 18.00, 10.00, 'arroz_negro.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Fideuà marinera', 5, 18.50, 10.00, 'fideua.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Arroz caldoso de bogavante', 5, 24.00, 14.00, 'arroz_bogavante.jpg');

-- ==========================================
-- PASTAS (idcategoria = 6)
-- ==========================================
INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Espaguetis a la boloñesa', 6, 9.50, NULL, 'espaguetis_bolonesa.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Espaguetis carbonara', 6, 9.50, NULL, 'carbonara.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Lasaña casera', 6, 11.00, NULL, 'lasagna.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Macarrones gratinados', 6, 8.50, NULL, 'macarrones.jpg');

-- ==========================================
-- TAPAS (idcategoria = 7)
-- ==========================================
INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Tapa de ensaladilla rusa', 7, 3.50, 2.00, 'ensaladilla.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Tapa de albóndigas caseras', 7, 4.00, 2.50, 'albondigas.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Tapa de callos a la madrileña', 7, 4.50, 3.00, 'callos.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Tapa de magro con tomate', 7, 4.00, 2.50, 'magro_tomate.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Tapa de tortilla de patatas', 7, 3.00, 2.00, 'tortilla_tapa.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Tapa de boquerones fritos', 7, 4.50, 3.00, 'boquerones_fritos.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Tapa de chorizo al vino', 7, 4.00, 2.50, 'chorizo_vino.jpg');

-- ==========================================
-- POSTRES (idcategoria = 8)
-- ==========================================
INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Tarta de queso con frutos rojos', 8, 6.00, NULL, 'tarta_queso.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Brownie con helado', 8, 6.50, NULL, 'brownie_helado.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Flan casero', 8, 4.50, NULL, 'flan.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Tiramisú casero', 8, 6.00, NULL, 'tiramisu.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Sorbete de limón al cava', 8, 5.50, NULL, 'sorbete_limon.jpg');

-- ==========================================
-- BEBIDAS (idcategoria = 9)
-- ==========================================
INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Agua mineral', 9, 1.80, NULL, 'agua.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Refresco de cola', 9, 2.20, NULL, 'cola.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Cerveza especial de barril', 9, 2.80, NULL, 'cerveza.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Copa de vino tinto Rioja', 9, 3.50, NULL, 'vino_rioja.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Copa de vino blanco Rueda', 9, 3.50, NULL, 'vino_rueda.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Tinto de verano', 9, 3.00, NULL, 'tinto_verano.jpg');

INSERT INTO productos (descripcion, idcategoria, precio_total, precio_media, foto)
VALUES ('Sangría casera', 9, 3.80, NULL, 'sangria.jpg');
