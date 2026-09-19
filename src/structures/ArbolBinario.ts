export class NodoArbol<T> {
  dato: T;
  izquierda: NodoArbol<T> | null = null;
  derecha: NodoArbol<T> | null = null;
  constructor(dato: T) { this.dato = dato; }
}

export class ArbolBinario<T> {
  private raiz: NodoArbol<T> | null = null;
  private comparar: (a: T, b: T) => number;

  constructor(comparar?: (a: T, b: T) => number) {
    this.comparar = comparar || ((a: any, b: any) => (a < b ? -1 : a > b ? 1 : 0));
  }

  insertar(dato: T): void {
    this.raiz = this.insertarRec(this.raiz, dato);
  }

  private insertarRec(nodo: NodoArbol<T> | null, dato: T): NodoArbol<T> {
    if (!nodo) return new NodoArbol(dato);
    const cmp = this.comparar(dato, nodo.dato);
    if (cmp < 0) nodo.izquierda = this.insertarRec(nodo.izquierda, dato);
    else if (cmp > 0) nodo.derecha = this.insertarRec(nodo.derecha, dato);
    return nodo;
  }

  buscar(dato: T): boolean {
    return this.buscarRec(this.raiz, dato);
  }

  private buscarRec(nodo: NodoArbol<T> | null, dato: T): boolean {
    if (!nodo) return false;
    const cmp = this.comparar(dato, nodo.dato);
    if (cmp === 0) return true;
    return cmp < 0 ? this.buscarRec(nodo.izquierda, dato) : this.buscarRec(nodo.derecha, dato);
  }

  inorden(): T[] {
    const r: T[] = [];
    this.inordenRec(this.raiz, r);
    return r;
  }
  private inordenRec(n: NodoArbol<T> | null, r: T[]): void {
    if (n) { this.inordenRec(n.izquierda, r); r.push(n.dato); this.inordenRec(n.derecha, r); }
  }

  preorden(): T[] {
    const r: T[] = [];
    this.preordenRec(this.raiz, r);
    return r;
  }
  private preordenRec(n: NodoArbol<T> | null, r: T[]): void {
    if (n) { r.push(n.dato); this.preordenRec(n.izquierda, r); this.preordenRec(n.derecha, r); }
  }

  postorden(): T[] {
    const r: T[] = [];
    this.postordenRec(this.raiz, r);
    return r;
  }
  private postordenRec(n: NodoArbol<T> | null, r: T[]): void {
    if (n) { this.postordenRec(n.izquierda, r); this.postordenRec(n.derecha, r); r.push(n.dato); }
  }

  obtenerRaiz(): NodoArbol<T> | null { return this.raiz; }
  estaVacio(): boolean { return this.raiz === null; }
}
