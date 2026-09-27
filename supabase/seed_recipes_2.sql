-- Correr DESPUÉS de seed_recipes.sql. Amplía los orígenes permitidos
-- y carga 12 recetas originales (mexicana, mediterránea, italiana).

alter table public.recipes drop constraint if exists recipes_origin_check;
alter table public.recipes
  add constraint recipes_origin_check
  check (origin in ('argentina', 'brasil', 'mexico', 'mediterranea', 'italia'));

insert into public.recipes
  (name, origin, calories, protein_g, carbs_g, fat_g, prep_minutes, servings,
   tags, gluten_free, vegetarian, vegan, lactose_free, ingredients, steps, meal_types)
values

('Tacos de pollo con pico de gallo', 'mexico', 380, 32, 38, 12, 25, 2,
 '{alto_en_proteinas,sin_gluten}', true, false, false, true,
 '[{"item":"pechuga de pollo","cantidad":"300 g"},{"item":"tortillas de maíz","cantidad":"6 u"},{"item":"tomate","cantidad":"2 u"},{"item":"cebolla morada","cantidad":"1/2 u"},{"item":"cilantro y jugo de lima","cantidad":"a gusto"}]',
 '{"Grillar el pollo condimentado y desmenuzarlo.","Preparar el pico de gallo picando tomate, cebolla y cilantro, aliñado con lima.","Armar los tacos con el pollo y el pico de gallo."}',
 '{almuerzo,cena}'),

('Guacamole con bastones de vegetales', 'mexico', 190, 4, 14, 15, 10, 2,
 '{vegana,sin_gluten,rapida}', true, true, true, true,
 '[{"item":"palta","cantidad":"2 u"},{"item":"tomate","cantidad":"1 u"},{"item":"cebolla","cantidad":"a gusto"},{"item":"jugo de limón","cantidad":"1 cda"},{"item":"zanahoria y apio","cantidad":"para dippear"}]',
 '{"Pisar la palta hasta lograr una pasta con grumos.","Mezclar con el tomate y la cebolla bien picados y el jugo de limón.","Servir con bastones de zanahoria y apio."}',
 '{snack}'),

('Ensalada de nopales con queso fresco', 'mexico', 220, 12, 16, 13, 20, 1,
 '{sin_gluten,bajo_en_calorias,vegetariana}', true, true, false, false,
 '[{"item":"nopales","cantidad":"200 g"},{"item":"queso fresco","cantidad":"50 g"},{"item":"tomate","cantidad":"1 u"},{"item":"cebolla y cilantro","cantidad":"a gusto"}]',
 '{"Hervir o grillar los nopales limpios y cortarlos en tiras.","Mezclar con el tomate, la cebolla y el cilantro.","Sumar el queso fresco en cubos y aliñar con limón."}',
 '{almuerzo}'),

('Pozole verde de pollo (versión liviana)', 'mexico', 340, 30, 28, 12, 45, 4,
 '{alto_en_proteinas,sin_gluten}', true, false, false, true,
 '[{"item":"pechuga de pollo","cantidad":"400 g"},{"item":"maíz pozolero","cantidad":"300 g"},{"item":"tomatillos","cantidad":"300 g"},{"item":"chile verde y orégano","cantidad":"a gusto"}]',
 '{"Cocinar el pollo en agua con sal y desmenuzarlo.","Licuar los tomatillos con el chile verde para la salsa.","Combinar todo con el maíz pozolero y cocinar 15 minutos."}',
 '{cena}'),

('Ensalada griega con garbanzos', 'mediterranea', 340, 14, 30, 18, 15, 1,
 '{vegetariana,sin_gluten,rapida}', true, true, false, false,
 '[{"item":"garbanzos cocidos","cantidad":"150 g"},{"item":"pepino","cantidad":"1 u"},{"item":"tomate","cantidad":"1 u"},{"item":"aceitunas negras","cantidad":"10 u"},{"item":"queso feta","cantidad":"40 g"}]',
 '{"Cortar el pepino y el tomate en cubos.","Mezclar con los garbanzos, las aceitunas y el feta.","Aliñar con aceite de oliva y orégano."}',
 '{almuerzo,cena}'),

