import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Modal, Alert, ScrollView, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useGame } from '../context/GameContext';
import { crearPokemonPorId } from '../data/criaturas';
import { Item } from '../models/Item';

type Props = NativeStackScreenProps<RootStackParamList, 'Batalla'>;

export default function BatallaScreen({ navigation, route }: Props) {
  const { equipo, actualizarHpCriatura, agregarAlEquipo, otorgarRecompensaBatalla, inventario, setDinero } = useGame();
  const [indiceActivo, setIndiceActivo] = useState<number>(0);
  const criaturaActiva = equipo.length > 0 ? equipo[indiceActivo] || equipo[0] : null;

  const defaultPlayer = {
    id: 4,
    nombre: 'Charmander',
    front: require('../assets/sprites/charmander_front.png'),
    back: require('../assets/sprites/charmander_back.png'),
    hpMax: 39,
    hpActual: 39,
    tipo1: 'Fuego',
  };

  const basePlayerSource: any = criaturaActiva || route.params?.playerPokemon || defaultPlayer;

  const playerPokemon = {
    id: basePlayerSource.id,
    nombre: basePlayerSource.nombre,
    front: basePlayerSource.spriteBack || basePlayerSource.back,
    back: basePlayerSource.spriteFront || basePlayerSource.front,
    hpMax: basePlayerSource.hpMaximo || basePlayerSource.hpMax || 35,
    hpActual: basePlayerSource.hpActual !== undefined ? basePlayerSource.hpActual : (basePlayerSource.hpMaximo || basePlayerSource.hpMax || 35),
  };

  const defaultEnemy = {
    id: 104,
    nombre: 'Cubone',
    front: require('../assets/sprites/cubone_front.png'),
    hpMax: 50,
    nivel: 5,
    tipo1: 'Tierra',
  };

  const enemyPokemon = route.params?.enemyPokemon || defaultEnemy;
  const esEntrenador = route.params?.esEntrenador ?? false;
  const rutaOrigen = route.params?.rutaOrigen;
  const posicionAnterior = route.params?.posicionAnterior;

  const [playerHp, setPlayerHp] = useState<number>((playerPokemon as any).hpActual ?? playerPokemon.hpMax);
  const [playerMaxHp, setPlayerMaxHp] = useState<number>(playerPokemon.hpMax);
  const [enemyHp, setEnemyHp] = useState<number>(enemyPokemon.hpMax);
  const [playerNivel, setPlayerNivel] = useState<number>(criaturaActiva?.nivel || 5);

  const [message, setMessage] = useState<string>(
    esEntrenador ? `¡El Entrenador envió a ${enemyPokemon.nombre}!` : `¡Un ${enemyPokemon.nombre} salvaje apareció!`
  );

  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [mostrarAtaques, setMostrarAtaques] = useState<boolean>(false);
  const [mostrarMochila, setMostrarMochila] = useState<boolean>(false);
  const [mostrarCambio, setMostrarCambio] = useState<boolean>(false);

  // Estados de inventario sincronizados con la clase global
  const [listaItems, setListaItems] = useState<Item[]>(inventario.obtenerItems());

  const [batallaGanada, setBatallaGanada] = useState<boolean>(false);
  const [resumenExpTexto, setResumenExpTexto] = useState<string>('');
  const [animExp] = useState(new Animated.Value(0));
  const [porcentajeVisual, setPorcentajeVisual] = useState<number>(0);

  const movimientosJugador = [
    { nombre: 'Placaje', danio: 12 },
    { nombre: 'Ataque Rápido', danio: 15 },
    { nombre: 'Arañazo', danio: 14 },
    { nombre: 'Ataque Especial', danio: 20 },
  ];

  const movimientosEnemigo = esEntrenador
    ? [
        { nombre: 'Hiperrayo', danio: 25 },
        { nombre: 'Llamarada', danio: 22 },
        { nombre: 'Psíquico Fuerte', danio: 20 },
      ]
    : [
        { nombre: 'Hueso Palo', danio: 10 },
        { nombre: 'Cabezazo', danio: 8 },
        { nombre: 'Látigo', danio: 6 },
      ];

  const handleExit = () => {
    if (criaturaActiva) {
      actualizarHpCriatura(playerPokemon.id, playerHp);
    }
    const nav = navigation as any;
    if (rutaOrigen === 'Ruta2') {
      nav.navigate('Ruta2', { posicionAnterior });
    } else if (rutaOrigen === 'Ruta3') {
      nav.navigate('Ruta3', { posicionAnterior });
    } else if (rutaOrigen === 'Ruta1' || rutaOrigen === 'Mapa') {
      nav.navigate('Mapa', { posicionAnterior });
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      nav.navigate('Mapa', { posicionAnterior });
    }
  };

  const handleRun = () => {
    if (!isPlayerTurn) return;
    setMostrarAtaques(false);
    setMessage('¡Escapaste sin problemas!');
    setTimeout(handleExit, 1000);
  };

  const ejecutarTurnoEnemigo = (currentEnemyHp: number) => {
    if (currentEnemyHp <= 0) return;

    setIsPlayerTurn(false);
    setTimeout(() => {
      const ataqueElegido = movimientosEnemigo[Math.floor(Math.random() * movimientosEnemigo.length)];

      setPlayerHp((prevHp: number) => {
        const newPlayerHp = Math.max(0, prevHp - ataqueElegido.danio);
        setMessage(`¡${enemyPokemon.nombre} usó ${ataqueElegido.nombre} e hizo ${ataqueElegido.danio} de daño!`);

        if (newPlayerHp === 0) {
          setTimeout(() => {
            const hayOtroVivo = equipo.some((c, idx) => idx !== indiceActivo && c.hpActual > 0);
            if (hayOtroVivo) {
              setMessage(`¡${playerPokemon.nombre} se debilitó! Elige a otro Pokémon.`);
              setMostrarCambio(true);
              setIsPlayerTurn(true);
            } else {
              setMessage(`¡Todos tus Pokémon se debilitaron! Perdiste la batalla...`);
              setTimeout(handleExit, 2000);
            }
          }, 1200);
        } else {
          setTimeout(() => {
            setIsPlayerTurn(true);
            setMessage(`¿Qué debería hacer ${playerPokemon.nombre}?`);
          }, 1200);
        }
        return newPlayerHp;
      });
    }, 1200);
  };

  const manejarVictoria = () => {
    const itemObtenido = otorgarRecompensaBatalla();
    const nivelEnemigo = (enemyPokemon as any).nivel || 5;
    const expGanada = nivelEnemigo * 20;

    // Cálculo de dinero obtenido según el nivel del enemigo (y extra si es entrenador)
    const dineroGanado = nivelEnemigo * 30 * (esEntrenador ? 2 : 1);
    setDinero((prevDinero) => prevDinero + dineroGanado);

    setMessage(`¡El ${enemyPokemon.nombre} enemigo se debilitó!\nGanaste ${expGanada} EXP, ${itemObtenido} y 💰${dineroGanado} PokéDólares.`);

    if (criaturaActiva) {
      const expAntes = criaturaActiva.experiencia;
      const nivelAntes = criaturaActiva.nivel;
      const expMaxAntes = nivelAntes * 50;
      const porcentajeInicial = Math.min(100, (expAntes / expMaxAntes) * 100);

      const resultadoExp = criaturaActiva.ganarExperiencia(expGanada);

      setBatallaGanada(true);
      animExp.setValue(porcentajeInicial);
      setPorcentajeVisual(Math.round(porcentajeInicial));

      setTimeout(() => {
        if (resultadoExp.subioDeNivel) {
          Animated.timing(animExp, {
            toValue: 100,
            duration: 1000,
            useNativeDriver: false,
          }).start(() => {
            setPorcentajeVisual(100);
            setResumenExpTexto(`🔥 ¡${playerPokemon.nombre} subió al Nv. ${resultadoExp.nuevoNivel}!`);
            setPlayerNivel(resultadoExp.nuevoNivel);
            setPlayerMaxHp(resultadoExp.hpMaximo);
            setPlayerHp(resultadoExp.hpActual);

            actualizarHpCriatura(playerPokemon.id, resultadoExp.hpActual);
            setTimeout(() => { handleExit(); }, 3500);
          });
        } else {
          const porcentajeFinal = Math.min(100, (criaturaActiva.experiencia / (criaturaActiva.nivel * 50)) * 100);

          Animated.timing(animExp, {
            toValue: porcentajeFinal,
            duration: 1200,
            useNativeDriver: false,
          }).start(() => {
            setPorcentajeVisual(Math.round(porcentajeFinal));
            setResumenExpTexto(`✨ +${expGanada} EXP ganados (${criaturaActiva.experiencia}/${criaturaActiva.nivel * 50} EXP)`);

            actualizarHpCriatura(playerPokemon.id, playerHp);
            setTimeout(() => { handleExit(); }, 3500);
          });
        }
      }, 1000);
    } else {
      setTimeout(handleExit, 3000);
    }
  };

  const ejecutarAtaque = (movimiento: any) => {
    if (!isPlayerTurn) return;

    setMostrarAtaques(false);
    setIsPlayerTurn(false);

    const newEnemyHp = Math.max(0, enemyHp - movimiento.danio);
    setEnemyHp(newEnemyHp);
    setMessage(`¡${playerPokemon.nombre} usó ${movimiento.nombre} e hizo ${movimiento.danio} de daño!`);

    if (newEnemyHp === 0) {
      setTimeout(() => { manejarVictoria(); }, 1200);
    } else {
      ejecutarTurnoEnemigo(newEnemyHp);
    }
  };

  const usarItemCombate = (item: Item) => {
    if (item.cantidad <= 0) {
      Alert.alert('Mochila', `¡No te quedan ${item.nombre}s!`);
      return;
    }

    const esPokebola = item.id.includes('bola') || item.tipo?.toLowerCase().includes('captura');

    if (!esPokebola) {
      if (playerHp >= playerMaxHp) {
        Alert.alert('Mochila', '¡Tu Pokémon ya tiene la salud al máximo!');
        return;
      }

      let curacionValor = item.poder > 0 ? item.poder : 20;
      const nuevaVida = Math.min(playerMaxHp, playerHp + curacionValor);
      
      setPlayerHp(nuevaVida);
      inventario.usarItem(item.id);
      setListaItems([...inventario.obtenerItems()]);
      setMostrarMochila(false);
      setMessage(`¡Usaste ${item.nombre}! ${playerPokemon.nombre} recuperó HP.`);
      ejecutarTurnoEnemigo(enemyHp);
    } else {
      if (esEntrenador) {
        Alert.alert('Acción no permitida', '¡No puedes robar el Pokémon de otro entrenador!');
        return;
      }

      inventario.usarItem(item.id);
      setListaItems([...inventario.obtenerItems()]);
      setMostrarMochila(false);
      setIsPlayerTurn(false);
      setMessage(`¡Lanzaste una ${item.nombre}!`);

      setTimeout(() => {
        let ratioMod = item.poder > 0 ? item.poder : 1;
        const probabilidad = ((1 - enemyHp / enemyPokemon.hpMax) * 100) * ratioMod;
        const exito = Math.random() * 100 <= Math.max(probabilidad, 30);

        if (exito) {
          const nuevaCriaturaCapturada = crearPokemonPorId(
            enemyPokemon.id,
            enemyPokemon.nombre,
            (enemyPokemon as any).tipo1 || 'Normal',
            5
          );
          agregarAlEquipo(nuevaCriaturaCapturada);

          const itemObtenido = otorgarRecompensaBatalla();
          setMessage(`¡Atrapado! ¡${enemyPokemon.nombre} se unió a tu equipo!\nObtuviste: ${itemObtenido}`);
          setTimeout(handleExit, 2200);
        } else {
          setMessage(`¡El ${enemyPokemon.nombre} se escapó de la Pokébola!`);
          ejecutarTurnoEnemigo(enemyHp);
        }
      }, 1500);
    }
  };

  const seleccionarNuevoPokemon = (index: number) => {
    const pokeSeleccionado = equipo[index];
    if (pokeSeleccionado.hpActual <= 0) {
      Alert.alert('Aviso', '¡Ese Pokémon está debilitado y no puede combatir!');
      return;
    }

    if (criaturaActiva) {
      actualizarHpCriatura(criaturaActiva.id, playerHp);
    }

    setIndiceActivo(index);
    setPlayerHp(pokeSeleccionado.hpActual);
    setPlayerMaxHp(pokeSeleccionado.hpMaximo);
    setPlayerNivel(pokeSeleccionado.nivel);
    setMostrarCambio(false);
    setMessage(`¡Adelante, ${pokeSeleccionado.nombre}!`);
    setIsPlayerTurn(true);
  };

  const anchoBarraAnimada = animExp.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <ImageBackground
      source={require('../assets/backgrounds/batalla_bosque.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* SECCIÓN ENEMIGA */}
        <View style={styles.enemySection}>
          <View style={styles.statusBox}>
            <Text style={styles.pokemonName}>
              {enemyPokemon.nombre} {esEntrenador ? '(Nv. 50)' : `(Nv. ${(enemyPokemon as any).nivel || 5})`}
            </Text>
            <View style={styles.hpBarBackground}>
              <View
                style={[
                  styles.hpBarFill,
                  { width: `${Math.max(0, Math.min(100, (enemyHp / enemyPokemon.hpMax) * 100))}%` },
                ]}
              />
            </View>
            <Text style={styles.hpText}>
              {enemyHp} / {enemyPokemon.hpMax} HP
            </Text>
          </View>
          <Image source={enemyPokemon.front} style={styles.enemySprite} resizeMode="contain" />
        </View>

        {/* SECCIÓN JUGADOR */}
        <View style={styles.playerSection}>
          <Image source={playerPokemon.back} style={styles.playerSprite} resizeMode="contain" />

          <View style={styles.statusBox}>
            <Text style={styles.pokemonName}>
              {playerPokemon.nombre} (Nv. {playerNivel})
            </Text>
            <View style={styles.hpBarBackground}>
              <View
                style={[
                  styles.hpBarFill,
                  { width: `${Math.max(0, Math.min(100, (playerHp / playerMaxHp) * 100))}%` },
                ]}
              />
            </View>
            <Text style={styles.hpText}>
              {playerHp} / {playerMaxHp} HP
            </Text>

            {batallaGanada && (
              <View style={styles.expWrapper}>
                <View style={styles.expContainer}>
                  <Text style={styles.expLabelText}>EXP</Text>
                  <View style={styles.expBarBackground}>
                    <Animated.View style={[styles.expBarFill, { width: anchoBarraAnimada }]} />
                  </View>
                </View>
                <Text style={styles.expPercentageText}>
                  {porcentajeVisual}% {resumenExpTexto ? `- ${resumenExpTexto}` : ''}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ÁREA DE CONTROLES Y MENSAJES */}
        <View style={styles.bottomArea}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogText}>{message}</Text>
          </View>

          {mostrarAtaques ? (
            <View style={styles.attackGrid}>
              {movimientosJugador.map((mov, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.attackButton, !isPlayerTurn && styles.disabledButton]}
                  disabled={!isPlayerTurn}
                  onPress={() => ejecutarAtaque(mov)}
                >
                  <Text style={styles.attackButtonText}>{mov.nombre}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.cancelButton} onPress={() => setMostrarAtaques(false)}>
                <Text style={styles.cancelButtonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.controlsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.fightButton, (!isPlayerTurn || enemyHp <= 0) && styles.disabledButton]}
                disabled={!isPlayerTurn || enemyHp <= 0}
                onPress={() => setMostrarAtaques(true)}
              >
                <Text style={styles.buttonText}>Luchar</Text>
              </TouchableOpacity>

              {equipo.length > 1 && (
                <TouchableOpacity
                  style={[styles.button, styles.switchButton, enemyHp <= 0 && styles.disabledButton]}
                  disabled={enemyHp <= 0}
                  onPress={() => setMostrarCambio(true)}
                >
                  <Text style={styles.buttonText}>Equipo</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.button, styles.bagButton, (!isPlayerTurn || enemyHp <= 0) && styles.disabledButton]}
                disabled={!isPlayerTurn || enemyHp <= 0}
                onPress={() => {
                  setListaItems(inventario.obtenerItems());
                  setMostrarMochila(true);
                }}
              >
                <Text style={styles.buttonText}>Mochila</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.runButton, (!isPlayerTurn || enemyHp <= 0) && styles.disabledButton]}
                disabled={!isPlayerTurn || enemyHp <= 0}
                onPress={handleRun}
              >
                <Text style={styles.buttonText}>Huir</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* MODAL DE MOCHILA */}
        <Modal visible={mostrarMochila} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>🎒 Mochila de Combate</Text>
              <ScrollView style={styles.itemList}>
                {listaItems.filter(i => i.cantidad > 0).map((item) => (
                  <TouchableOpacity key={item.id} style={styles.itemRow} onPress={() => usarItemCombate(item)}>
                    <View style={styles.itemLeft}>
                      {item.icono && <Image source={item.icono} style={styles.itemIcon} resizeMode="contain" />}
                      <Text style={styles.itemText}>{item.nombre}</Text>
                    </View>
                    <Text style={styles.itemCount}>x{item.cantidad}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.closeModalButton} onPress={() => setMostrarMochila(false)}>
                <Text style={styles.closeModalText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* MODAL PARA CAMBIAR DE POKÉMON EN BATALLA */}
        <Modal visible={mostrarCambio} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>🔄 Selecciona un Pokémon</Text>
              <ScrollView style={styles.itemList}>
                {equipo.map((poke, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.itemRow, index === indiceActivo && { backgroundColor: '#f0f0f0' }]}
                    onPress={() => seleccionarNuevoPokemon(index)}
                  >
                    <View style={styles.itemLeft}>
                      <Image source={poke.spriteFront || poke.icono} style={styles.itemIcon} resizeMode="contain" />
                      <View>
                        <Text style={styles.itemText}>
                          {poke.nombre} {index === indiceActivo ? '(Activo)' : ''}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#666' }}>
                          HP: {poke.hpActual} / {poke.hpMaximo} | Nv. {poke.nivel}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.closeModalButton} onPress={() => setMostrarCambio(false)}>
                <Text style={styles.closeModalText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.25)', justifyContent: 'space-between', paddingVertical: 20, paddingHorizontal: 15 },
  enemySection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  playerSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBox: { backgroundColor: 'rgba(29, 39, 58, 0.9)', padding: 10, borderRadius: 8, width: '55%', borderWidth: 1, borderColor: '#3a4b6e' },
  pokemonName: { color: '#ffffff', fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  hpBarBackground: { height: 8, backgroundColor: '#444', borderRadius: 4, overflow: 'hidden' },
  hpBarFill: { height: '100%', backgroundColor: '#4caf50' },
  hpText: { color: '#cccccc', fontSize: 11, textAlign: 'right', marginTop: 2, marginBottom: 4 },
  expWrapper: { marginTop: 4, borderTopWidth: 1, borderTopColor: '#3a4b6e', paddingTop: 4 },
  expContainer: { flexDirection: 'row', alignItems: 'center' },
  expLabelText: { color: '#ffeb3b', fontSize: 9, fontWeight: 'bold', marginRight: 5 },
  expBarBackground: { flex: 1, height: 5, backgroundColor: '#444', borderRadius: 3, overflow: 'hidden' },
  expBarFill: { height: '100%', backgroundColor: '#ffeb3b' },
  expPercentageText: { color: '#ffeb3b', fontSize: 8, textAlign: 'right', marginTop: 2 },
  enemySprite: { width: 110, height: 110 },
  playerSprite: { width: 130, height: 130 },
  bottomArea: { width: '100%' },
  dialogBox: { backgroundColor: '#f5f5dc', padding: 12, borderRadius: 8, borderWidth: 2, borderColor: '#333', minHeight: 65, justifyContent: 'center', marginBottom: 10 },
  dialogText: { color: '#000', fontSize: 14, fontWeight: '600' },
  controlsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: 50 },
  button: { width: '23.5%', height: '100%', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  fightButton: { backgroundColor: '#d9534f' },
  switchButton: { backgroundColor: '#9c27b0' },
  bagButton: { backgroundColor: '#f0ad4e' },
  runButton: { backgroundColor: '#0275d8' },
  disabledButton: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  attackGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
  attackButton: { backgroundColor: '#ffffff', width: '48%', paddingVertical: 12, paddingHorizontal: 4, borderRadius: 8, marginBottom: 6, borderWidth: 2, borderColor: '#333', alignItems: 'center', justifyContent: 'center' },
  attackButtonText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  cancelButton: { backgroundColor: '#6c757d', width: '100%', paddingVertical: 8, borderRadius: 8, alignContent: 'center', alignItems: 'center', marginTop: 2 },
  cancelButtonText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: '#fff', width: '85%', maxHeight: '60%', padding: 20, borderRadius: 12, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  itemList: { width: '100%' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemIcon: { width: 32, height: 32, marginRight: 10 },
  itemText: { fontSize: 16, fontWeight: '500' },
  itemCount: { fontSize: 16, fontWeight: 'bold', color: '#555' },
  closeModalButton: { marginTop: 15, backgroundColor: '#d9534f', padding: 12, borderRadius: 8, alignItems: 'center' },
  closeModalText: { color: '#fff', fontWeight: 'bold' },
});