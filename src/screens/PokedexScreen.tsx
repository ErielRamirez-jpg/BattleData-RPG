import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Criatura } from '../models/Criatura';
import { useGame } from '../context/GameContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Pokedex'>;

const colores: Record<string, string> = {
  Planta: '#78C850', Fuego: '#F08030', Agua: '#6890F0',
  Electricidad: '#F8D030', Tierra: '#E0C068', Metal: '#B8B8D0',
};

export default function PokedexScreen({ navigation }: Props) {
  const { equipo } = useGame();
  const [busqueda, setBusqueda] = useState('');
  const [sel, setSel] = useState<Criatura | null>(null);

  const pokemonesCapturados = useMemo(() => {
    const unicos: Criatura[] = [];
    equipo.forEach((c) => {
      if (!unicos.some((x) => x.id === c.id)) {
        unicos.push(c);
      }
    });
    return unicos;
  }, [equipo]);

  const resultados = useMemo(() => {
    if (!busqueda.trim()) return pokemonesCapturados;
    const query = busqueda.toLowerCase();
    return pokemonesCapturados.filter(
      (c) => c.nombre.toLowerCase().includes(query) || String(c.id).includes(query)
    );
  }, [busqueda, pokemonesCapturados]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Pokédex</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Buscar por nombre o número..." 
        placeholderTextColor="#888" 
        value={busqueda} 
        onChangeText={setBusqueda} 
      />
      {sel ? (
        <View style={styles.detalle}>
          <Image source={sel.spriteFront} style={styles.sprite} resizeMode="contain" />
          <Text style={styles.nombre}>#{sel.id} {sel.nombre}</Text>
          <Text style={{ color: colores[sel.tipo1] || '#fff', marginBottom: 10 }}>{sel.tipo1}</Text>
          <Text style={styles.desc}>{sel.descripcion}</Text>
          <View style={styles.stats}>
            <Text style={styles.stat}>HP: {sel.hpMaximo}</Text>
            <Text style={styles.stat}>Ataque: {sel.ataque}</Text>
            <Text style={styles.stat}>Defensa: {sel.defensa}</Text>
            <Text style={styles.stat}>Atq.Esp: {sel.ataqueEspecial}</Text>
            <Text style={styles.stat}>Def.Esp: {sel.defensaEspecial}</Text>
            <Text style={styles.stat}>Velocidad: {sel.velocidad}</Text>
          </View>
          <TouchableOpacity style={styles.volver} onPress={() => setSel(null)}>
            <Text style={styles.btnT}>← Volver</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView>
          {resultados.length > 0 ? (
            resultados.map((c) => (
              <TouchableOpacity key={c.id} style={styles.card} onPress={() => setSel(c)}>
                <Image source={c.icono} style={styles.icon} resizeMode="contain" />
                <View>
                  <Text style={styles.cardN}>#{c.id} {c.nombre}</Text>
                  <Text style={{ color: colores[c.tipo1] || '#fff' }}>{c.tipo1} - Nv. {c.nivel}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.vacioText}>No tienes Pokémon capturados todavía.</Text>
          )}
        </ScrollView>
      )}
      <TouchableOpacity style={styles.menu} onPress={() => navigation.goBack()}>
        <Text style={styles.btnT}>← Menú Principal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', paddingTop: 50, paddingHorizontal: 16 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#e94560', textAlign: 'center', marginBottom: 12 },
  input: { backgroundColor: '#16213e', borderRadius: 10, padding: 12, color: '#fff', marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', borderRadius: 10, padding: 12, marginBottom: 8 },
  icon: { width: 48, height: 48, marginRight: 12 },
  cardN: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  detalle: { flex: 1, alignItems: 'center' },
  sprite: { width: 140, height: 140, marginBottom: 12 },
  nombre: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  desc: { color: '#ccc', textAlign: 'center', marginBottom: 16, paddingHorizontal: 10 },
  stats: { backgroundColor: '#16213e', borderRadius: 12, padding: 16, width: '100%', gap: 6 },
  stat: { color: '#fff', fontSize: 14 },
  volver: { backgroundColor: '#555', padding: 12, borderRadius: 10, marginTop: 16 },
  menu: { backgroundColor: '#555', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 30, marginTop: 10 },
  btnT: { color: '#fff', fontWeight: 'bold' },
  vacioText: { color: '#888', textAlign: 'center', marginTop: 40, fontSize: 14 },
});