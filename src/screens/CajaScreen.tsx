import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useGame } from '../context/GameContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Caja'>;

export default function CajaScreen({ navigation }: Props) {
  const { equipo, caja, intercambiarConCaja } = useGame();
  const [pokemonSeleccionadoCaja, setPokemonSeleccionadoCaja] = useState<number | null>(null);

  const handleSeleccionarCaja = (indexCaja: number) => {
    setPokemonSeleccionadoCaja(indexCaja);
  };

  const handleElegirEquipoParaCambiar = (indexEquipo: number) => {
    if (pokemonSeleccionadoCaja === null) {
      Alert.alert('Atención', 'Primero selecciona un Pokémon de la Caja de PC que quieras ingresar a tu equipo.');
      return;
    }

    const pokeCaja = caja[pokemonSeleccionadoCaja];
    const pokeEquipo = equipo[indexEquipo];

    Alert.alert(
      'Intercambio de PC',
      `¿Deseas cambiar a ${pokeEquipo.nombre} de tu equipo por ${pokeCaja.nombre} de la caja?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, intercambiar',
          onPress: () => {
            intercambiarConCaja(indexEquipo, pokemonSeleccionadoCaja);
            setPokemonSeleccionadoCaja(null);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🖥️ Caja de PC (Reserva)</Text>
      <Text style={styles.subtitulo}>
        {pokemonSeleccionadoCaja !== null 
          ? 'Paso 2: Ahora selecciona a qué Pokémon de tu Equipo deseas reemplazar.' 
          : 'Paso 1: Selecciona un Pokémon de la caja de abajo.'}
      </Text>

      {/* SECCIÓN 1: CAJA DE RESERVA */}
      <Text style={styles.seccionTitulo}>Pokémon en la Caja ({caja.length})</Text>
      <ScrollView style={styles.scrollCaja} horizontal={false}>
        {caja.length === 0 ? (
          <Text style={styles.vacio}>La caja de reserva está vacía. ¡Captura más de 6 Pokémon para llenarla!</Text>
        ) : (
          <View style={styles.gridContainer}>
            {caja.map((poke, index) => {
              const seleccionado = pokemonSeleccionadoCaja === index;
              const sprite = poke.id 
                ? { uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${poke.id}.gif` } 
                : (poke.icono || poke.spriteFront);

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.cardCaja, seleccionado && styles.cardSeleccionada]}
                  onPress={() => handleSeleccionarCaja(index)}
                >
                  <Image source={sprite} style={styles.sprite} resizeMode="contain" />
                  <Text style={styles.nombre} numberOfLines={1}>{poke.nombre}</Text>
                  <Text style={styles.nivel}>Nv. {poke.nivel || 1}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* SECCIÓN 2: EQUIPO ACTUAL PARA INTERCAMBIO */}
      <Text style={styles.seccionTitulo}>Tu Equipo Actual (Toca uno para intercambiar)</Text>
      <ScrollView style={styles.scrollEquipo}>
        {equipo.map((poke, index) => {
          const sprite = poke.id 
            ? { uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${poke.id}.gif` } 
            : (poke.icono || poke.spriteFront);

          return (
            <TouchableOpacity
              key={index}
              style={[styles.cardEquipo, pokemonSeleccionadoCaja !== null && styles.cardEquipoActiva]}
              onPress={() => handleElegirEquipoParaCambiar(index)}
            >
              <Image source={sprite} style={styles.spriteEquipo} resizeMode="contain" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.nombreEquipo}>{poke.nombre} - Nv. {poke.nivel || 1}</Text>
                <Text style={styles.tipoText}>Tipo: {poke.tipo1} | HP: {poke.hpActual}/{poke.hpMaximo}</Text>
              </View>
              {pokemonSeleccionadoCaja !== null && (
                <View style={styles.badgeCambiar}>
                  <Text style={styles.badgeText}>Cambiar</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.volver} onPress={() => navigation.goBack()}>
        <Text style={styles.btnT}>← Volver al Equipo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', paddingTop: 40, paddingHorizontal: 16 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 4 },
  subtitulo: { fontSize: 12, color: '#ffeb3b', textAlign: 'center', marginBottom: 12 },
  seccionTitulo: { fontSize: 14, fontWeight: 'bold', color: '#e94560', marginBottom: 8, marginTop: 6 },
  vacio: { color: '#aaa', textAlign: 'center', marginVertical: 20, fontSize: 14 },
  scrollCaja: { maxHeight: 150, marginBottom: 10 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cardCaja: { width: '31%', backgroundColor: '#16213e', borderRadius: 8, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: '#0f3460' },
  cardSeleccionada: { borderColor: '#4caf50', borderWidth: 2, backgroundColor: '#1b3a32' },
  sprite: { width: 50, height: 50 },
  nombre: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  nivel: { color: '#aaa', fontSize: 10 },
  scrollEquipo: { flex: 1, marginBottom: 10 },
  cardEquipo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', borderRadius: 10, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: '#2a3a5e' },
  cardEquipoActiva: { borderColor: '#ffeb3b', borderWidth: 1.5 },
  spriteEquipo: { width: 45, height: 45 },
  nombreEquipo: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  tipoText: { color: '#bbb', fontSize: 11 },
  badgeCambiar: { backgroundColor: '#4caf50', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  volver: { backgroundColor: '#555', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  btnT: { color: '#fff', fontWeight: 'bold' },
});