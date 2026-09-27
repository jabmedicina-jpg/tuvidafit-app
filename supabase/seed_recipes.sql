-- Correr DESPUÉS de schema.sql. Agrega meal_types a recipes y carga
-- un primer set de 16 recetas (8 argentinas, 8 brasileñas).

alter table public.recipes
  add column if not exists meal_types text[] default '{}'; -- ej: {desayuno, almuerzo}

insert into public.recipes
  (name, origin, calories, protein_g, carbs_g, fat_g, prep_minutes, servings,
   tags, gluten_free, vegetarian, vegan, lactose_free, ingredients, steps, meal_types)
values

('Tortilla de claras con espinaca', 'argentina', 210, 24, 6, 9, 10, 1,
 '{alto_en_proteinas,bajo_en_calorias,rapida,sin_gluten}', true, true, false, true,
 '[{"item":"claras de huevo","cantidad":"6 u"},{"item":"espinaca","cantidad":"1 taza"},{"item":"aceite de oliva","cantidad":"1 cdta"},{"item":"sal y pimienta","cantidad":"a gusto"}]',
 '{"Batir las claras con sal y pimienta.","Saltear la espinaca en el aceite hasta que se ablande.","Agregar las claras y cocinar a fuego medio hasta cuajar."}',
 '{desayuno}'),

('Avena con banana y chía', 'argentina', 320, 12, 52, 8, 5, 1,
 '{vegetariana,rapida,economica}', false, true, true, true,
 '[{"item":"avena arrollada","cantidad":"50 g"},{"item":"banana","cantidad":"1 u"},{"item":"leche vegetal","cantidad":"200 ml"},{"item":"semillas de chía","cantidad":"1 cda"},{"item":"canela","cantidad":"a gusto"}]',
 '{"Calentar la leche vegetal.","Agregar la avena y cocinar 3 minutos revolviendo.","Servir con banana en rodajas y semillas de chía."}',
 '{desayuno,merienda}'),

('Pollo al horno con puré de calabaza', 'argentina', 420, 38, 30, 14, 40, 2,
 '{alto_en_proteinas,sin_gluten}', true, false, false, true,
 '[{"item":"pechuga de pollo","cantidad":"400 g"},{"item":"calabaza","cantidad":"500 g"},{"item":"aceite de oliva","cantidad":"1 cda"},{"item":"ajo","cantidad":"2 dientes"},{"item":"orégano","cantidad":"a gusto"}]',
 '{"Hornear la pechuga condimentada a 200°C por 25 minutos.","Hervir la calabaza hasta que esté tierna y hacer puré con aceite de oliva.","Servir el pollo fileteado sobre el puré."}',
 '{almuerzo,cena}'),

('Ensalada de quinoa, pollo y palta', 'argentina', 480, 34, 42, 18, 25, 1,
 '{alto_en_proteinas,sin_gluten}', true, false, false, true,
 '[{"item":"quinoa cocida","cantidad":"150 g"},{"item":"pechuga de pollo grillada","cantidad":"150 g"},{"item":"palta","cantidad":"1/2 u"},{"item":"tomates cherry","cantidad":"100 g"},{"item":"jugo de lima","cantidad":"1 cda"}]',
 '{"Cocinar la quinoa según las instrucciones del paquete.","Grillar la pechuga de pollo y cortarla en tiras.","Mezclar todo con la palta en cubos, los tomates y el aderezo de lima y aceite."}',
 '{almuerzo,cena}'),

('Guiso de lentejas', 'argentina', 380, 20, 55, 8, 45, 4,
 '{alto_en_proteinas,economica,vegetariana}', true, true, true, true,
 '[{"item":"lentejas","cantidad":"300 g"},{"item":"cebolla","cantidad":"1 u"},{"item":"zanahoria","cantidad":"2 u"},{"item":"morrón","cantidad":"1 u"},{"item":"caldo de verduras","cantidad":"1 l"},{"item":"pimentón dulce","cantidad":"a gusto"}]',
 '{"Rehogar la cebolla, zanahoria y morrón picados.","Agregar las lentejas y el caldo.","Cocinar a fuego medio 35 minutos hasta que las lentejas estén tiernas."}',
 '{almuerzo,cena}'),

('Tarta de acelga sin harina', 'argentina', 260, 18, 8, 17, 35, 2,
 '{sin_gluten,bajo_en_calorias}', true, true, false, false,
 '[{"item":"acelga","cantidad":"1 atado"},{"item":"huevos","cantidad":"4 u"},{"item":"queso rallado","cantidad":"50 g"},{"item":"cebolla","cantidad":"1 u"},{"item":"nuez moscada","cantidad":"a gusto"}]',
 '{"Hervir la acelga, escurrir bien y picar.","Mezclar con los huevos batidos, la cebolla rehogada y el queso.","Volcar en un molde y hornear 25 minutos a 190°C."}',
 '{almuerzo,cena}'),

('Empanadas de carne al horno (masa integral)', 'argentina', 210, 12, 20, 9, 50, 6,
 '{economica}', false, false, false, true,
 '[{"item":"carne picada magra","cantidad":"300 g"},{"item":"cebolla","cantidad":"2 u"},{"item":"huevo duro","cantidad":"2 u"},{"item":"tapas de empanada integrales","cantidad":"12 u"},{"item":"pimentón y comino","cantidad":"a gusto"}]',
 '{"Rehogar la cebolla y agregar la carne picada, condimentar.","Agregar el huevo duro picado y dejar enfriar.","Rellenar las tapas, cerrar y hornear 20 minutos a 200°C."}',
 '{almuerzo,snack}'),

