// src/app.ts

import * as readlineSync from 'readline-sync';
import { BibliotecaService } from './services/BibliotecaService';
import { Libro } from './models/Libro';

const bibliotecaService = new BibliotecaService();


const librosEjemplo = [
    { titulo: "Cien años de soledad", autor: "Gabriel García Márquez", isbn: "978-0307350438", genero: "Realismo mágico", estado: "disponible" as const },
    { titulo: "1984", autor: "George Orwell", isbn: "978-0451524935", genero: "Ciencia ficción", estado: "disponible" as const },
    { titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", isbn: "978-8424116361", genero: "Novela", estado: "disponible" as const },
];



// --- Funciones de Utilidad ---

function mostrarMenu() {
  console.clear();
  console.log(`
=========================================
=== SISTEMA DE GESTIÓN DE BIBLIOTECA ====
=========================================
1.  Agregar nuevo libro
2.  Listar todos los libros
3.  Buscar libro por ID
4.  Buscar libro por título
5.  Buscar libro por autor
6.  Actualizar información de un libro
7.  Prestar libro
8.  Devolver libro
9.  Poner libro en mantenimiento
10. Eliminar libro
11. Mostrar estadísticas
12. Cargar datos de ejemplo
0.  Salir
=========================================
  `);
}

function pausar() {
  readlineSync.question('\nPresiona Enter para continuar...');
}

function imprimirLibro(libro: Libro) {
  console.log(`
  ------------------------------------
  ID:          ${libro.id}
  Título:      ${libro.titulo}
  Autor:       ${libro.autor}
  ISBN:        ${libro.isbn}
  Estado:      ${libro.estado}
  Género:      ${libro.genero || 'N/A'}
  Año:         ${libro.anioPublicacion || 'N/A'}
  ------------------------------------
  `);
}

// --- Funciones del Menú ---

async function agregarLibro() {
  console.log('\n--- Agregar Nuevo Libro ---');
  const titulo = readlineSync.question('Título: ');
  const autor = readlineSync.question('Autor: ');
  const isbn = readlineSync.question('ISBN: ');
  const genero = readlineSync.question('Género (opcional): ');
  const anioPublicacion = readlineSync.questionInt('Año de Publicación (opcional): ');

  if (!titulo || !autor || !isbn) {
    console.log('\nError: Título, Autor e ISBN son campos obligatorios.');
    return;
  }
  
  try {
    const nuevoLibro = await bibliotecaService.agregarLibro({ titulo, autor, isbn, genero, anioPublicacion });
    console.log('\n¡Libro agregado exitosamente!');
    imprimirLibro(nuevoLibro);
  } catch (error: any) {
    console.error('\nError al agregar el libro:', error.message);
  }
}

async function listarLibros() {
    console.log('\n--- Listado de Todos los Libros ---');
    const libros = await bibliotecaService.obtenerLibros();
    if (libros.length === 0) {
        console.log('No hay libros en la biblioteca.');
        return;
    }
    libros.forEach(imprimirLibro);
    console.log(`\nTotal de libros: ${libros.length}`);
}

async function buscarLibroPorId() {
    console.log('\n--- Buscar Libro por ID ---');
    const id = readlineSync.question('Ingresa el ID del libro: ');
    const libro = await bibliotecaService.obtenerLibroPorId(id);
    if (libro) {
        imprimirLibro(libro);
    } else {
        console.log('\nLibro no encontrado.');
    }
}

async function buscarLibroPorTitulo() {
    console.log('\n--- Buscar Libro por Título ---');
    const titulo = readlineSync.question('Ingresa el título a buscar: ');
    const libros = await bibliotecaService.buscarLibrosPorTitulo(titulo);
    if (libros.length > 0) {
        libros.forEach(imprimirLibro);
    } else {
        console.log('\nNo se encontraron libros con ese título.');
    }
}

async function buscarLibroPorAutor() {
    console.log('\n--- Buscar Libro por Autor ---');
    const autor = readlineSync.question('Ingresa el autor a buscar: ');
    const libros = await bibliotecaService.buscarLibrosPorAutor(autor);
    if (libros.length > 0) {
        libros.forEach(imprimirLibro);
    } else {
        console.log('\nNo se encontraron libros con ese autor.');
    }
}

async function actualizarLibro() {
    console.log('\n--- Actualizar Información de un Libro ---');
    const id = readlineSync.question('Ingresa el ID del libro a actualizar: ');
    const libro = await bibliotecaService.obtenerLibroPorId(id);

    if (!libro) {
        console.log('\nLibro no encontrado.');
        return;
    }

    console.log('Ingresa los nuevos datos (deja en blanco para no cambiar):');
    const titulo = readlineSync.question(`Título [${libro.titulo}]: `);
    const autor = readlineSync.question(`Autor [${libro.autor}]: `);
    
    const actualizaciones: Partial<Omit<Libro, 'id'>> = {};
    if (titulo) actualizaciones.titulo = titulo;
    if (autor) actualizaciones.autor = autor;
    
    try {
        const libroActualizado = await bibliotecaService.actualizarLibro(id, actualizaciones);
        console.log('\n¡Libro actualizado exitosamente!');
        imprimirLibro(libroActualizado!);
    } catch(error: any) {
        console.error('\nError al actualizar el libro:', error.message);
    }
}

async function prestarLibro() {
    console.log('\n--- Prestar Libro ---');
    const id = readlineSync.question('Ingresa el ID del libro a prestar: ');
    const success = await bibliotecaService.prestarLibro(id);
    if (success) {
        console.log('\nEl libro ha sido marcado como "prestado".');
    }
}

async function devolverLibro() {
    console.log('\n--- Devolver Libro ---');
    const id = readlineSync.question('Ingresa el ID del libro a devolver: ');
    const success = await bibliotecaService.devolverLibro(id);
    if (success) {
        console.log('\nEl libro ha sido marcado como "disponible".');
    }
}

async function ponerEnMantenimiento() {
    console.log('\n--- Poner Libro en Mantenimiento ---');
    const id = readlineSync.question('Ingresa el ID del libro: ');
    const success = await bibliotecaService.ponerLibroEnMantenimiento(id);
    if (success) {
        console.log('\nEl libro ha sido marcado como "mantenimiento".');
    }
}

async function eliminarLibro() {
    console.log('\n--- Eliminar Libro ---');
    const id = readlineSync.question('Ingresa el ID del libro a eliminar: ');
    if (readlineSync.keyInYN(`¿Estás seguro de que quieres eliminar el libro con ID ${id}?`)) {
        const success = await bibliotecaService.eliminarLibro(id);
        if (success) {
            console.log('\nLibro eliminado exitosamente.');
        } else {
            console.log('\nNo se pudo eliminar el libro (ID no encontrado).');
        }
    } else {
        console.log('\nOperación cancelada.');
    }
}

async function mostrarEstadisticas() {
    console.log('\n--- Estadísticas de la Biblioteca ---');
    const stats = await bibliotecaService.obtenerEstadisticas();
    console.log(`
    Total de Libros:      ${stats.total}
    Disponibles:          ${stats.disponibles}
    Prestados:            ${stats.prestados}
    En Mantenimiento:     ${stats.enMantenimiento}
    
    Libros por Género:
    `);
    for (const genero in stats.porGenero) {
        console.log(`    - ${genero}: ${stats.porGenero[genero]}`);
    }
}

async function cargarDatosDeEjemplo() {
    console.log('\n--- Cargar Datos de Ejemplo ---');
    if (readlineSync.keyInYN('Esto agregará libros de ejemplo a tu biblioteca. ¿Continuar?')) {
        try {
            await bibliotecaService.cargarDatosDeEjemplo(librosEjemplo);
            console.log('\nDatos de ejemplo cargados exitosamente.');
        } catch(error: any) {
            console.error('\nError al cargar datos:', error.message);
        }
    } else {
        console.log('\nOperación cancelada.');
    }
}

// --- Bucle Principal de la Aplicación ---

async function main() {
  while (true) {
    mostrarMenu();
    const opcion = readlineSync.question('Selecciona una opción: ');

    switch (opcion) {
      case '1': await agregarLibro(); break;
      case '2': await listarLibros(); break;
      case '3': await buscarLibroPorId(); break;
      case '4': await buscarLibroPorTitulo(); break;
      case '5': await buscarLibroPorAutor(); break;
      case '6': await actualizarLibro(); break;
      case '7': await prestarLibro(); break;
      case '8': await devolverLibro(); break;
      case '9': await ponerEnMantenimiento(); break;
      case '10': await eliminarLibro(); break;
      case '11': await mostrarEstadisticas(); break;
      case '12': await cargarDatosDeEjemplo(); break;
      case '0':
        console.log('\nSaliendo del sistema...');
        return;
      default:
        console.log('\nOpción no válida. Inténtalo de nuevo.');
    }
    pausar();
  }
}

main();