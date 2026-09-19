export class NodoCola<T> {
  dato: T;
  siguiente: NodoCola<T> | null;
  constructor(dato: T) {
    this.dato = dato;
    this.siguiente = null;
  }
}

export class Cola<T> {
  private frente: NodoCola<T> | null = null;
  private final: NodoCola<T> | null = null;
  private tamanio = 0;

  encolar(dato: T): void {
    const nuevo = new NodoCola(dato);
    if (!this.final) {
      this.frente = nuevo;
      this.final = nuevo;
    } else {
      this.final.siguiente = nuevo;
      this.final = nuevo;
    }
    this.tamanio++;
  }

  desencolar(): T | null {
    if (!this.frente) return null;
    const dato = this.frente.dato;
    this.frente = this.frente.siguiente;
    if (!this.frente) this.final = null;
    this.tamanio--;
    return dato;
  }

  verFrente(): T | null { return this.frente ? this.frente.dato : null; }
  estaVacia(): boolean { return this.tamanio === 0; }
  obtenerTamanio(): number { return this.tamanio; }
  limpiar(): void { this.frente = null; this.final = null; this.tamanio = 0; }

  recorrer(): T[] {
    const r: T[] = [];
    let actual = this.frente;
    while (actual) {
      r.push(actual.dato);
      actual = actual.siguiente;
    }
    return r;
  }
}
