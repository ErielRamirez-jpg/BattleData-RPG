import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Criatura } from '../models/Criatura';
import { Inventario, Item } from '../models/Item';

export interface SlotPartida {
  id: number;
  fecha: string;
  nombreJugador: string;
  cantidadEquipo: number;
  equipoResumen: { nombre: string; nivel: number; hpActual: number; hpMaximo: number; icono: any }[];
  ciudadActualId: string;
}

interface GameContextType {
  equipo: Criatura[];
  caja: Criatura[];
  nombreJugador: string;
  enemigoActual: Criatura | null;
  inventario: Inventario;
  ciudadActualId: string;
  medallas: string[];
  dinero: number;
  setDinero: React.Dispatch<React.SetStateAction<number>>;
  setEquipo: React.Dispatch<React.SetStateAction<Criatura[]>>;
  setCaja: React.Dispatch<React.SetStateAction<Criatura[]>>;
  setNombreJugador: (nombre: string) => void;
  setEnemigoActual: (enemigo: Criatura | null) => void;
  setCiudadActualId: (id: string) => void;
  agregarAlEquipo: (criatura: Criatura) => boolean;
  intercambiarConCaja: (indexEquipo: number, indexCaja: number) => void;
  ganarMedalla: (nombreMedalla: string) => void;
  actualizarHpCriatura: (id: number, nuevoHp: number) => void;
  curarEquipoCompleto: () => boolean;
  guardarPartidaEnSlot: (slotIndex: number) => Promise<boolean>;
  cargarPartidaDeSlot: (slotIndex: number) => Promise<boolean>;
  obtenerSlotsGuardados: () => Promise<(SlotPartida | null)[]>;
  otorgarRecompensaBatalla: () => string;
  agregarObjeto: (idItem: string, cantidad: number) => void;
}

