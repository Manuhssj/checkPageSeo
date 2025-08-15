# CheckPageSeo


## Como ejecutar desde la linea de comandos


Para ejecutar desde la línea de comandos, necesitarás tener instalado Node.js.

1. Descarga el código fuente de este repositorio.
2. Abre una terminal en la carpeta raíz del proyecto.
3. Ejecuta `npm install` para instalar las dependencias necesarias.
4. Ejecuta `node checkTags.js <archivo.txt> [selector]` para revisar el contenido de `<archivo.txt>` y si estan completo o incompleto con Alt y Title tags

   - `<archivo.txt>` es el archivo de texto que contiene las URLs a revisar.
   - `[selector]` es opcional y permite especificar un selector de CSS para seleccionar un elemento específico en la página.

Por ejemplo, para revisar las URLs de un archivo llamado `urls.txt` y mostrar solo las imágenes dentro de un elemento con la clase `gallery`, puedes ejecutar:



## Como ejecutar el .exe

1. Como se usan parametros como `<archivo.txt>` y `[selector]` abrir el `.exe` no es suficiente, ya que no recibira estos.
2. Para esto se ocupara modificar el archivo `.bat`, en este se pasaran los parametros y este se usara para ejecutar el `.exe` con parametros
3. Ejemplo de `.bat`:

```bat
@echo off
REM =============================================
REM CheckPageSeo - Ejecutar el .exe con parámetros
REM =============================================

REM Define los parámetros
SET URL_FILE=urls.txt
SET CSS_SELECTOR=".internal-page"

REM Ejecuta el .exe con los parámetros definidos
.\checkpageseo.exe %URL_FILE% %CSS_SELECTOR%

REM Pausa para que la ventana no se cierre automáticamente
echo.
echo Presiona cualquier tecla para salir...
pause >nul