('Salmón al horno con hierbas y limón', 'mediterranea', 380, 34, 4, 25, 25, 1,
 '{alto_en_proteinas,sin_gluten,bajo_en_calorias}', true, false, false, true,
 '[{"item":"filet de salmón","cantidad":"200 g"},{"item":"limón","cantidad":"1 u"},{"item":"romero y ajo","cantidad":"a gusto"},{"item":"aceite de oliva","cantidad":"1 cda"}]',
 '{"Condimentar el salmón con ajo, romero y aceite de oliva.","Colocar rodajas de limón sobre el filet.","Hornear 18 minutos a 200°C."}',
 '{cena}'),

('Hummus casero con crudités', 'mediterranea', 180, 8, 18, 9, 10, 2,
 '{vegana,sin_gluten,rapida,economica}', true, true, true, true,
 '[{"item":"garbanzos cocidos","cantidad":"200 g"},{"item":"tahini","cantidad":"2 cdas"},{"item":"jugo de limón","cantidad":"1 cda"},{"item":"ajo","cantidad":"1 diente"}]',
 '{"Procesar los garbanzos con el tahini, el limón y el ajo.","Agregar agua fría de a poco hasta lograr una pasta cremosa.","Servir con vegetales crudos cortados en bastones."}',
 '{snack}'),

('Tabulé de quinoa', 'mediterranea', 260, 8, 38, 9, 20, 2,
 '{vegana,sin_gluten}', true, true, true, true,
 '[{"item":"quinoa cocida","cantidad":"200 g"},{"item":"perejil","cantidad":"1 taza"},{"item":"tomate","cantidad":"2 u"},{"item":"menta y jugo de limón","cantidad":"a gusto"}]',
 '{"Mezclar la quinoa fría con el perejil y la menta bien picados.","Sumar el tomate en cubos pequeños.","Aliñar con jugo de limón y aceite de oliva."}',
 '{almuerzo}'),

('Ensalada caprese con pollo grillado', 'italia', 400, 36, 10, 24, 15, 1,
 '{alto_en_proteinas,sin_gluten}', true, false, false, false,
 '[{"item":"pechuga de pollo","cantidad":"180 g"},{"item":"tomate","cantidad":"2 u"},{"item":"mozzarella fresca","cantidad":"80 g"},{"item":"albahaca","cantidad":"a gusto"}]',
 '{"Grillar la pechuga de pollo condimentada.","Intercalar rodajas de tomate y mozzarella con el pollo en fetas.","Decorar con albahaca fresca y un hilo de aceite de oliva."}',
 '{almuerzo,cena}'),

('Pasta integral con vegetales grillados', 'italia', 420, 16, 62, 12, 30, 2,
 '{vegetariana}', false, true, false, false,
 '[{"item":"pasta integral","cantidad":"200 g"},{"item":"zucchini","cantidad":"1 u"},{"item":"berenjena","cantidad":"1 u"},{"item":"morrón","cantidad":"1 u"},{"item":"parmesano","cantidad":"30 g"}]',
 '{"Grillar los vegetales cortados en cubos.","Cocinar la pasta integral al dente.","Mezclar todo con aceite de oliva y parmesano rallado."}',
 '{cena}'),

('Minestrone de vegetales', 'italia', 220, 10, 32, 6, 40, 4,
 '{vegetariana,bajo_en_calorias,economica}', false, true, false, true,
 '[{"item":"zanahoria, apio y papa","cantidad":"a gusto"},{"item":"porotos blancos cocidos","cantidad":"200 g"},{"item":"tomate","cantidad":"2 u"},{"item":"pasta chica integral","cantidad":"80 g"}]',
 '{"Rehogar los vegetales picados en cubos pequeños.","Agregar caldo de verduras y los porotos, cocinar 25 minutos.","Sumar la pasta los últimos 8 minutos de cocción."}',
 '{almuerzo,cena}'),

('Frittata de vegetales al horno', 'italia', 260, 18, 8, 17, 25, 2,
 '{vegetariana,sin_gluten,bajo_en_calorias}', true, true, false, false,
 '[{"item":"huevos","cantidad":"5 u"},{"item":"espinaca y zucchini","cantidad":"a gusto"},{"item":"cebolla","cantidad":"1/2 u"},{"item":"queso parmesano","cantidad":"30 g"}]',
 '{"Batir los huevos con el queso parmesano.","Mezclar con los vegetales salteados previamente.","Hornear 20 minutos a 180°C hasta que cuaje."}',
 '{desayuno,almuerzo}');
