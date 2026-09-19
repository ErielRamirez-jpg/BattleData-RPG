export class NodoPila<T> {
  dato: T;
  siguiente: NodoPila<T> | null;
  constructor(dato: T) {
    this.dato = dato;
    this.siguiente = null;
  }
}

export class Pila<T> {
  private tope: NodoPila<T> | null = null;
  private tamanio = 0;

  apilar(dato: T): void {
    const nuevo = new NodoPila(dato);
    nuevo.siguiente = this.tope;
    this.tope = nuevo;
    this.tamanio++;
  }

  desapilar(): T | null {
    if (!this.tope) return null;
    const dato = this.tope.dato;
    this.tope = this.tope.siguiente;
    this.tamanio--;
    return dato;
  }

  verTope(): T | null { return this.tope ? this.tope.dato : null; }
  estaVacia(): boolean { return this.tamanio === 0; }
  obtenerTamanio(): number { return this.tamanio; }
  limpiar(): void { this.tope = null; this.tamanio = 0; }

  recorrer(): T[] {
    const r: T[] = [];
    let actual = this.tope;
    while (actual) {
      r.push(actual.dato);
      actual = actual.siguiente;
    }
    return r;
  }
}
