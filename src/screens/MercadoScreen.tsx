import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { ArbolBinario } from '../structures/ArbolBinario';
import { crearBulbasaur, crearCharmander, crearSquirtle, crearPikachu, crearCubone, crearMetang } from '../data/criaturas';
import { Criatura } from '../models/Criatura';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Mercado'> };

export default function MercadoScreen({ navigation }: Props) {
  const [criterio, setCriterio] = useState<'poder' | 'nivel'>('poder');

  // Arbol Binario de Búsqueda para ordenar especímenes por Valor Bursátil
  const arbolMercado = useMemo(() => {
    const bst = new ArbolBinario<Criatura>((a, b) => {
      const valA = a.ataque + a.defensa + a.velocidad;
      const valB = b.ataque + b.defensa + b.velocidad;
      return valA - valB;
    });

    [crearBulbasaur(10), crearCharmander(12), crearSquirtle(8), crearPikachu(15), crearCubone(14), crearMetang(20)].forEach((c) => bst.insertar(c));
    return bst;
  }, []);

  const criaturasOrdenadas = arbolMercado.inorden();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bolsa de Criaturas</Text>
      <Text style={styles.sub}>Mercado Bursátil Táctico (Indexación BST en $O(\log N)$)</Text>

      <ScrollView>
        {criaturasOrdenadas.map((c) => {
          const valorMercado = (c.ataque + c.defensa + c.velocidad) * 12;
          return (
            <View key={c.id} style={styles.card}>
              <Image source={c.icono} style={styles.icon} resizeMode="contain" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.nombre}>{c.nombre} (Nv. {c.nivel})</Text>
                <Text style={{ color: '#aaa', fontSize: 12 }}>Poder Base: {c.ataque + c.defensa}</Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.precio}>${valorMercado} CC</Text>
                <TouchableOpacity style={styles.btnComprar}>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Invertir</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.volver} onPress={() => navigation.goBack()}>
        <Text style={styles.btnT}>← Volver al Menú</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', paddingTop: 50, paddingHorizontal: 16 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#4ade80', textAlign: 'center' },
  sub: { color: '#aaa', textAlign: 'center', fontSize: 12, marginBottom: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', borderRadius: 12, padding: 12, marginBottom: 10 },
  icon: { width: 44, height: 44 },
  nombre: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  precio: { color: '#4ade80', fontWeight: 'bold', fontSize: 16 },
  btnComprar: { backgroundColor: '#e94560', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginTop: 4 },
  volver: { backgroundColor: '#555', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 30 },
  btnT: { color: '#fff', fontWeight: 'bold' },
});