const defaultInventario = new Inventario();
defaultInventario.agregarItem(new Item('pocion', 'Poción', 'Pocion', 'Restaura 20 HP', 20, 5, require('../assets/icons/potion.png')));
defaultInventario.agregarItem(new Item('pokebola', 'Pokébola', 'Pokebola', 'Captura criaturas', 1, 10, require('../assets/icons/pokeball.png')));

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipo, setEquipo] = useState<Criatura[]>([]);
  const [caja, setCaja] = useState<Criatura[]>([]);
  const [nombreJugador, setNombreJugador] = useState<string>('Red');
  const [enemigoActual, setEnemigoActual] = useState<Criatura | null>(null);
  const [inventario] = useState<Inventario>(defaultInventario);
  const [ciudadActualId, setCiudadActualId] = useState<string>('pueblo_paleta');
  const [medallas, setMedallas] = useState<string[]>([]);
  const [dinero, setDinero] = useState<number>(3000);
  const [, setInventarioTrigger] = useState<number>(0);

  const agregarAlEquipo = (nueva: Criatura): boolean => {
    let exito = false;
    setEquipo((prevEquipo) => {
      if (prevEquipo.length < 6) {
        exito = true;
        return [...prevEquipo, nueva];
      } else {
        setCaja((prevCaja) => [...prevCaja, nueva]);
        exito = true;
        return prevEquipo;
      }
    });
    return exito;
  };

  const intercambiarConCaja = (indexEquipo: number, indexCaja: number) => {
    const pokemonEquipoActual = equipo[indexEquipo];
    const pokemonCajaActual = caja[indexCaja];

    if (pokemonEquipoActual && pokemonCajaActual) {
      const nuevoEquipo = [...equipo];
      const nuevaCaja = [...caja];

      nuevoEquipo[indexEquipo] = pokemonCajaActual;
      nuevaCaja[indexCaja] = pokemonEquipoActual;

      setEquipo(nuevoEquipo);
      setCaja(nuevaCaja);
    }
  };

  const ganarMedalla = (medalla: string) => {
    if (!medallas.includes(medalla)) {
      setMedallas([...medallas, medalla]);
    }
  };

  const actualizarHpCriatura = (id: number, nuevoHp: number) => {
    setEquipo((prevEquipo) =>
      prevEquipo.map((criatura) => {
        if (criatura.id === id) {
          criatura.hpActual = Math.max(0, Math.min(nuevoHp, criatura.hpMaximo));
        }
        return criatura;
      })
    );
  };

  const curarEquipoCompleto = (): boolean => {
    let curoAlGuien = false;
    setEquipo((prevEquipo) =>
      prevEquipo.map((criatura) => {
        if (criatura.hpActual < criatura.hpMaximo) {
          curoAlGuien = true;
          return Object.assign(Object.create(Object.getPrototypeOf(criatura)), criatura, {
            hpActual: criatura.hpMaximo,
          });
        }
        return criatura;
      })
    );
    return curoAlGuien;
  };

  const agregarObjeto = (idItem: string, cantidad: number = 1) => {
    const idNormalizado = idItem.toLowerCase().trim();
    const itemsList = typeof inventario.obtenerItems === 'function' ? inventario.obtenerItems() : [];
    
    let idUnico = idNormalizado;
    if (idNormalizado === 'pokeball' || idNormalizado === 'pokebola') {
      idUnico = 'pokebola';
    } else if (idNormalizado === 'potion' || idNormalizado === 'poción') {
      idUnico = 'pocion';
    } else if (idNormalizado === 'superpotion' || idNormalizado === 'superpoción') {
      idUnico = 'superpotion';
    } else if (idNormalizado === 'greatball' || idNormalizado === 'superbola') {
      idUnico = 'greatball';
    }

    const itemEncontrado = itemsList.find((i: any) => {
      const iId = (i.id || '').toLowerCase().trim();
      return iId === idUnico || iId === idNormalizado;
    });
    
    if (itemEncontrado) {
      itemEncontrado.cantidad += cantidad;
    } else {
      let nombre = 'Objeto';
      let descripcion = 'Objeto comprado';
      let poder = 20;
      let icono = require('../assets/icons/potion.png');

      if (idUnico === 'pokebola') {
        nombre = 'Pokébola';
        descripcion = 'Captura criaturas';
        poder = 1;
        icono = require('../assets/icons/pokeball.png');
      } else if (idUnico === 'superpotion') {
        nombre = 'Superpoción';
        descripcion = 'Restaura 50 HP';
        poder = 50;
        icono = require('../assets/icons/superpotion.png');
      } else if (idUnico === 'greatball') {
        nombre = 'Superbola';
        descripcion = 'Captura criaturas con mayor facilidad';
        poder = 1;
        icono = require('../assets/icons/greatball.png');
      } else if (idUnico === 'pocion') {
        nombre = 'Poción';
        descripcion = 'Restaura 20 HP';
        poder = 20;
        icono = require('../assets/icons/potion.png');
      }

      const nuevoItem = new Item(idUnico, nombre, idUnico, descripcion, poder, cantidad, icono);
      if (typeof inventario.agregarItem === 'function') {
        inventario.agregarItem(nuevoItem);
      }
    }
    setInventarioTrigger((prev) => prev + 1);
  };

  const otorgarRecompensaBatalla = (): string => {
    const itemsDisponibles = ['pocion', 'pokebola'];
    const idItemElegido = itemsDisponibles[Math.floor(Math.random() * itemsDisponibles.length)];
    agregarObjeto(idItemElegido, 1);
    return idItemElegido === 'pocion' ? '1x Poción' : '1x Pokébola';
  };

  const mapearCriaturaSave = (c: Criatura) => ({
    id: c.id,
    nombre: c.nombre,
    tipo1: c.tipo1,
    tipo2: c.tipo2,
    nivel: c.nivel,
    hpMaximo: c.hpMaximo,
    hpActual: c.hpActual,
    ataque: c.ataque,
    defensa: c.defensa,
    ataqueEspecial: c.ataqueEspecial,
    defensaEspecial: c.defensaEspecial,
    velocidad: c.velocidad,
    descripcion: c.descripcion,
    movimientos: c.movimientos,
    experiencia: c.experiencia,
    spriteFront: (c as any).spriteFront,
    spriteBack: (c as any).spriteBack,
    icono: (c as any).icono,
  });

  const restaurarCriaturaLoad = (c: any): Criatura => {
    const criatura = new Criatura(
      c.id,
      c.nombre,
      c.tipo1,
      c.tipo2,
      c.nivel,
      c.hpMaximo,
      c.ataque,
      c.defensa,
      c.ataqueEspecial,
      c.defensaEspecial,
      c.velocidad,
      c.descripcion,
      null
    );
    criatura.hpActual = c.hpActual;
    criatura.experiencia = c.experiencia || 0;
    criatura.movimientos = c.movimientos || [];
    (criatura as any).spriteFront = c.spriteFront;
    (criatura as any).spriteBack = c.spriteBack;
    (criatura as any).icono = c.icono;
    return criatura;
  };

  const guardarPartidaEnSlot = async (slotIndex: number): Promise<boolean> => {
    try {
      const ahora = new Date();
      const fechaFormateada = `${ahora.toLocaleDateString()} - ${ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      const saveData = {
        fecha: fechaFormateada,
        nombreJugador,
        ciudadActualId,
        medallas,
        dinero,
        equipo: equipo.map(mapearCriaturaSave),
        caja: caja.map(mapearCriaturaSave),
      };

      await AsyncStorage.setItem(`CHRONOMON_SLOT_${slotIndex}`, JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error('Error al guardar partida:', error);
      return false;
    }
  };

  const cargarPartidaDeSlot = async (slotIndex: number): Promise<boolean> => {
    try {
      const dataString = await AsyncStorage.getItem(`CHRONOMON_SLOT_${slotIndex}`);
      if (!dataString) return false;

      const saveData = JSON.parse(dataString);
      setNombreJugador(saveData.nombreJugador || 'Red');
      setCiudadActualId(saveData.ciudadActualId || 'pueblo_paleta');
      setMedallas(saveData.medallas || []);
      setDinero(saveData.dinero !== undefined ? saveData.dinero : 3000);

      const equipoRestaurado: Criatura[] = (saveData.equipo || []).map(restaurarCriaturaLoad);
      const cajaRestaurada: Criatura[] = (saveData.caja || []).map(restaurarCriaturaLoad);

      setEquipo(equipoRestaurado);
      setCaja(cajaRestaurada);
      return true;
    } catch (error) {
      console.error('Error al cargar partida:', error);
      return false;
    }
  };

  const obtenerSlotsGuardados = async (): Promise<(SlotPartida | null)[]> => {
    const slots: (SlotPartida | null)[] = [null, null, null];
    for (let i = 0; i < 3; i++) {
      try {
        const dataString = await AsyncStorage.getItem(`CHRONOMON_SLOT_${i}`);
        if (dataString) {
          const parsed = JSON.parse(dataString);
          slots[i] = {
            id: i,
            fecha: parsed.fecha || 'Fecha desconocida',
            nombreJugador: parsed.nombreJugador || 'Red',
            cantidadEquipo: parsed.equipo?.length || 0,
            equipoResumen: (parsed.equipo || []).map((c: any) => ({
              nombre: c.nombre,
              nivel: c.nivel,
              hpActual: c.hpActual,
              hpMaximo: c.hpMaximo,
              icono: c.icono,
            })),
            ciudadActualId: parsed.ciudadActualId || '',
          };
        }
      } catch (e) {
        slots[i] = null;
      }
    }
    return slots;
  };

  return (
    <GameContext.Provider
      value={{
        equipo,
        caja,
        nombreJugador,
        enemigoActual,
        inventario,
        ciudadActualId,
        medallas,
        dinero,
        setDinero,
        setEquipo,
        setCaja,
        setNombreJugador,
        setEnemigoActual,
        setCiudadActualId,
        agregarAlEquipo,
        intercambiarConCaja,
        ganarMedalla,
        actualizarHpCriatura,
        curarEquipoCompleto,
        guardarPartidaEnSlot,
        cargarPartidaDeSlot,
        obtenerSlotsGuardados,
        otorgarRecompensaBatalla,
        agregarObjeto,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame debe usarse dentro de un GameProvider');
  return context;
};