# Pruebas del módulo de imágenes en Postman

Importar el archivo `ModuloImagenes.postman_collection.json` en Postman.

1. Ejecutar **0. Iniciar sesión** con un usuario registrado.
2. Copiar el token recibido.
3. Abrir la colección, entrar a **Authorization**, seleccionar **Bearer Token** y pegar el token.
4. En las peticiones de subida y reemplazo, seleccionar el archivo en el campo `imagen` de **Body > form-data**.
5. Cambiar el número `1` de las URLs por el `id` devuelto al subir la imagen.

## Casos que se deben probar

| Prueba | Resultado esperado |
| --- | --- |
| Subir JPG, JPEG o PNG de hasta 5 MB | Estado 201 y registro guardado en MySQL |
| Listar imágenes | Estado 200 y arreglo `imagenes` |
| Consultar un ID existente | Estado 200 y datos de la imagen |
| Reemplazar con una imagen válida | Estado 200, datos actualizados en MySQL y archivo anterior eliminado |
| Eliminar una imagen | Estado 200, registro y archivo eliminados |
| Subir PDF o TXT | Estado 400 |
| Subir una imagen mayor de 5 MB | Estado 400 |
| Usar un ID inexistente | Estado 404 |
| Enviar la petición sin token | Estado 401 |
