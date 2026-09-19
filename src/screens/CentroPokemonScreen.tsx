import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Alert, Modal, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useGame } from '../context/GameContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CentroPokemon'>;

const TILE_SIZE = 40;
const FILAS = 10;
const COLUMNAS = 12;

const MAP_WIDTH = COLUMNAS * TILE_SIZE;
const MAP_HEIGHT = FILAS * TILE_SIZE;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const VIEWPORT_HEIGHT = SCREEN_HEIGHT * 0.52;

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

const MATRIZ_CENTRO = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const OBJETOS_TIENDA = [
  { id: 'pokeball', nombre: 'Pokébola', precio: 200, icono: require('../assets/icons/pokeball.png') },
  { id: 'potion', nombre: 'Poción', precio: 300, icono: require('../assets/icons/potion.png') },
  { id: 'superpotion', nombre: 'Superpoción', precio: 700, icono: require('../assets/icons/superpotion.png') },
  { id: 'greatball', nombre: 'Superbola', precio: 600, icono: require('../assets/icons/greatball.png') },
];

export default function CentroPokemonScreen({ navigation, route }: Props) {
  const { curarEquipoCompleto, dinero = 3000, setDinero, agregarObjeto, equipo = [] } = useGame() as any;
  const posicionInicial = route.params?.posicionAnterior || { fila: 8, col: 5 };
  const [posJugador, setPosJugador] = useState(posicionInicial);
  const [orientacion, setOrientacion] = useState<'ARRIBA' | 'ABAJO' | 'IZQUIERDA' | 'DERECHA'>('ARRIBA');
  const [framePaso, setFramePaso] = useState(0);
  
  const [modalOpcionesVisible, setModalOpcionesVisible] = useState(false);
  const [modalTiendaVisible, setModalTiendaVisible] = useState(false);

  const salirAlExterior = () => {
    navigation.replace('Ruta3', {
      posicionAnterior: { fila: 2, col: 32 },
    });
  };

  const mover = (dir: 'ARRIBA' | 'ABAJO' | 'IZQUIERDA' | 'DERECHA') => {
    setOrientacion(dir);
    setFramePaso((prev) => (prev + 1) % 4);

    let dFila = 0;
    let dCol = 0;

    if (dir === 'ARRIBA') dFila = -1;
    if (dir === 'ABAJO') dFila = 1;
    if (dir === 'IZQUIERDA') dCol = -1;
    if (dir === 'DERECHA') dCol = 1;

    const nuevaFila = posJugador.fila + dFila;
    const nuevaCol = posJugador.col + dCol;

    if (nuevaFila < 0 || nuevaFila >= FILAS || nuevaCol < 0 || nuevaCol >= COLUMNAS) return;

    const destino = MATRIZ_CENTRO[nuevaFila][nuevaCol];

    if (destino === 1) return;

    if (destino === 3) {
      salirAlExterior();
      return;
    }

    setPosJugador({ fila: nuevaFila, col: nuevaCol });
  };

  useEffect(() => {
    if (posJugador.fila === 4 && orientacion === 'ARRIBA') {
      setModalOpcionesVisible(true);
    }
  }, [posJugador, orientacion]);

  const handleCurar = () => {
    setModalOpcionesVisible(false);
    curarEquipoCompleto();
    Alert.alert(
      '🏥 Enfermera Joy',
      '¡Tus Pokémon han sido curados por completo en el Centro Pokémon!',
      [{ text: '¡Gracias!' }]
    );
  };

  const abrirTienda = () => {
    setModalOpcionesVisible(false);
    setModalTiendaVisible(true);
  };

  const comprarObjeto = (item: { id: string; nombre: string; precio: number }) => {
    if (dinero < item.precio) {
      Alert.alert('💰 Dinero Insuficiente', 'No tienes suficientes Pokedólares para comprar este objeto.');
      return;
    }

    if (setDinero) {
      setDinero((prevDinero: number) => prevDinero - item.precio);
    }

    if (agregarObjeto) {
      agregarObjeto(item.id, 1);
    }
  };

  const obtenerSpriteAsh = () => {
    switch (orientacion) {
      case 'ARRIBA': return ASH_ARRIBA[framePaso];
      case 'ABAJO': return ASH_ABAJO[framePaso];
      case 'IZQUIERDA': return ASH_IZQUIERDA[framePaso];
      case 'DERECHA': return ASH_DERECHA[framePaso];
      default: return ASH_ABAJO[0];
    }
  };

  const targetX = SCREEN_WIDTH / 2 - (posJugador.col * TILE_SIZE + TILE_SIZE / 2);
  const targetY = VIEWPORT_HEIGHT / 2 - (posJugador.fila * TILE_SIZE + TILE_SIZE / 2);

  const cameraX = Math.min(0, Math.max(SCREEN_WIDTH - MAP_WIDTH, targetX));
  const cameraY = Math.min(0, Math.max(VIEWPORT_HEIGHT - MAP_HEIGHT, targetY));

  return (
    <View style={styles.container}>
      <View style={[styles.viewport, { height: VIEWPORT_HEIGHT }]}>
        <View
          style={[
            styles.mapaContainer,
            {
              width: MAP_WIDTH,
              height: MAP_HEIGHT,
              transform: [
                { translateX: cameraX },
                { translateY: cameraY },
              ],
            },
          ]}
        >
          <Image
            source={require('../assets/backgrounds/Centro_Pokemon.png')}
            style={[styles.bgImage, { width: MAP_WIDTH, height: MAP_HEIGHT }]}
            resizeMode="stretch"
          />

          <View
            style={[
              styles.npcContainer,
              {
                top: 2 * TILE_SIZE,
                left: 5 * TILE_SIZE,
              },
            ]}
          >
            <Image
              source={require('../assets/NPC/NPC1.png')}
              style={styles.spriteNpc}
              resizeMode="contain"
            />
          </View>

          <View
            style={[
              styles.jugador,
              {
                top: posJugador.fila * TILE_SIZE,
                left: posJugador.col * TILE_SIZE,
              },
            ]}
          >
            <Image
              source={obtenerSpriteAsh()}
              style={styles.spriteAsh}
              resizeMode="contain"
            />
          </View>
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

        <TouchableOpacity style={styles.btnSalirExterior} onPress={salirAlExterior}>
          <Text style={styles.btnSalirExteriorText}>🚪 Salir al Exterior</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalOpcionesVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalOpcionesVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>👩‍⚕️ Enfermera Joy</Text>
            <Text style={styles.modalText}>¡Bienvenido al Centro Pokémon! ¿En qué podemos ayudarte?</Text>
            
            <TouchableOpacity style={styles.modalBtn} onPress={handleCurar}>
              <Text style={styles.modalBtnText}>Curar equipo Pokémon</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalBtn} onPress={abrirTienda}>
              <Text style={styles.modalBtnText}>Comprar objetos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalBtn, styles.modalBtnCancelar]} 
              onPress={() => setModalOpcionesVisible(false)}
            >
              <Text style={styles.modalBtnTextCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalTiendaVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalTiendaVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: '90%', height: '70%' }]}>
            <Text style={styles.modalTitle}>🛒 Tienda Pokémon</Text>
            <Text style={styles.dineroText}>💰 Dinero: ${dinero}</Text>

            <FlatList
              data={OBJETOS_TIENDA}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.storeItemRow}>
                  <Image source={item.icono} style={styles.storeIcon} resizeMode="contain" />
                  <View style={styles.storeInfo}>
                    <Text style={styles.storeName}>{item.nombre}</Text>
                    <Text style={styles.storePrice}>${item.precio}</Text>
                  </View>
                  <TouchableOpacity style={styles.buyButton} onPress={() => comprarObjeto(item)}>
                    <Text style={styles.buyButtonText}>Comprar</Text>
                  </TouchableOpacity>
                </View>
              )}
              style={{ width: '100%', marginVertical: 10 }}
            />

            <TouchableOpacity 
              style={[styles.modalBtn, styles.modalBtnCancelar, { marginTop: 10 }]} 
              onPress={() => setModalTiendaVisible(false)}
            >
              <Text style={styles.modalBtnTextCancelar}>Cerrar Tienda</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  viewport: { width: SCREEN_WIDTH, backgroundColor: '#000000', overflow: 'hidden', borderBottomWidth: 3, borderBottomColor: '#38bdf8' },
  mapaContainer: { position: 'absolute' },
  bgImage: { position: 'absolute', top: 0, left: 0 },
  jugador: { position: 'absolute', width: TILE_SIZE, height: TILE_SIZE, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  spriteAsh: { width: TILE_SIZE * 0.9, height: TILE_SIZE * 0.9 },
  npcContainer: { position: 'absolute', width: TILE_SIZE, height: TILE_SIZE, justifyContent: 'center', alignItems: 'center', zIndex: 5 },
  spriteNpc: { width: TILE_SIZE * 0.85, height: TILE_SIZE * 0.85 },
  panelInferior: { flex: 1, backgroundColor: '#0f172a', paddingHorizontal: 10, justifyContent: 'space-around', paddingVertical: 4 },
  seccionControles: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  controles: { alignItems: 'center', justifyContent: 'center' },
  filaHorizontalDPad: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  btnDPad: { width: 38, height: 38, backgroundColor: '#1e293b', borderColor: '#38bdf8', borderWidth: 1.5, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  flecha: { color: '#ffffff', fontSize: 14 },
  menuOpciones: { width: '56%', gap: 3 },
  btnAccion: { backgroundColor: '#1e293b', paddingVertical: 4, paddingHorizontal: 6, borderRadius: 6, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
  btnAccionText: { color: '#e2e8f0', fontWeight: 'bold', fontSize: 11 },
  filaGuardar: { flexDirection: 'row', gap: 4 },
  btnMini: { flex: 1, paddingVertical: 4, borderRadius: 6, alignItems: 'center' },
  btnMiniText: { color: '#ffffff', fontWeight: 'bold', fontSize: 10 },
  btnSalirExterior: { backgroundColor: '#dc2626', paddingVertical: 6, borderRadius: 8, alignItems: 'center', marginTop: 2 },
  btnSalirExteriorText: { color: '#ffffff', fontWeight: 'bold', fontSize: 11 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#16213e', padding: 20, borderRadius: 12, borderWidth: 2, borderColor: '#0f3460', alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  modalText: { fontSize: 14, color: '#ccc', textAlign: 'center', marginBottom: 20 },
  modalBtn: { width: '100%', backgroundColor: '#0f3460', padding: 12, borderRadius: 8, alignItems: 'center', marginVertical: 5 },
  modalBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  modalBtnCancelar: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#e94560' },
  modalBtnTextCancelar: { color: '#e94560', fontWeight: 'bold', fontSize: 15 },
  dineroText: { fontSize: 16, color: '#4ecca3', fontWeight: 'bold', marginBottom: 10 },
  storeItemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f3460', padding: 10, borderRadius: 8, marginVertical: 5, width: '100%' },
  storeIcon: { width: 30, height: 30, marginRight: 10 },
  storeInfo: { flex: 1 },
  storeName: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  storePrice: { color: '#ffd369', fontSize: 12 },
  buyButton: { backgroundColor: '#e94560', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  buyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});