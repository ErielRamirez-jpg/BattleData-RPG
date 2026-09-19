import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useGame, SlotPartida } from '../context/GameContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GuardarCargar'>;
  route: RouteProp<RootStackParamList, 'GuardarCargar'>;
};

export default function GuardarCargarScreen({ navigation, route }: Props) {
  const { modo } = route.params; // 'guardar' o 'cargar'
  const { guardarPartidaEnSlot, cargarPartidaDeSlot, obtenerSlotsGuardados } = useGame();
  const [slots, setSlots] = useState<(SlotPartida | null)[]>([]);

  const cargarSlotsInfo = async () => {
    const datosSlots = await obtenerSlotsGuardados();
    setSlots(datosSlots);
  };

  useEffect(() => {
    cargarSlotsInfo();
  }, []);

  const handleAccionSlot = async (slotIndex: number) => {
    if (modo === 'guardar') {
      const exito = await guardarPartidaEnSlot(slotIndex);
      if (exito) {
        Alert.alert('Éxito', `Partida guardada correctamente en el Slot ${slotIndex + 1}. (Persistente ante cierres de app)`);
        cargarSlotsInfo();
      } else {
        Alert.alert('Error', 'No se pudo guardar la partida.');
      }
    } else {
      // Modo Cargar
      const slotSeleccionado = slots[slotIndex];
      if (!slotSeleccionado) {
        Alert.alert('Vacío', 'Este slot no contiene ninguna partida guardada.');
        return;
      }

      const exito = await cargarPartidaDeSlot(slotIndex);
      if (exito) {
        Alert.alert('¡Partida Cargada!', `Bienvenido de nuevo, ${slotSeleccionado.nombreJugador}. Tu equipo ha sido restaurado.`);
        navigation.navigate('Mapa');
      } else {
        Alert.alert('Error', 'No se pudo cargar la partida.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {modo === 'guardar' ? '💾 GUARDAR PARTIDA' : '📂 CARGAR PARTIDA'}
      </Text>
      <Text style={styles.subtitulo}>
        {modo === 'guardar' ? 'Selecciona un espacio para guardar tu progreso' : 'Selecciona una partida para continuar'}
      </Text>

      <ScrollView style={styles.listaSlots}>
        {[0, 1, 2].map((i) => {
          const slot = slots[i];
          return (
            <TouchableOpacity 
              key={i} 
              style={[styles.slotCard, slot ? styles.slotOcupado : styles.slotVacio]}
              onPress={() => handleAccionSlot(i)}
            >
              <Text style={styles.slotTitulo}>SLOT {i + 1}</Text>
              {slot ? (
                <View>
                  <Text style={styles.slotInfo}>Jugador: {slot.nombreJugador}</Text>
                  <Text style={styles.slotInfo}>Fecha: {slot.fecha}</Text>
                  <Text style={styles.slotInfo}>Pokémon en equipo: {slot.cantidadEquipo}</Text>
                  <View style={styles.equipoResumenBox}>
                    {slot.equipoResumen.map((c, idx) => (
                      <Text key={idx} style={styles.pokemonResumenItem}>
                        • {c.nombre} (Nv. {c.nivel}) - HP: {c.hpActual}/{c.hpMaximo}
                      </Text>
                    ))}
                  </View>
                </View>
              ) : (
                <Text style={styles.textoVacio}>[ Espacio Disponible / Vacío ]</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.volverBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.volverTexto}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', paddingTop: 40, paddingHorizontal: 16 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  subtitulo: { fontSize: 12, color: '#94a3b8', textAlign: 'center', marginBottom: 20 },
  listaSlots: { flex: 1 },
  slotCard: { backgroundColor: '#1e293b', borderRadius: 10, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#334155' },
  slotOcupado: { borderColor: '#3b82f6' },
  slotVacio: { borderColor: '#475569', borderStyle: 'dashed' },
  slotTitulo: { color: '#38bdf8', fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  slotInfo: { color: '#cbd5e1', fontSize: 13 },
  textoVacio: { color: '#64748b', fontStyle: 'italic', textAlign: 'center', marginVertical: 10 },
  equipoResumenBox: { marginTop: 8, borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 6 },
  pokemonResumenItem: { color: '#94a3b8', fontSize: 11 },
  volverBtn: { backgroundColor: '#475569', padding: 14, borderRadius: 8, alignItems: 'center', marginVertical: 15 },
  volverTexto: { color: '#fff', fontWeight: 'bold' },
});