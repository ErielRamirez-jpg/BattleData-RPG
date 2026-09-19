import { Criatura } from '../models/Criatura';
import { Movimiento, TipoCriatura } from '../types';

export function obtenerSprite(id: number, vista: 'front' | 'back' | 'icon') {
  if (vista === 'back') {
    return { uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png` };
  }
  if (vista === 'icon') {
    return { uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png` };
  }
  return { uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif` };
}

export const movimientos: Record<string, Movimiento> = {
  latigo: { nombre: 'Látigo Cepa', tipo: 'Planta', poder: 45, precision: 100, categoria: 'Fisico' },
  hojaAfilada: { nombre: 'Hoja Afilada', tipo: 'Planta', poder: 55, precision: 95, categoria: 'Fisico' },
  ascuas: { nombre: 'Ascuas', tipo: 'Fuego', poder: 40, precision: 100, categoria: 'Especial' },
  giroFuego: { nombre: 'Giro Fuego', tipo: 'Fuego', poder: 35, precision: 85, categoria: 'Especial' },
  pistolaAgua: { nombre: 'Pistola Agua', tipo: 'Agua', poder: 40, precision: 100, categoria: 'Especial' },
  burbuja: { nombre: 'Burbuja', tipo: 'Agua', poder: 40, precision: 100, categoria: 'Especial' },
  impactrueno: { nombre: 'Impactrueno', tipo: 'Electricidad', poder: 40, precision: 100, categoria: 'Especial' },
  rayo: { nombre: 'Rayo', tipo: 'Electricidad', poder: 90, precision: 100, categoria: 'Especial' },
  hueso: { nombre: 'Hueso Palo', tipo: 'Tierra', poder: 65, precision: 85, categoria: 'Fisico' },
  bofetonLodo: { nombre: 'Bofetón Lodo', tipo: 'Tierra', poder: 20, precision: 100, categoria: 'Especial' },
  garraMetal: { nombre: 'Garra Metal', tipo: 'Metal', poder: 50, precision: 95, categoria: 'Fisico' },
  cabezaHierro: { nombre: 'Cabeza de Hierro', tipo: 'Metal', poder: 80, precision: 100, categoria: 'Fisico' },
  aranazo: { nombre: 'Arañazo', tipo: 'Normal', poder: 40, precision: 100, categoria: 'Fisico' },
  placaje: { nombre: 'Placaje', tipo: 'Normal', poder: 40, precision: 100, categoria: 'Fisico' },
  golpe: { nombre: 'Golpe', tipo: 'Normal', poder: 50, precision: 100, categoria: 'Fisico' },
};

export function crearPokemonPorId(id: number, nombre: string, tipo: TipoCriatura, nivel = 5): Criatura {
  const hpBase = 40 + Math.floor(Math.random() * 20);
  const ataqBase = 45 + Math.floor(Math.random() * 20);
  const defBase = 45 + Math.floor(Math.random() * 20);

  const c = new Criatura(
    id, nombre, tipo, null, nivel, hpBase, ataqBase, defBase, 50, 50, 50,
    `Un Pokémon de tipo ${tipo} registrado en la Pokédex.`,
    obtenerSprite(id, 'icon'),  
    obtenerSprite(id, 'back'), // Asigna la espalda a la propiedad interna que usa tu equipo en combate
    obtenerSprite(id, 'front') // Asigna el frente para el rival
  );
  c.aprenderMovimiento(movimientos.placaje);
  c.aprenderMovimiento(movimientos.golpe);
  return c;
}

export function crearBulbasaur(nivel = 5): Criatura {
  const c = new Criatura(
    1, 'Bulbasaur', 'Planta', null, nivel, 45, 49, 49, 65, 65, 45,
    'Bulbasaur puede ser visto dormido la siesta bajo la luz del sol.',
    obtenerSprite(1, 'icon'), obtenerSprite(1, 'back'), obtenerSprite(1, 'front')
  );
  c.aprenderMovimiento(movimientos.placaje);
  c.aprenderMovimiento(movimientos.latigo);
  c.aprenderMovimiento(movimientos.hojaAfilada);
  return c;
}

export function crearCharmander(nivel = 5): Criatura {
  const c = new Criatura(
    4, 'Charmander', 'Fuego', null, nivel, 39, 52, 43, 60, 50, 65,
    'La llama de su cola indica su estado de ánimo.',
    obtenerSprite(4, 'icon'), obtenerSprite(4, 'back'), obtenerSprite(4, 'front')
  );
  c.aprenderMovimiento(movimientos.aranazo);
  c.aprenderMovimiento(movimientos.ascuas);
  c.aprenderMovimiento(movimientos.giroFuego);
  return c;
}

export function crearSquirtle(nivel = 5): Criatura {
  const c = new Criatura(
    7, 'Squirtle', 'Agua', null, nivel, 44, 48, 65, 50, 64, 43,
    'El caparazón de Squirtle no solo le sirve de protección.',
    obtenerSprite(7, 'icon'), obtenerSprite(7, 'back'), obtenerSprite(7, 'front')
  );
  c.aprenderMovimiento(movimientos.placaje);
  c.aprenderMovimiento(movimientos.pistolaAgua);
  c.aprenderMovimiento(movimientos.burbuja);
  return c;
}

export function crearPikachu(nivel = 5): Criatura {
  const c = new Criatura(
    25, 'Pikachu', 'Electricidad', null, nivel, 35, 55, 40, 50, 50, 90,
    'Cuando se enfada, descarga la energía de sus mejillas.',
    obtenerSprite(25, 'icon'), obtenerSprite(25, 'back'), obtenerSprite(25, 'front')
  );
  c.aprenderMovimiento(movimientos.impactrueno);
  c.aprenderMovimiento(movimientos.rayo);
  c.aprenderMovimiento(movimientos.golpe);
  return c;
}

export function crearCubone(nivel = 5): Criatura {
  const c = new Criatura(
    104, 'Cubone', 'Tierra', null, nivel, 50, 50, 95, 40, 50, 35,
    'Cubone lleva el cráneo de su madre fallecida.',
    obtenerSprite(104, 'icon'), obtenerSprite(104, 'back'), obtenerSprite(104, 'front')
  );
  c.aprenderMovimiento(movimientos.bofetonLodo);
  c.aprenderMovimiento(movimientos.hueso);
  c.aprenderMovimiento(movimientos.golpe);
  return c;
}

export function crearMetang(nivel = 5): Criatura {
  const c = new Criatura(
    375, 'Metang', 'Metal', null, nivel, 60, 75, 100, 55, 80, 50,
    'Metang se forma cuando dos Beldum se unen.',
    obtenerSprite(375, 'icon'), obtenerSprite(375, 'back'), obtenerSprite(375, 'front')
  );
  c.aprenderMovimiento(movimientos.garraMetal);
  c.aprenderMovimiento(movimientos.cabezaHierro);
  c.aprenderMovimiento(movimientos.golpe);
  return c;
}

export const nombresKanto = [
  "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard",
  "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree",
  "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot", "Rattata",
  "Raticate", "Spearow", "Fearow", "Ekans", "Arbok", "Pikachu", "Raichu",
  "Sandshrew", "Sandslash", "Nidoran♀", "Nidorina", "Nidoqueen", "Nidoran♂",
  "Nidorino", "Nidoking", "Clefairy", "Clefable", "Vulpix", "Ninetales",
  "Jigglypuff", "Wigglytuff", "Zubat", "Golbat", "Oddish", "Gloom", "Vileplume",
  "Paras", "Parasect", "Venonat", "Venomoth", "Diglett", "Dugtrio", "Meowth",
  "Persian", "Psyduck", "Golduck", "Mankey", "Primeape", "Growlithe", "Arcanine",
  "Poliwag", "Poliwhirl", "Poliwrath", "Abra", "Kadabra", "Alakazam", "Machop",
  "Machoke", "Machamp", "Bellsprout", "Weepinbell", "Victreebel", "Tentacool",
  "Tentacruel", "Geodude", "Graveler", "Golem", "Ponyta", "Rapidash", "Slowpoke",
  "Slowbro", "Magnemite", "Magneton", "Farfetch'd", "Doduo", "Dodrio", "Seel",
  "Dewgong", "Grimer", "Muk", "Shellder", "Cloyster", "Gastly", "Haunter",
  "Gengar", "Onix", "Drowzee", "Hypno", "Krabby", "Kingler", "Voltorb",
  "Electrode", "Exeggcute", "Exeggutor", "Cubone", "Marowak", "Hitmonlee",
  "Hitmonchan", "Lickitung", "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Chansey",
  "Tangela", "Kangaskhan", "Horsea", "Seadra", "Goldeen", "Seaking", "Staryu",
  "Starmie", "Mr. Mime", "Scyther", "Jynx", "Electabuzz", "Magmar", "Pinsir",
  "Tauros", "Magikarp", "Gyarados", "Lapras", "Ditto", "Eevee", "Vaporeon",
  "Jolteon", "Flareon", "Porygon", "Omanyte", "Omastar", "Kabuto", "Kabutops",
  "Aerodactyl", "Snorlax", "Articuno", "Zapdos", "Moltres", "Dratini",
  "Dragonair", "Dragonite", "Mewtwo", "Mew"
];

export function generarEncuentroSalvaje(nivel = 5) {
  const idRandom = Math.floor(Math.random() * 151) + 1;
  const nombre = nombresKanto[idRandom - 1];
  return crearPokemonPorId(idRandom, nombre, 'Salvaje', nivel);
}

export const todasLasCriaturas = [
  crearBulbasaur,
  crearCharmander,
  crearSquirtle,
  crearPikachu,
  crearCubone,
  crearMetang,
];

export const nombresCriaturas = [
  'Bulbasaur',
  'Charmander',
  'Squirtle',
  'Pikachu',
  'Cubone',
  'Metang',
];