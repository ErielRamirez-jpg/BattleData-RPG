// src/utils/pokemonDatabase.ts

import { 
  crearPokemonPorId, 
  obtenerSprite, 
  nombresKanto 
} from '../data/criaturas';
import { Criatura } from '../models/Criatura';
import { TipoCriatura } from '../types';

export interface PokemonData {
  id: number;
  nombre: string;
  front: { uri: string };
  back: { uri: string };
  hpMax: number;
  tipo: string;
  ataque: number;
  defensa: number;
  ataques: { nombre: string; potencia: number; tipo: string }[];
}

// ⚠️ AQUÍ ESTÁ EL FILTRO CLAVE: 
// Solo incluimos los IDs de Pokémon clásicos cuyos sprites de la PokeAPI sabemos que cargan bien 
// (ej. Los starters, Pikachu, Pidgey, Rattata, Geodude, etc.)
const IDS_SEGUROS_ROUTAS = [1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 35, 39, 41, 50, 54, 66, 74, 104];

export const LISTA_POKEMON: PokemonData[] = IDS_SEGUROS_ROUTAS.map((id) => {
  const index = id - 1;
  const nombre = nombresKanto[index] || `Pokemon ${id}`;
  
  return {
    id,
    nombre,
    front: obtenerSprite(id, 'front'),
    back: obtenerSprite(id, 'back'),
    hpMax: 50 + (id % 30),
    tipo: 'Normal',
    ataque: 40 + (id % 20),
    defensa: 40 + (id % 15),
    ataques: [
      { nombre: 'Placaje', potencia: 40, tipo: 'Normal' },
      { nombre: 'Ataque Rápido', potencia: 35, tipo: 'Normal' },
    ],
  };
});

export function obtenerPokemonAleatorio(): PokemonData {
  const indice = Math.floor(Math.random() * LISTA_POKEMON.length);
  return LISTA_POKEMON[indice];
}

export function obtenerCriaturaAleatoria(nivel: number = 5): Criatura {
  const data = obtenerPokemonAleatorio();
  return crearPokemonPorId(data.id, data.nombre, 'Normal' as TipoCriatura, nivel);
}