('Yogur con granola casera y frutos rojos', 'argentina', 280, 15, 34, 9, 5, 1,
 '{rapida,vegetariana}', false, true, false, false,
 '[{"item":"yogur natural descremado","cantidad":"200 g"},{"item":"granola casera","cantidad":"40 g"},{"item":"frutos rojos","cantidad":"80 g"},{"item":"miel","cantidad":"1 cdta"}]',
 '{"Colocar el yogur en un bowl.","Agregar la granola y los frutos rojos.","Endulzar con miel a gusto."}',
 '{merienda,snack,desayuno}'),

('Feijoada light', 'brasil', 410, 32, 45, 10, 60, 4,
 '{alto_en_proteinas,sin_gluten}', true, false, false, true,
 '[{"item":"porotos negros","cantidad":"300 g"},{"item":"carne magra","cantidad":"250 g"},{"item":"cebolla","cantidad":"1 u"},{"item":"ajo","cantidad":"3 dientes"},{"item":"laurel","cantidad":"2 hojas"}]',
 '{"Remojar los porotos la noche anterior.","Cocinar los porotos con la carne, cebolla, ajo y laurel hasta que estén tiernos.","Condimentar y servir con arroz integral aparte."}',
 '{almuerzo,cena}'),

('Moqueca de pescado', 'brasil', 360, 30, 14, 20, 35, 2,
 '{sin_gluten}', true, false, false, true,
 '[{"item":"filet de pescado blanco","cantidad":"400 g"},{"item":"leche de coco","cantidad":"200 ml"},{"item":"tomate","cantidad":"2 u"},{"item":"morrón","cantidad":"1 u"},{"item":"jugo de limón","cantidad":"1 cda"}]',
 '{"Marinar el pescado con limón y sal.","Rehogar el tomate y el morrón.","Agregar el pescado y la leche de coco, cocinar 12 minutos a fuego bajo."}',
 '{almuerzo,cena}'),

('Bowl de açaí con banana y granola', 'brasil', 340, 8, 58, 10, 10, 1,
 '{vegetariana,rapida}', false, true, true, true,
 '[{"item":"pulpa de açaí congelada","cantidad":"100 g"},{"item":"banana","cantidad":"1 u"},{"item":"granola","cantidad":"30 g"},{"item":"miel","cantidad":"1 cdta"}]',
 '{"Procesar la pulpa de açaí con media banana hasta lograr consistencia cremosa.","Servir en un bowl.","Decorar con banana en rodajas, granola y miel."}',
 '{desayuno,merienda}'),

('Frango grelhado com arroz integral e brócolis', 'brasil', 440, 40, 45, 10, 30, 1,
 '{alto_en_proteinas,sin_gluten}', true, false, false, true,
 '[{"item":"pechuga de pollo","cantidad":"200 g"},{"item":"arroz integral cocido","cantidad":"150 g"},{"item":"brócoli","cantidad":"150 g"},{"item":"ajo y aceite de oliva","cantidad":"a gusto"}]',
 '{"Grillar la pechuga condimentada.","Cocinar el brócoli al vapor.","Servir junto al arroz integral."}',
 '{almuerzo,cena}'),

('Salada de palmito y camarão', 'brasil', 290, 26, 12, 15, 20, 1,
 '{sin_gluten,bajo_en_calorias}', true, false, false, true,
 '[{"item":"palmitos","cantidad":"150 g"},{"item":"camarones","cantidad":"150 g"},{"item":"tomate cherry","cantidad":"100 g"},{"item":"rúcula","cantidad":"1 taza"},{"item":"jugo de limón","cantidad":"1 cda"}]',
 '{"Saltear los camarones con ajo hasta que estén cocidos.","Cortar los palmitos y mezclar con la rúcula y el tomate.","Agregar los camarones y aderezar con limón y aceite."}',
 '{almuerzo,cena}'),

('Pão de queijo fit (harina de almendras)', 'brasil', 150, 6, 8, 11, 25, 8,
 '{sin_gluten,vegetariana}', true, true, false, false,
 '[{"item":"harina de almendras","cantidad":"150 g"},{"item":"queso rallado","cantidad":"100 g"},{"item":"huevo","cantidad":"1 u"},{"item":"aceite de oliva","cantidad":"2 cdas"}]',
 '{"Mezclar todos los ingredientes hasta formar una masa.","Formar bolitas pequeñas.","Hornear 15 minutos a 180°C hasta dorar."}',
 '{snack,merienda}'),

('Tapioca rellena de pollo y queso', 'brasil', 260, 18, 30, 8, 15, 1,
 '{sin_gluten,rapida}', true, false, false, false,
 '[{"item":"goma de tapioca hidratada","cantidad":"60 g"},{"item":"pollo desmenuzado","cantidad":"80 g"},{"item":"queso","cantidad":"30 g"}]',
 '{"Espolvorear la tapioca en una sartén caliente hasta que se compacte.","Rellenar con el pollo y el queso.","Doblar por la mitad y cocinar hasta que el queso se derrita."}',
 '{desayuno,merienda}'),

('Farofa de banana con huevo', 'brasil', 300, 14, 38, 10, 15, 1,
 '{rapida,economica}', false, true, false, true,
 '[{"item":"harina de mandioca","cantidad":"40 g"},{"item":"banana","cantidad":"1 u"},{"item":"huevo","cantidad":"2 u"},{"item":"manteca","cantidad":"1 cdta"},{"item":"canela","cantidad":"a gusto"}]',
 '{"Saltear la banana en cubos con la manteca hasta dorar.","Agregar la harina de mandioca y tostar unos minutos.","Servir con huevo revuelto aparte."}',
 '{desayuno}');
