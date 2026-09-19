export class NodoLista<T> {
  dato: T;
  siguiente: NodoLista<T> | null;
  constructor(dato: T) {
    this.dato = dato;
    this.siguiente = null;
  }
}

export class ListaEnlazada<T> {
  private cabeza: NodoLista<T> | null = null;
  private tamanio = 0;

  insertar(dato: T): void {
    const nuevo = new NodoLista(dato);
    if (!this.cabeza) this.cabeza = nuevo;
    else {
      let actual = this.cabeza;
      while (actual.siguiente) actual = actual.siguiente;
      actual.siguiente = nuevo;
    }
    this.tamanio++;
  }

  insertarAlInicio(dato: T): void {
    const nuevo = new NodoLista(dato);
    nuevo.siguiente = this.cabeza;
    this.cabeza = nuevo;
    this.tamanio++;
  }

  eliminar(dato: T): boolean {
    if (!this.cabeza) return false;
    if (this.cabeza.dato === dato) {
      this.cabeza = this.cabeza.siguiente;
      this.tamanio--;
      return true;
    }
    let actual = this.cabeza;
    while (actual.siguiente) {
      if (actual.siguiente.dato === dato) {
        actual.siguiente = actual.siguiente.siguiente;
        this.tamanio--;
        return true;
      }
      actual = actual.siguiente;
    }
    return false;
  }

  buscarPor(fn: (dato: T) => boolean): T | null {
    let actual = this.cabeza;
    while (actual) {
      if (fn(actual.dato)) return actual.dato;
      actual = actual.siguiente;
    }
    return null;
  }

  obtener(indice: number): T | null {
    if (indice < 0 || indice >= this.tamanio) return null;
    let actual = this.cabeza;
    for (let i = 0; i < indice; i++) actual = actual!.siguiente;
    return actual!.dato;
  }

  recorrer(): T[] {
    const r: T[] = [];
    let actual = this.cabeza;
    while (actual) {
      r.push(actual.dato);
      actual = actual.siguiente;
    }
    return r;
  }

  obtenerTamanio(): number { return this.tamanio; }
  estaVacia(): boolean { return this.tamanio === 0; }
  limpiar(): void { this.cabeza = null; this.tamanio = 0; }
}
