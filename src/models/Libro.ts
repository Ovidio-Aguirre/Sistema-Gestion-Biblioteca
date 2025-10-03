// src/models/Libro.ts

/**
 * Define los posibles estados en los que puede estar un libro.
 * Usamos un 'type' para restringir los valores y evitar errores.
 */
export type EstadoLibro = "disponible" | "prestado" | "mantenimiento";

/**
 * Interfaz que representa la estructura de un objeto Libro.
 * Basado en los requisitos del documento.
 */
export interface Libro {
  id: string;                 // Único, auto-generado
  titulo: string;               // Obligatorio
  autor: string;                // Obligatorio
  isbn: string;                 // Único
  genero?: string;              // Opcional
  anioPublicacion?: number;     // Opcional
  editorial?: string;           // Opcional
  estado: EstadoLibro;          // Siempre uno de los tres estados definidos
  fechaAdquisicion?: string;    // Opcional, formato ISO date
  ubicacion?: string;           // Opcional
}