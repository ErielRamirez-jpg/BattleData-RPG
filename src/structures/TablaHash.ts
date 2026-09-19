import { ListaEnlazada } from './ListaEnlazada';

export class EntradaHash<K, V> {
  clave: K;
  valor: V;
  constructor(clave: K, valor: V) {
    this.clave = clave;
    this.valor = valor;
  }
}

export class TablaHash<K, V> {
  private buckets: ListaEnlazada<EntradaHash<K, V>>[];
  private capacidad: number;
  private tamanio = 0;

  constructor(capacidad = 31) {
    this.capacidad = capacidad;
    this.buckets = Array.from({ length: capacidad }, () => new ListaEnlazada<EntradaHash<K, V>>());
  }

  private hash(clave: K): number {
    const str = String(clave);
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % this.capacidad;
    return Math.abs(h);
  }

  insertar(clave: K, valor: V): void {
    const lista = this.buckets[this.hash(clave)];
    const existente = lista.buscarPor((e) => e.clave === clave);
    if (existente) { existente.valor = valor; return; }
    lista.insertar(new EntradaHash(clave, valor));
    this.tamanio++;
  }

  obtener(clave: K): V | null {
    const entrada = this.buckets[this.hash(clave)].buscarPor((e) => e.clave === clave);
    return entrada ? entrada.valor : null;
  }

  eliminar(clave: K): boolean {
    const lista = this.buckets[this.hash(clave)];
    const entrada = lista.buscarPor((e) => e.clave === clave);
    if (entrada) { lista.eliminar(entrada); this.tamanio--; return true; }
    return false;
  }

  contiene(clave: K): boolean { return this.obtener(clave) !== null; }
  obtenerTamanio(): number { return this.tamanio; }

  obtenerValores(): V[] {
    const r: V[] = [];
    for (const b of this.buckets) for (const e of b.recorrer()) r.push(e.valor);
    return r;
  }

  obtenerClaves(): K[] {
    const r: K[] = [];
    for (const b of this.buckets) for (const e of b.recorrer()) r.push(e.clave);
    return r;
  }
}
