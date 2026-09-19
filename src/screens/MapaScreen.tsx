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

const MAPA_RUTA_1_COMPLETA = require('../assets/mapa/Ruta1_Completa.png');

const NPC_1 = require('../assets/NPC/NPC1.png');
const NPC_2 = require('../assets/NPC/NPC2.png');

type Props = NativeStackScreenProps<RootStackParamList, 'Mapa'>;

const COLUMNAS = 10;
const FILAS = 28;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const VIEWPORT_HEIGHT = SCREEN_HEIGHT * 0.48;

const TILE_SIZE = 48;
const MAP_WIDTH = COLUMNAS * TILE_SIZE;
const MAP_HEIGHT = FILAS * TILE_SIZE;

const MATRIZ_MAPA = [
  [1, 1, 1, 1, 3, 3, 1, 1, 1, 1], // Fila 0: Salida a la Ruta 2
  [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 2, 2, 2, 0, 0, 1],
  [1, 0, 0, 2, 2, 2, 2, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 2, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 2, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 2, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 2, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 2, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 2, 2, 2, 1],
  [1, 1, 0, 0, 0, 0, 2, 2, 2, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 2, 2, 0, 0, 0, 2, 2, 2, 1],
  [1, 2, 2, 0, 0, 0, 2, 2, 2, 1],
  [1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
];

const LISTA_NPCS = [
  {
    id: 1,
    fila: 20,
    col: 4,
    sprite: NPC_1,
    nombre: 'Joven Chano',
    dialogo: '¡Los pantalones cortos son cómodos y fáciles de llevar!',
    esBatalla: true,
  },
  {
    id: 2,
    fila: 13,
    col: 2,
    sprite: NPC_2,
    nombre: 'Chica Marta',
    dialogo: 'Si saltas los bordillos puedes atajar camino hacia abajo.',
    esBatalla: false,
  },
  {
    id: 3,
    fila: 3,
    col: 1,
    sprite: NPC_1,
    nombre: 'Veterano Koga',
    dialogo: 'Estudié las sombras durante años. ¡Prepárate!',
    esBatalla: true,
  },
];

export default function MapaScreen({ navigation, route }: Props) {
  const { equipo } = useGame();
  const posicionInicial = route.params?.posicionAnterior || { fila: 26, col: 4 };
  const [posJugador, setPosJugador] = useState(posicionInicial);
  const [direccion, setDireccion] = useState<'ARRIBA' | 'ABAJO' | 'IZQUIERDA' | 'DERECHA'>('ARRIBA');
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

    if (nuevaFila < 0 || nuevaFila >= FILAS || nuevaCol < 0 || nuevaCol >= COLUMNAS) return;

    const tipoCasilla = MATRIZ_MAPA[nuevaFila][nuevaCol];

    if (tipoCasilla === 3) {
      navigation.replace('Ruta2', {
        posicionAnterior: { fila: 26, col: nuevaCol },
      });
      return;
    }

    if (tipoCasilla === 1) return;
    if (tipoCasilla === 4 && dir !== 'ABAJO') return;

    const npcEncontrado = LISTA_NPCS.find(
      (npc) => npc.fila === nuevaFila && npc.col === nuevaCol
    );

    if (npcEncontrado) {
      if (npcEncontrado.esBatalla) {
        // 🚀 COMBATE DIRECTO: Inicia de inmediato sin preguntar mediante Alert
        const enemigoAUsar = obtenerPokemonAleatorio();
        setTimeout(() => {
          navigation.navigate('Batalla', {
            enemyPokemon: enemigoAUsar as any,
            esEntrenador: true,
            rutaOrigen: 'Mapa',
            posicionAnterior: { fila: nuevaFila, col: nuevaCol },
          });
        }, 50);
      } else {
        // NPC pasivo que solo da consejos
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
          rutaOrigen: 'Mapa',
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
          <ImageBackground source={MAPA_RUTA_1_COMPLETA} style={{ width: MAP_WIDTH, height: MAP_HEIGHT }} resizeMode="cover">
            {Array.from({ length: FILAS }).map((_, fIndex) => (
              <View key={fIndex} style={styles.fila}>
                {Array.from({ length: COLUMNAS }).map((_, cIndex) => {
                  const esJugador = posJugador.fila === fIndex && posJugador.col === cIndex;
                  const npc = LISTA_NPCS.find((n) => n.fila === fIndex && n.col === cIndex);

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
              <View style={{ width: 40 }} />
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
  spriteAsh: { width: TILE_SIZE * 0.9, height: TILE_SIZE * 0.9 },
  spriteNPC: { width: TILE_SIZE * 0.85, height: TILE_SIZE * 0.85 },
  panelInferior: { flex: 1, backgroundColor: '#0f172a', paddingHorizontal: 12, justifyContent: 'space-around', paddingVertical: 8 },
  seccionControles: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  controles: { alignItems: 'center', justifyContent: 'center' },
  filaHorizontalDPad: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  btnDPad: { width: 42, height: 42, backgroundColor: '#1e293b', borderColor: '#38bdf8', borderWidth: 1.5, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  flecha: { color: '#ffffff', fontSize: 16 },
  menuOpciones: { width: '52%', gap: 5 },
  btnAccion: { backgroundColor: '#1e293b', paddingVertical: 7, paddingHorizontal: 8, borderRadius: 6, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
  btnAccionText: { color: '#e2e8f0', fontWeight: 'bold', fontSize: 12 },
  filaGuardar: { flexDirection: 'row', gap: 5 },
  btnMini: { flex: 1, paddingVertical: 6, borderRadius: 6, alignItems: 'center' },
  btnMiniText: { color: '#ffffff', fontWeight: 'bold', fontSize: 11 },
  btnMenu: { backgroundColor: '#dc2626', paddingVertical: 8, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  btnMenuText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
});