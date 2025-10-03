# 📚 Sistema de Gestión de Biblioteca con JSON

Este proyecto es una aplicación de consola desarrollada en **TypeScript** que implementa un sistema CRUD completo para gestionar la colección de libros de una biblioteca. La persistencia de datos se realiza a través de un único archivo JSON, y la aplicación sigue un patrón de diseño modular para una clara separación de responsabilidades.

---

## ✨ Características Principales

* **Gestión CRUD completa**: Permite Crear, Leer, Actualizar y Eliminar libros del catálogo.
* **Búsquedas Específicas**: Funcionalidad para buscar libros por título, autor, género o estado.
* **Sistema de Estados**: Cada libro tiene un estado (`disponible`, `prestado`, `mantenimiento`) que se puede gestionar a través de operaciones de negocio como "prestar" o "devolver".
* **Generación de Estadísticas**: Muestra un resumen del inventario, incluyendo el total de libros, cuántos están disponibles y un desglose por género.
* **Carga de Datos de Ejemplo**: Permite poblar la biblioteca rápidamente con un conjunto de libros predefinidos.
* **Interfaz de Consola Interactiva**: Un menú claro y fácil de usar para que el usuario final pueda interactuar con el sistema.
* **Validación de Datos**: Asegura la unicidad del ISBN al crear nuevos libros.

---

## 💻 Stack Tecnológico

* **Lenguaje**: TypeScript
* **Entorno de Ejecución**: Node.js
* **Ejecución de TypeScript**: `ts-node`
* **Interfaz de Consola**: `readline-sync`
* **Generación de IDs Únicos**: `uuid`

---

## 🏛️ Arquitectura del Proyecto

El código está organizado en capas para facilitar su mantenimiento y escalabilidad:

1.  **Modelo (`src/models/Libro.ts`)**: Define la "plantilla" o `interface` de cómo debe ser un objeto `Libro`.

2.  **Gestor Genérico (`src/repositories/JSONManager.ts`)**: Es el motor principal del sistema. Una clase genérica capaz de realizar operaciones CRUD sobre cualquier archivo JSON que contenga un array de objetos.

3.  **Repositorio Específico (`src/repositories/LibroRepository.ts`)**: Hereda del `JSONManager` y lo especializa para trabajar con `Libro`. Aquí se añade la lógica de negocio (prestar, devolver, estadísticas) y se adapta para manejar la estructura específica del archivo `biblioteca.json`.

4.  **Capa de Servicio (`src/services/BibliotecaService.ts`)**: Actúa como un intermediario entre la interfaz de usuario y la lógica de datos, proporcionando una API limpia y clara para que la aplicación la consuma.

5.  **Aplicación/UI (`src/app.ts`)**: Es la capa de presentación. Contiene el menú interactivo, gestiona las entradas del usuario y muestra la información en la consola.

---

## 🚀 Guía de Instalación y Uso

Sigue estos pasos para poner en funcionamiento el sistema.

### Prerrequisitos
* Tener instalado **Node.js** (versión LTS recomendada) y **NPM**.

### Pasos

1.  **Instalar Dependencias**
    * Abre una terminal en la raíz del proyecto y ejecuta el siguiente comando para instalar todas las librerías necesarias:
        ```bash
        npm install
        ```

2.  **Ejecutar la Aplicación**
    * Una vez instaladas las dependencias, ejecuta el siguiente comando para iniciar el sistema:
        ```bash
        npm start
        ```

### Cómo Funciona
Al ejecutar la aplicación, aparecerá un menú interactivo en la consola. Simplemente escribe el número de la opción que deseas y presiona `Enter`. El sistema te guiará para introducir los datos necesarios (como el título de un libro, un ID, etc.) y te mostrará los resultados de cada operación.
