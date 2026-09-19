import { TipoItem } from '../types';
import { ListaEnlazada } from '../structures/ListaEnlazada';

export class Item {
  id: string;
  nombre: string;
  tipo: TipoItem;
  descripcion: string;
  poder: number;
  cantidad: number;
  icono: any;

  constructor(id: string, nombre: string, tipo: TipoItem, descripcion: string, poder = 0, cantidad = 1, icono: any = null) {
    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
    this.descripcion = descripcion;
    this.poder = poder;
    this.cantidad = cantidad;
    this.icono = icono;
  }

  usar() {
    if (this.cantidad <= 0) return false;
    this.cantidad--;
    return true;
  }

  agregar(n = 1) {
    this.cantidad += n;
  }
}

export class Inventario {
  private items = new ListaEnlazada<Item>();

  agregarItem(item: Item) {
    const ex = this.items.buscarPor((i) => i.id === item.id);
    if (ex) {
      ex.agregar(item.cantidad);
    } else {
      this.items.insertar(item);
    }
  }

  usarItem(id: string): Item | null {
    const item = this.items.buscarPor((i) => i.id === id);
    if (item && item.usar()) {
      return item;
    }
    return null;
  }

  obtenerItems() {
    return this.items.recorrer();
  }

  estaVacio() {
    return this.items.estaVacia();
  }

  obtenerTamanio() {
    return this.items.obtenerTamanio();
  }
}