// src/services/BibliotecaService.ts

import { LibroRepository } from '../repositories/LibroRepository';
import { Libro, EstadoLibro } from '../models/Libro';
import * as path from 'path';

export class BibliotecaService {
  private libroRepository: LibroRepository;

  constructor() {
    // Creamos la ruta al archivo JSON. __dirname apunta a 'src/services'.
    const dbPath = path.resolve(__dirname, '../../data/biblioteca.json');
    this.libroRepository = new LibroRepository(dbPath);
  }

  // --- Métodos que la consola usará ---

  async agregarLibro(libroData: Omit<Libro, 'id' | 'estado'>): Promise<Libro> {
    const nuevoLibro = {
      ...libroData,
      estado: 'disponible' as EstadoLibro,
    };
    return this.libroRepository.crear(nuevoLibro);
  }

  async obtenerLibros(): Promise<Libro[]> {
    return this.libroRepository.obtenerTodos();
  }

  async obtenerLibroPorId(id: string): Promise<Libro | null> {
    return this.libroRepository.obtenerPorId(id);
  }

  async buscarLibrosPorTitulo(titulo: string): Promise<Libro[]> {
    return this.libroRepository.buscarPorTitulo(titulo);
  }

  async buscarLibrosPorAutor(autor: string): Promise<Libro[]> {
    return this.libroRepository.buscarPorAutor(autor);
  }

  async actualizarLibro(id: string, actualizaciones: Partial<Omit<Libro, 'id'>>): Promise<Libro | null> {
    return this.libroRepository.actualizar(id, actualizaciones);
  }

  async prestarLibro(id: string): Promise<boolean> {
    return this.libroRepository.prestarLibro(id);
  }

  async devolverLibro(id: string): Promise<boolean> {
    return this.libroRepository.devolverLibro(id);
  }

  async ponerLibroEnMantenimiento(id: string): Promise<boolean> {
    return this.libroRepository.ponerEnMantenimiento(id);
  }

  async eliminarLibro(id: string): Promise<boolean> {
    return this.libroRepository.eliminar(id);
  }

  async obtenerEstadisticas() {
    return this.libroRepository.obtenerEstadisticas();
  }

  async cargarDatosDeEjemplo(libros: Omit<Libro, 'id'>[]): Promise<Libro[]> {
    return this.libroRepository.crearMultiple(libros);
  }
}