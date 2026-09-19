import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
  Dimensions,
  Text,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useGame } from '../context/GameContext';
import { obtenerPokemonAleatorio } from '../utils/pokemonDatabase';

const ASH_ABAJO = [
  require('../assets/sprites/ash bajando 1.png'),
  require('../assets/sprites/ash bajando 2.png'),
  require('../assets/sprites/ash bajando 3.png'),
  require('../assets/sprites/ash bajando 4.png'),
];

const ASH_ARRIBA = [
  require('../assets/sprites/ash subiendo 1.png'),
  require('../assets/sprites/ash subiendo 2.png'),
  require('../assets/sprites/ash subiendo 3.png'),
  require('../assets/sprites/ash subiendo 4.png'),
];

const ASH_IZQUIERDA = [
  require('../assets/sprites/ash izquierda 1.png'),
  require('../assets/sprites/ash izquierda 2.png'),
  require('../assets/sprites/ash izquierda 3.png'),
  require('../assets/sprites/ash izquierda 4.png'),
];

const ASH_DERECHA = [
  require('../assets/sprites/ash derecha 1.png'),
  require('../assets/sprites/ash derecha 2.png'),
  require('../assets/sprites/ash derecha 3.png'),
  require('../assets/sprites/ash derecha 4.png'),
];

const MAPA_RUTA_3_COMPLETA = require('../assets/mapa/Ruta3_Completa.png');

const NPC_1 = require('../assets/NPC/NPC1.png');
const NPC_2 = require('../assets/NPC/NPC2.png');

type Props = NativeStackScreenProps<RootStackParamList, 'Ruta3'>;

const COLUMNAS = 40;
const FILAS = 12;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const VIEWPORT_HEIGHT = SCREEN_HEIGHT * 0.62;

const TILE_SIZE = 48;
const MAP_WIDTH = COLUMNAS * TILE_SIZE;
const MAP_HEIGHT = FILAS * TILE_SIZE;

const MATRIZ_MAPA_RUTA3 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 3, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 3, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
];

const LISTA_NPCS_RUTA3 = [
  {
    id: 1,
    fila: 3,
    col: 28,
    sprite: NPC_1,
    nombre: 'Joven Carlos',
    dialogo: '¡Te vi desde lejos! ¡Vamos a combatir!',
    esBatalla: true,
  },
  {
    id: 2,
    fila: 8,
    col: 22,
    sprite: NPC_2,
    nombre: 'Chica Ana',
    dialogo: 'Ese edificio blanco y rojo es un Centro Pokémon. Cura a tus Pokémon si están cansados.',
    esBatalla: false,
  },
];

