// src/repositories/LibroRepository.ts

import { JSONManager } from './JSONManager';
import { Libro, EstadoLibro } from '../models/Libro';
import { promises as fs } from 'fs';

// Definimos la estructura del archivo JSON de la biblioteca, tal como lo pide el documento
interface BibliotecaData {
  metadata: {
    version: string;
    totalLibros: number;
    ultimaActualizacion: string;
  };
  libros: Libro[];
}

export class LibroRepository extends JSONManager<Libro> {
  private metadata: BibliotecaData['metadata'] = {
    version: '1.0',
    totalLibros: 0,
    ultimaActualizacion: new Date().toISOString(),
  };

  constructor(filePath: string) {
    super(filePath);
  }

  /**
   * Sobrescribimos el método para cargar datos y adaptarlo a la estructura
   * del archivo biblioteca.json, que incluye metadatos.
   */
  override async cargarDatos(): Promise<void> {
    try {
      const fileContent = await fs.readFile(this.filePath, 'utf-8');
      const parsedData: BibliotecaData = JSON.parse(fileContent);
      this.data = parsedData.libros || [];
      this.metadata = parsedData.metadata || this.metadata;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        this.data = [];
      } else {
        throw new Error(`No se pudo leer el archivo: ${this.filePath}`);
      }
    }
  }

  /**
   * Sobrescribimos el método para guardar datos y adaptarlo a la estructura
   * del archivo biblioteca.json, actualizando los metadatos.
   */
  protected override async guardarDatos(): Promise<void> {
    this.metadata.totalLibros = this.data.length;
    this.metadata.ultimaActualizacion = new Date().toISOString();

    const dataToSave: BibliotecaData = {
      metadata: this.metadata,
      libros: this.data,
    };

    const jsonData = JSON.stringify(dataToSave, null, 2);
    await fs.writeFile(this.filePath, jsonData);
  }

  /**
   * Sobrescribimos el método crear para añadir validación de ISBN único.
   */
  override async crear(item: Omit<Libro, 'id'>): Promise<Libro> {
    // Validación de unicidad del ISBN
    const isbnExistente = this.data.some(libro => libro.isbn === item.isbn);
    if (isbnExistente) {
      throw new Error(`El ISBN '${item.isbn}' ya existe en la biblioteca.`);
    }
    return super.crear(item);
  }
  
  // --- Búsquedas Específicas ---

  async buscarPorTitulo(titulo: string): Promise<Libro[]> {
    return this.buscarPorFiltro(libro => 
      libro.titulo.toLowerCase().includes(titulo.toLowerCase())
    );
  }

  async buscarPorAutor(autor: string): Promise<Libro[]> {
    return this.buscarPorFiltro(libro => 
      libro.autor.toLowerCase().includes(autor.toLowerCase())
    );
  }

  async buscarPorGenero(genero: string): Promise<Libro[]> {
    return this.buscarPorFiltro(libro => 
      libro.genero?.toLowerCase() === genero.toLowerCase()
    );
  }
  
  async buscarPorEstado(estado: EstadoLibro): Promise<Libro[]> {
    return this.buscarPorFiltro(libro => libro.estado === estado);
  }

  // --- Operaciones de Negocio ---

  private async cambiarEstado(id: string, nuevoEstado: EstadoLibro, estadoEsperado?: EstadoLibro): Promise<boolean> {
    const libro = await this.obtenerPorId(id);
    if (!libro) {
      console.error(`Error: Libro con ID '${id}' no encontrado.`);
      return false;
    }

    if (estadoEsperado && libro.estado !== estadoEsperado) {
      console.error(`Error: El libro '${libro.titulo}' no está en el estado '${estadoEsperado}'. Su estado actual es '${libro.estado}'.`);
      return false;
    }
    
    await this.actualizar(id, { estado: nuevoEstado });
    return true;
  }
  
  async prestarLibro(id: string): Promise<boolean> {
    return this.cambiarEstado(id, 'prestado', 'disponible');
  }

  async devolverLibro(id: string): Promise<boolean> {
    return this.cambiarEstado(id, 'disponible', 'prestado');
  }

  async ponerEnMantenimiento(id: string): Promise<boolean> {
    return this.cambiarEstado(id, 'mantenimiento');
  }
  
  // --- Estadísticas ---

  async obtenerEstadisticas(): Promise<any> {
    const total = this.data.length;
    const disponibles = this.data.filter(l => l.estado === 'disponible').length;
    const prestados = this.data.filter(l => l.estado === 'prestado').length;
    const enMantenimiento = this.data.filter(l => l.estado === 'mantenimiento').length;

    const porGenero = this.data.reduce((acc, libro) => {
      const genero = libro.genero || 'Sin Género';
      acc[genero] = (acc[genero] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      disponibles,
      prestados,
      enMantenimiento,
      porGenero
    };
  }
}