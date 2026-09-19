import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useGame } from '../context/GameContext';
import { obtenerCriaturaAleatoria } from '../utils/pokemonDatabase';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Mapa'>;
};

// Importación de Sprites por dirección y animación
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

type Direccion = 'ARRIBA' | 'ABAJO' | 'IZQUIERDA' | 'DERECHA';

const TAMANO_GRID = 8;
const { width } = Dimensions.get('window');
const TAMANO_CELDA = Math.floor((width - 40) / TAMANO_GRID);

const CAMINO = 0;
const PARED = 1;
const HIERBA = 2;
const NPC_ENTRENADOR = 3;

const MAPA_INICIAL = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 2, 2, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 3, 0, 1, 0, 1],
  [1, 2, 2, 0, 0, 0, 0, 1],
  [1, 2, 2, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];

export default function MapaRPGScreen({ navigation }: Props) {
  const { setEnemigoActual } = useGame();
  const [jugadorPos, setJugadorPos] = useState({ f: 1, c: 1 });
  const [direccion, setDireccion] = useState<Direccion>('ABAJO');
  const [framePaso, setFramePaso] = useState(0);
  const [dialogo, setDialogo] = useState<string | null>(
    'Usa el D-Pad para moverte por el mapa.'
  );

  const mover = (df: number, dc: number, dir: Direccion) => {
    // Actualizar orientación y ciclo de animación
    setDireccion(dir);
    setFramePaso((prev) => (prev + 1) % 4);

    const nuevaF = jugadorPos.f + df;
    const nuevaC = jugadorPos.c + dc;

    if (
      nuevaF < 0 ||
      nuevaF >= TAMANO_GRID ||
      nuevaC < 0 ||
      nuevaC >= TAMANO_GRID
    )
      return;

    const tipoCelda = MAPA_INICIAL[nuevaF][nuevaC];

    if (tipoCelda === PARED) {
      setDialogo('Hay un obstáculo en el camino.');
      return;
    }

    setJugadorPos({ f: nuevaF, c: nuevaC });

    if (tipoCelda === NPC_ENTRENADOR) {
      setDialogo('¡Entrenador Rojo: "Te estaba esperando!"');
      setTimeout(() => {
        const pokemonNpc = obtenerCriaturaAleatoria(8);
        setEnemigoActual(pokemonNpc);
        Alert.alert(
          '¡Desafío NPC!',
          `El Entrenador te reta con ${pokemonNpc.nombre} (Niv. ${pokemonNpc.nivel}).`,
          [
            {
              text: '¡Pelear!',
              onPress: () => {
                navigation.navigate('Batalla');
              },
            },
          ]
        );
      }, 500);
      return;
    }

    if (tipoCelda === HIERBA) {
      setDialogo('Caminando por hierba alta...');
      if (Math.random() < 0.4) {
        const salvaje = obtenerCriaturaAleatoria(Math.floor(Math.random() * 3) + 3);
        setEnemigoActual(salvaje);
        Alert.alert(
          '¡Pokémon Salvaje!',
          `¡Un ${salvaje.nombre} emergió de la hierba!`,
          [
            {
              text: '¡Entrar a Batalla!',
              onPress: () => navigation.navigate('Batalla'),
            },
          ]
        );
      }
    } else {
      setDialogo('Explorando el mapa...');
    }
  };

  // Función para devolver el sprite exacto según la orientación y el frame actual
  const obtenerSpriteJugador = () => {
    switch (direccion) {
      case 'ARRIBA':
        return ASH_ARRIBA[framePaso];
      case 'ABAJO':
        return ASH_ABAJO[framePaso];
      case 'IZQUIERDA':
        return ASH_IZQUIERDA[framePaso];
      case 'DERECHA':
        return ASH_DERECHA[framePaso];
      default:
        return ASH_ABAJO[0];
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ruta Táctica 1</Text>
      <View style={styles.dialogoBox}>
        <Text style={styles.dialogoTexto}>{dialogo}</Text>
      </View>

      <View style={styles.gridContainer}>
        {MAPA_INICIAL.map((fila, fIndex) => (
          <View key={fIndex} style={styles.fila}>
            {fila.map((celda, cIndex) => {
              const esJugador =
                jugadorPos.f === fIndex && jugadorPos.c === cIndex;

              let colorCelda = '#16213e';
              if (celda === PARED) colorCelda = '#0f3460';
              if (celda === HIERBA) colorCelda = '#15803d';
              if (celda === NPC_ENTRENADOR) colorCelda = '#b91c1c';

              return (
                <View
                  key={cIndex}
                  style={[styles.celda, { backgroundColor: colorCelda }]}
                >
                  {esJugador && (
                    <Image
                      source={obtenerSpriteJugador()}
                      style={styles.jugadorSpriteImage}
                      resizeMode="contain"
                    />
                  )}
                  {!esJugador && celda === NPC_ENTRENADOR && (
                    <Text style={{ fontSize: 10, color: '#fff' }}>NPC</Text>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {/* D-Pad pasándole la dirección correcta a cada botón */}
      <View style={styles.dpadContainer}>
        <TouchableOpacity
          style={styles.dpadBtn}
          onPress={() => mover(-1, 0, 'ARRIBA')}
        >
          <Text style={styles.dpadText}>▲</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <TouchableOpacity
            style={styles.dpadBtn}
            onPress={() => mover(0, -1, 'IZQUIERDA')}
          >
            <Text style={styles.dpadText}>◀</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dpadBtn}
            onPress={() => mover(0, 1, 'DERECHA')}
          >
            <Text style={styles.dpadText}>▶</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.dpadBtn}
          onPress={() => mover(1, 0, 'ABAJO')}
        >
          <Text style={styles.dpadText}>▼</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.volverBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          Pausar / Menú
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: 40,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  dialogoBox: {
    width: '90%',
    height: 60,
    backgroundColor: '#f5f5dc',
    borderRadius: 8,
    padding: 10,
    borderWidth: 3,
    borderColor: '#333',
    marginBottom: 16,
    justifyContent: 'center',
  },
  dialogoTexto: { color: '#111', fontWeight: '600', fontSize: 13 },
  gridContainer: {
    borderWidth: 3,
    borderColor: '#e94560',
    borderRadius: 8,
    overflow: 'hidden',
  },
  fila: { flexDirection: 'row' },
  celda: {
    width: TAMANO_CELDA,
    height: TAMANO_CELDA,
    borderWidth: 0.5,
    borderColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jugadorSpriteImage: {
    width: TAMANO_CELDA * 0.8,
    height: TAMANO_CELDA * 0.8,
  },
  dpadContainer: { marginTop: 20, alignItems: 'center' },
  dpadBtn: {
    width: 50,
    height: 50,
    backgroundColor: '#0f3460',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderWidth: 1,
    borderColor: '#e94560',
  },
  dpadText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  volverBtn: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#555',
    borderRadius: 8,
  },
});