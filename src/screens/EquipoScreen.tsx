import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useGame } from '../context/GameContext';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Equipo'> };

export default function EquipoScreen({ navigation }: Props) {
  const { equipo, caja } = useGame();
  const [, setActualizador] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Equipo Pokémon</Text>

      <View style={styles.botonesTopRow}>
        {/* BOTÓN PARA ACCEDER A LA CAJA DE PC */}
        <TouchableOpacity 
          style={[styles.btnAccion, { backgroundColor: '#3f51b5' }]} 
          onPress={() => navigation.navigate('Caja')}
        >
          <Text style={styles.btnAccionText}>🖥️ Caja PC ({caja.length})</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.lista}>
        {equipo.length === 0 ? (
          <Text style={styles.vacio}>No tienes Pokémon en tu equipo actualmente.</Text>
        ) : (
          equipo.map((poke, index) => {
            const porcentajeHp = Math.max(0, Math.min(100, (poke.hpActual / poke.hpMaximo) * 100));
            const nivelActual = poke.nivel || 1;
            const expActual = poke.experiencia || 0;
            const expRequerida = nivelActual * 50;
            const porcentajeExp = Math.min(100, Math.max(0, (expActual / expRequerida) * 100));
            
            const spriteDeFrenteFijo = poke.id 
              ? { uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${poke.id}.gif` } 
              : (poke.icono || poke.spriteFront);

            return (
              <View key={index} style={styles.card}>
                <View style={styles.headerCard}>
                  <Image source={spriteDeFrenteFijo} style={styles.sprite} resizeMode="contain" />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.nombre}>{poke.nombre} <Text style={styles.nivel}>Nv. {nivelActual}</Text></Text>
                    <Text style={styles.tipos}>Tipo: {poke.tipo1} {poke.tipo2 ? `/ ${poke.tipo2}` : ''}</Text>
                    
                    <View style={styles.hpContainer}>
                      <Text style={styles.hpText}>HP: {poke.hpActual} / {poke.hpMaximo}</Text>
                      <View style={styles.barraFondo}>
                        <View style={[styles.barraRellenoHp, { width: `${porcentajeHp}%` }]} />
                      </View>
                    </View>

                    <View style={styles.expContainer}>
                      <View style={styles.expHeaderRow}>
                        <Text style={styles.expLabel}>EXP</Text>
                        <Text style={styles.expValuesText}>{expActual} / {expRequerida}</Text>
                      </View>
                      <View style={styles.barraFondo}>
                        <View style={[styles.barraRellenoExp, { width: `${porcentajeExp}%` }]} />
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.habilidadesBox}>
                  <Text style={styles.habTitulo}>Habilidades / Movimientos:</Text>
                  {poke.movimientos && poke.movimientos.length > 0 ? (
                    poke.movimientos.map((mov: any, mIndex: number) => (
                      <Text key={mIndex} style={styles.habTexto}>• {mov.nombre} (Potencia: {mov.poder || mov.danio || 'Especial'})</Text>
                    ))
                  ) : (
                    <Text style={styles.habTexto}>• Placaje / Ataques base</Text>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity style={styles.volver} onPress={() => navigation.goBack()}>
        <Text style={styles.btnT}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', paddingTop: 40, paddingHorizontal: 16 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 12 },
  botonesTopRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15 },
  btnAccion: { width: '100%', padding: 12, borderRadius: 10, alignItems: 'center' },
  btnAccionText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  lista: { flex: 1 },
  vacio: { color: '#aaa', textAlign: 'center', marginTop: 40, fontSize: 16 },
  card: { backgroundColor: '#16213e', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#0f3460' },
  headerCard: { flexDirection: 'row', alignItems: 'center' },
  sprite: { width: 65, height: 65 },
  nombre: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  nivel: { color: '#e94560', fontSize: 14 },
  tipos: { color: '#bbb', fontSize: 12, marginBottom: 4 },
  hpContainer: { marginTop: 2 },
  hpText: { color: '#ccc', fontSize: 11, marginBottom: 2 },
  barraFondo: { height: 6, backgroundColor: '#333', borderRadius: 3, overflow: 'hidden' },
  barraRellenoHp: { height: '100%', backgroundColor: '#4caf50' },
  expContainer: { marginTop: 4 },
  expHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  expLabel: { color: '#ffeb3b', fontSize: 9, fontWeight: 'bold' },
  expValuesText: { color: '#ffeb3b', fontSize: 8 },
  barraRellenoExp: { height: '100%', backgroundColor: '#ffeb3b' },
  habilidadesBox: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#2a3a5e', paddingTop: 6 },
  habTitulo: { color: '#e94560', fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  habTexto: { color: '#ddd', fontSize: 12, marginLeft: 6 },
  volver: { backgroundColor: '#555', padding: 14, borderRadius: 12, alignItems: 'center', marginVertical: 15 },
  btnT: { color: '#fff', fontWeight: 'bold' },
});