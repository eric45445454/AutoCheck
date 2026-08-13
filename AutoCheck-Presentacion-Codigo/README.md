# Presentación web de AutoCheck

## Abrir la presentación

Abre esta carpeta en Visual Studio Code y utiliza la extensión **Live Server** sobre `index.html`.

También puedes abrir `index.html` directamente, aunque el compilador de OneCompiler funciona mejor desde Live Server.

## Recorrido de la exposición

La presentación está centrada en el código. Cada CodeSnap aparece solo, en grande y seguido por una explicación breve para el público:

1. Eric: 4 capturas sobre estructura, arreglos, menú y control principal.
2. Diego: 2 capturas sobre búsqueda, registro y consultas.
3. Walter: video grabado, 3 capturas y explicación visual del diagnóstico y el mantenimiento.
4. Demostración en vivo con el código completo.

También incluye diagramas del flujo general, los arreglos paralelos, el ciclo del menú, la búsqueda por placa, los valores booleanos y las estadísticas.

## Video de Walter

Coloca el archivo grabado con este nombre y ruta:

```text
assets/video/walter-autocheck.mp4
```

La web detectará el video automáticamente. Si todavía no existe, mostrará un espacio reservado.

## OneCompiler

`final.cpp` se carga automáticamente en OneCompiler.

Si guardas el programa en OneCompiler, copia el ID que aparece después de `/cpp/` en su URL y colócalo en `script.js`:

```js
const ONECOMPILER_PROJECT_ID = "AQUI_COLOCO_MI_ID";
```

Si la constante queda vacía, seguirá funcionando la precarga automática.

## Archivos principales

- `index.html`: contenido y orden de la exposición.
- `style.css`: diseño y adaptación a pantallas pequeñas.
- `script.js`: navegación, cálculo, video y OneCompiler.
- `final.cpp`: código final del programa.
- `final-code.js`: copia usada para precargar OneCompiler.
- `assets/codesnap/`: capturas de Eric, Diego y Walter.

## Uso sin Internet

La presentación, el video local y las capturas funcionan sin conexión. Únicamente OneCompiler necesita Internet. Si no está disponible, la web indicará que se ejecute `final.cpp` desde Visual Studio Code u otro IDE de C++.