export default function Ruta3Screen({ navigation, route }: Props) {
  const { equipo } = useGame();
  const posicionInicial = route.params?.posicionAnterior || { fila: 1, col: 0 };
  const [posJugador, setPosJugador] = useState(posicionInicial);
  const [direccion, setDireccion] = useState<'ARRIBA' | 'ABAJO' | 'IZQUIERDA' | 'DERECHA'>('DERECHA');
  const [framePaso, setFramePaso] = useState(0);

  useEffect(() => {
    if (route.params?.posicionAnterior) {
      setPosJugador(route.params.posicionAnterior);
    }
  }, [route.params?.posicionAnterior]);

  const targetX = SCREEN_WIDTH / 2 - (posJugador.col * TILE_SIZE + TILE_SIZE / 2);
  const targetY = VIEWPORT_HEIGHT / 2 - (posJugador.fila * TILE_SIZE + TILE_SIZE / 2);

  const cameraX = Math.min(0, Math.max(SCREEN_WIDTH - MAP_WIDTH, targetX));
  const cameraY = Math.min(0, Math.max(VIEWPORT_HEIGHT - MAP_HEIGHT, targetY));

  const mover = (dir: 'ARRIBA' | 'ABAJO' | 'IZQUIERDA' | 'DERECHA') => {
    setDireccion(dir);
    setFramePaso((prev) => (prev + 1) % 4);

    let nuevaFila = posJugador.fila;
    let nuevaCol = posJugador.col;

    if (dir === 'ARRIBA') nuevaFila--;
    if (dir === 'ABAJO') nuevaFila++;
    if (dir === 'IZQUIERDA') nuevaCol--;
    if (dir === 'DERECHA') nuevaCol++;

    if (nuevaCol < 0) {
      navigation.replace('Ruta2', { posicionAnterior: { fila: 0, col: 2 } });
      return;
    }

    if (nuevaFila < 0 || nuevaFila >= FILAS || nuevaCol >= COLUMNAS) return;

    const tipoCasilla = MATRIZ_MAPA_RUTA3[nuevaFila][nuevaCol];

    if (tipoCasilla === 1) return;

    if (tipoCasilla === 3) {
      if (nuevaCol === 32 || nuevaCol === 33) {
        navigation.replace('CentroPokemon', { posicionAnterior: { fila: 8, col: 4 } });
      } else {
        Alert.alert('Monte Moon', 'Estás en la entrada de la Cueva del Monte Moon.');
      }
      return;
    }

    const npcEncontrado = LISTA_NPCS_RUTA3.find(
      (npc) => npc.fila === nuevaFila && npc.col === nuevaCol
    );

    if (npcEncontrado) {
      if (npcEncontrado.esBatalla) {
        const enemigoNPC = obtenerPokemonAleatorio();
        Alert.alert(`¡Desafío de ${npcEncontrado.nombre}!`, npcEncontrado.dialogo, [
          {
            text: 'Aceptar',
            onPress: () =>
              setTimeout(() => {
                navigation.navigate('Batalla', {
                  enemyPokemon: enemigoNPC as any,
                  esEntrenador: true,
                  rutaOrigen: 'Ruta3',
                  posicionAnterior: { fila: nuevaFila, col: nuevaCol },
                });
              }, 50),
          },
        ]);
      } else {
        Alert.alert(npcEncontrado.nombre, npcEncontrado.dialogo);
      }
      return;
    }

    setPosJugador({ fila: nuevaFila, col: nuevaCol });

    if (tipoCasilla === 2 && Math.random() <= 0.15) {
      const enemigoSalvaje = obtenerPokemonAleatorio();
      setTimeout(() => {
        navigation.navigate('Batalla', {
          enemyPokemon: enemigoSalvaje,
          esEntrenador: false,
          rutaOrigen: 'Ruta3',
          posicionAnterior: { fila: nuevaFila, col: nuevaCol },
        });
      }, 50);
    }
  };

  const obtenerSpriteAsh = () => {
    switch (direccion) {
      case 'ARRIBA': return ASH_ARRIBA[framePaso];
      case 'ABAJO': return ASH_ABAJO[framePaso];
      case 'IZQUIERDA': return ASH_IZQUIERDA[framePaso];
      case 'DERECHA': return ASH_DERECHA[framePaso];
      default: return ASH_ABAJO[0];
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewport}>
        <View style={[styles.mapaContainer, { transform: [{ translateX: cameraX }, { translateY: cameraY }] }]}>
          <ImageBackground source={MAPA_RUTA_3_COMPLETA} style={{ width: MAP_WIDTH, height: MAP_HEIGHT }} resizeMode="stretch">
            {Array.from({ length: FILAS }).map((_, fIndex) => (
              <View key={fIndex} style={styles.fila}>
                {Array.from({ length: COLUMNAS }).map((_, cIndex) => {
                  const esJugador = posJugador.fila === fIndex && posJugador.col === cIndex;
                  const npc = LISTA_NPCS_RUTA3.find((n) => n.fila === fIndex && n.col === cIndex);

                  return (
                    <View key={cIndex} style={styles.celda}>
                      {esJugador && <Image source={obtenerSpriteAsh()} style={styles.spriteAsh} resizeMode="contain" />}
                      {npc && !esJugador && <Image source={npc.sprite} style={styles.spriteNPC} resizeMode="contain" />}
                    </View>
                  );
                })}
              </View>
            ))}
          </ImageBackground>
        </View>
      </View>

      <View style={styles.panelInferior}>
        <View style={styles.seccionControles}>
          <View style={styles.controles}>
            <TouchableOpacity style={styles.btnDPad} onPress={() => mover('ARRIBA')}><Text style={styles.flecha}>▲</Text></TouchableOpacity>
            <View style={styles.filaHorizontalDPad}>
              <TouchableOpacity style={styles.btnDPad} onPress={() => mover('IZQUIERDA')}><Text style={styles.flecha}>◀</Text></TouchableOpacity>
              <View style={{ width: 36 }} />
              <TouchableOpacity style={styles.btnDPad} onPress={() => mover('DERECHA')}><Text style={styles.flecha}>▶</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.btnDPad} onPress={() => mover('ABAJO')}><Text style={styles.flecha}>▼</Text></TouchableOpacity>
          </View>

          <View style={styles.menuOpciones}>
            <TouchableOpacity style={styles.btnAccion} onPress={() => navigation.navigate('Equipo')}>
              <Text style={styles.btnAccionText}>👥 Equipo ({equipo.length}/6)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnAccion} onPress={() => navigation.navigate('Mochila')}>
              <Text style={styles.btnAccionText}>🎒 Mochila</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnAccion} onPress={() => navigation.navigate('Pokedex')}>
              <Text style={styles.btnAccionText}>📖 PokéDex</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnAccion} onPress={() => navigation.navigate('Mercado')}>
              <Text style={styles.btnAccionText}>📈 Mercado</Text>
            </TouchableOpacity>

            <View style={styles.filaGuardar}>
              <TouchableOpacity style={[styles.btnMini, { backgroundColor: '#2563eb' }]} onPress={() => navigation.navigate('GuardarCargar', { modo: 'guardar' })}>
                <Text style={styles.btnMiniText}>💾 Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnMini, { backgroundColor: '#d97706' }]} onPress={() => navigation.navigate('GuardarCargar', { modo: 'cargar' })}>
                <Text style={styles.btnMiniText}>📂 Cargar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.btnMenu} onPress={() => navigation.navigate('MenuPrincipal')}>
          <Text style={styles.btnMenuText}>🚪 Salir al Menú Principal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  viewport: { height: VIEWPORT_HEIGHT, width: SCREEN_WIDTH, backgroundColor: '#000000', overflow: 'hidden', borderBottomWidth: 3, borderBottomColor: '#38bdf8' },
  mapaContainer: { width: MAP_WIDTH, height: MAP_HEIGHT },
  fila: { flexDirection: 'row' },
  celda: { width: TILE_SIZE, height: TILE_SIZE, justifyContent: 'center', alignItems: 'center' },
  spriteAsh: { width: TILE_SIZE * 0.9, height: TILE_SIZE * 0.9, zIndex: 10 },
  spriteNPC: { width: TILE_SIZE * 0.85, height: TILE_SIZE * 0.85 },
  panelInferior: { flex: 1, backgroundColor: '#0f172a', paddingHorizontal: 10, justifyContent: 'space-around', paddingVertical: 6 },
  seccionControles: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  controles: { alignItems: 'center', justifyContent: 'center' },
  filaHorizontalDPad: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  btnDPad: { width: 38, height: 38, backgroundColor: '#1e293b', borderColor: '#38bdf8', borderWidth: 1.5, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  flecha: { color: '#ffffff', fontSize: 14 },
  menuOpciones: { width: '56%', gap: 4 },
  btnAccion: { backgroundColor: '#1e293b', paddingVertical: 5, paddingHorizontal: 6, borderRadius: 6, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
  btnAccionText: { color: '#e2e8f0', fontWeight: 'bold', fontSize: 11 },
  filaGuardar: { flexDirection: 'row', gap: 4 },
  btnMini: { flex: 1, paddingVertical: 5, borderRadius: 6, alignItems: 'center' },
  btnMiniText: { color: '#ffffff', fontWeight: 'bold', fontSize: 10 },
  btnMenu: { backgroundColor: '#dc2626', paddingVertical: 6, borderRadius: 8, alignItems: 'center', marginTop: 2 },
  btnMenuText: { color: '#ffffff', fontWeight: 'bold', fontSize: 11 },
});