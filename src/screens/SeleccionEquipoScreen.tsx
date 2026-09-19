import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { crearBulbasaur, crearCharmander, crearSquirtle, crearPikachu, crearCubone, crearMetang } from '../data/criaturas';
import { Criatura } from '../models/Criatura';
import { useGame } from '../context/GameContext';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Introduccion'> };

const lista = [
  { crear: crearBulbasaur, nombre: 'Bulbasaur', tipo: 'Planta', color: '#78C850' },
  { crear: crearCharmander, nombre: 'Charmander', tipo: 'Fuego', color: '#F08030' },
  { crear: crearSquirtle, nombre: 'Squirtle', tipo: 'Agua', color: '#6890F0' },
  { crear: crearPikachu, nombre: 'Pikachu', tipo: 'Electricidad', color: '#F8D030' },
  { crear: crearCubone, nombre: 'Cubone', tipo: 'Tierra', color: '#E0C068' },
  { crear: crearMetang, nombre: 'Metang', tipo: 'Metal', color: '#B8B8D0' },
];

export default function SeleccionEquipoScreen({ navigation }: Props) {
  const [sel, setSel] = useState<string[]>([]);
  const { setEquipo, setEnemigoActual } = useGame();

  const toggle = (n: string) => {
    if (sel.includes(n)) {
      setSel(sel.filter((x) => x !== n));
    } else if (sel.length < 3) {
      setSel([...sel, n]);
    }
  };

  const iniciar = () => {
    if (!sel.length) return;
    const equipo: Criatura[] = sel.map((n) => lista.find((c) => c.nombre === n)!.crear(5));
    
    // Se guarda en el contexto de la aplicación sin usar 'global'
    setEquipo(equipo);
    setEnemigoActual(crearPikachu(5));
    
    navigation.navigate('Batalla');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Elige tu equipo</Text>
      <Text style={styles.sub}>Hasta 3 ({sel.length}/3)</Text>
      <ScrollView>
        {lista.map((c) => {
          const activo = sel.includes(c.nombre);
          const criatura = c.crear(5);
          return (
            <TouchableOpacity
              key={c.nombre}
              style={[
                styles.card,
                { borderColor: c.color },
                activo && { backgroundColor: c.color + '33' }
              ]}
              onPress={() => toggle(c.nombre)}
            >
              <Image source={criatura.icono} style={styles.sprite} resizeMode="contain" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.nombre}>{c.nombre}</Text>
                <Text style={{ color: c.color }}>{c.tipo}</Text>
              </View>
              {activo && (
                <View style={styles.check}>
                  <Text style={{ fontWeight: 'bold' }}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <TouchableOpacity
        style={[styles.boton, !sel.length && { backgroundColor: '#555' }]}
        onPress={iniciar}
        disabled={!sel.length}
      >
        <Text style={styles.botonTexto}>¡Comenzar!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', paddingTop: 50, paddingHorizontal: 16 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  sub: { color: '#aaa', textAlign: 'center', marginBottom: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 2 },
  sprite: { width: 56, height: 56 },
  nombre: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  check: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#4ade80', justifyContent: 'center', alignItems: 'center' },
  boton: { backgroundColor: '#e94560', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 30, marginTop: 10 },
  botonTexto: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});