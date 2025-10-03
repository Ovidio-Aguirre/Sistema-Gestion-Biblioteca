// src/repositories/JSONManager.ts

import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

/**
 * Clase genérica para gestionar operaciones CRUD en un archivo JSON.
 * T debe ser un objeto que al menos tenga una propiedad 'id' de tipo string.
 */
export class JSONManager<T extends { id: string }> {
protected filePath: string;
  protected data: T[] = [];

  /**
   * @param filePath La ruta al archivo JSON que se va a gestionar.
   */
  constructor(filePath: string) {
    this.filePath = filePath;
    // Cargamos los datos al instanciar para tenerlos en memoria.
    this.cargarDatos().catch(error => {
      console.error(`Error inicial al cargar el archivo JSON de ${this.filePath}:`, error);
      // Si el archivo no existe, lo crearemos al guardar. No es un error fatal.
    });
  }

  /**
   * Genera un ID único universal (UUID).
   * @returns Un string con el nuevo ID.
   */
  private generarId(): string {
    return uuidv4();
  }

  /**
   * Carga los datos desde el archivo JSON a la memoria (this.data).
   */
  async cargarDatos(): Promise<void> {
    try {
      const fileContent = await fs.readFile(this.filePath, 'utf-8');
      // Asumimos que el archivo JSON contiene directamente el array de datos.
      this.data = JSON.parse(fileContent);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // El archivo no existe, lo cual es normal la primera vez.
        // Se creará al llamar a guardarDatos().
        this.data = [];
      } else {
        // Otro tipo de error de lectura.
        throw new Error(`No se pudo leer el archivo: ${this.filePath}`);
      }
    }
  }

  /**
   * Guarda los datos de la memoria (this.data) en el archivo JSON.
   */
  protected async guardarDatos(): Promise<void> {
    const jsonData = JSON.stringify(this.data, null, 2); // Formateado para legibilidad
    await fs.writeFile(this.filePath, jsonData);
  }

  /**
   * Crea un nuevo elemento, le asigna un ID y lo guarda.
   * @param item El nuevo elemento a crear (sin el 'id').
   * @returns El elemento completo ya creado, incluyendo su nuevo 'id'.
   */
  async crear(item: Omit<T, 'id'>): Promise<T> {
    const nuevoItem = { ...item, id: this.generarId() } as T;
    this.data.push(nuevoItem);
    await this.guardarDatos();
    return nuevoItem;
  }

  /**
   * Crea múltiples elementos a la vez.
   * @param items Un array de elementos a crear (sin el 'id').
   * @returns Un array con los elementos completos ya creados.
   */
  async crearMultiple(items: Omit<T, 'id'>[]): Promise<T[]> {
    const nuevosItems = items.map(item => ({ ...item, id: this.generarId() } as T));
    this.data.push(...nuevosItems);
    await this.guardarDatos();
    return nuevosItems;
  }

  /**
   * Obtiene todos los elementos.
   * @returns Un array con todos los elementos.
   */
  async obtenerTodos(): Promise<T[]> {
    return this.data;
  }

  /**
   * Busca un elemento por su ID.
   * @param id El ID del elemento a buscar.
   * @returns El elemento encontrado o null si no existe.
   */
  async obtenerPorId(id: string): Promise<T | null> {
    const item = this.data.find(d => d.id === id);
    return item || null;
  }

  /**
   * Busca elementos que cumplan con una condición (filtro).
   * @param filtro Una función que devuelve true para los elementos que deben ser incluidos.
   * @returns Un array con los elementos que pasaron el filtro.
   */
  async buscarPorFiltro(filtro: (item: T) => boolean): Promise<T[]> {
    return this.data.filter(filtro);
  }

  /**
   * Actualiza un elemento existente por su ID.
   * @param id El ID del elemento a actualizar.
   * @param actualizaciones Un objeto con las propiedades a actualizar.
   * @returns El elemento completo ya actualizado, o null si no se encontró.
   */
  async actualizar(id: string, actualizaciones: Partial<Omit<T, 'id'>>): Promise<T | null> {
    const index = this.data.findIndex(d => d.id === id);
    if (index === -1) {
      return null;
    }

    const itemOriginal = this.data[index];
    const itemActualizado = { ...itemOriginal, ...actualizaciones };
    this.data[index] = itemActualizado;

    await this.guardarDatos();
    return itemActualizado;
  }

  /**
   * Elimina un elemento por su ID.
   * @param id El ID del elemento a eliminar.
   * @returns true si el elemento fue eliminado, false si no se encontró.
   */
  async eliminar(id: string): Promise<boolean> {
    const index = this.data.findIndex(d => d.id === id);
    if (index === -1) {
      return false;
    }

    this.data.splice(index, 1);
    await this.guardarDatos();
    return true;
  }
}