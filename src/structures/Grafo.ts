import { Cola } from './Cola';
import { ListaEnlazada } from './ListaEnlazada';

export class Ciudad {
  id: string;
  nombre: string;
  descripcion: string;
  constructor(id: string, nombre: string, descripcion = '') {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
  }
}

export class Grafo {
  private adyacencia = new Map<string, ListaEnlazada<string>>();
  private ciudades = new Map<string, Ciudad>();

  agregarCiudad(ciudad: Ciudad): void {
    if (!this.adyacencia.has(ciudad.id)) {
      this.adyacencia.set(ciudad.id, new ListaEnlazada());
      this.ciudades.set(ciudad.id, ciudad);
    }
  }

  agregarRuta(a: string, b: string): void {
    if (!this.adyacencia.has(a) || !this.adyacencia.has(b)) return;
    const la = this.adyacencia.get(a)!;
    const lb = this.adyacencia.get(b)!;
    if (!la.buscarPor((x) => x === b)) la.insertar(b);
    if (!lb.buscarPor((x) => x === a)) lb.insertar(a);
  }

  obtenerVecinos(id: string): string[] {
    return this.adyacencia.get(id)?.recorrer() ?? [];
  }

  bfs(inicio: string, destino: string): string[] | null {
    if (!this.adyacencia.has(inicio) || !this.adyacencia.has(destino)) return null;
    if (inicio === destino) return [inicio];

    const visitados = new Set<string>();
    const cola = new Cola<string>();
    const padres = new Map<string, string | null>();

    cola.encolar(inicio);
    visitados.add(inicio);
    padres.set(inicio, null);

    while (!cola.estaVacia()) {
      const actual = cola.desencolar()!;
      if (actual === destino) {
        const camino: string[] = [];
        let n: string | null = destino;
        while (n !== null) {
          camino.push(n);
          n = padres.get(n) ?? null;
        }
        return camino.reverse(); // Optimización O(N)
      }
      for (const v of this.obtenerVecinos(actual)) {
        if (!visitados.has(v)) {
          visitados.add(v);
          padres.set(v, actual);
          cola.encolar(v);
        }
      }
    }
    return null;
  }

  obtenerCiudades(): Ciudad[] {
    return Array.from(this.ciudades.values());
  }

  obtenerCiudad(id: string): Ciudad | undefined {
    return this.ciudades.get(id);
  }
}