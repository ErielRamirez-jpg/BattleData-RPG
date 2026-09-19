import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { Item } from '../models/Item';
import { useGame } from '../context/GameContext';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Mochila'> };

export default function MochilaScreen({ navigation }: Props) {
  const { equipo, actualizarHpCriatura, inventario, dinero } = useGame();
  const [items, setItems] = useState<Item[]>([]);
  const [msg, setMsg] = useState('Selecciona un objeto');
  const [modalVisible, setModalVisible] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState<Item | null>(null);

  // Cada vez que la pantalla cobre foco (por ejemplo, al volver de la tienda), actualizamos los items
  useFocusEffect(
    useCallback(() => {
      if (inventario && typeof inventario.obtenerItems === 'function') {
        setItems([...inventario.obtenerItems()]);
      }
    }, [inventario])
  );

  const usar = (item: Item) => {
    const esPokebola = item.id.includes('bola') || item.tipo?.toLowerCase().includes('captura');
    if (esPokebola) {
      Alert.alert('Acción no permitida', '¡No puedes usar Pokébolas fuera de combate!');
      return;
    }

    if (item.cantidad <= 0) {
      setMsg(`No te quedan ${item.nombre}s`);
      return;
    }

    setItemSeleccionado(item);
    setModalVisible(true);
  };

  const aplicarPocionA = (pokeIndex: number) => {
    if (!itemSeleccionado) return;

    const pokemon = equipo[pokeIndex];

    if (pokemon.hpActual >= pokemon.hpMaximo) {
      Alert.alert('Aviso', `¡${pokemon.nombre} ya tiene la salud al máximo!`);
      return;
    }

    let curacionValor = itemSeleccionado.poder > 0 ? itemSeleccionado.poder : 20;

    const nuevaVida = Math.min(pokemon.hpMaximo, pokemon.hpActual + curacionValor);

    actualizarHpCriatura(pokemon.id, nuevaVida);

    inventario.usarItem(itemSeleccionado.id);
    setItems([...inventario.obtenerItems()]);

    setModalVisible(false);
    setItemSeleccionado(null);
    setMsg(`¡Usaste ${itemSeleccionado.nombre} en ${pokemon.nombre}! Recuperó HP.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mochila</Text>
      
      {/* INDICADOR DE FONDOS DISCRETO Y ELEGANTE */}
      <View style={styles.dineroContainer}>
        <Text style={styles.dineroLabel}>PokéDólares:</Text>
        <Text style={styles.dineroValor}>$ {dinero.toLocaleString()}</Text>
      </View>

      <Text style={styles.msg}>{msg}</Text>
      
      <ScrollView>
        {items.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} onPress={() => usar(item)}>
            {item.icono && <Image source={item.icono} style={styles.icon} resizeMode="contain" />}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.desc}>{item.descripcion}</Text>
            </View>
            <Text style={styles.cant}>x{item.cantidad}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>💊 ¿A quién deseas curar?</Text>
            <ScrollView style={styles.itemList}>
              {equipo.map((poke, index) => {
                const porcentajeHp = Math.max(0, Math.min(100, (poke.hpActual / poke.hpMaximo) * 100));
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.itemRow}
                    onPress={() => aplicarPocionA(index)}
                  >
                    <View style={styles.itemLeft}>
                      <Image
                        source={poke.spriteFront || poke.spriteBack || poke.icono}
                        style={styles.itemIcon}
                        resizeMode="contain"
                      />
                      <View>
                        <Text style={styles.itemText}>{poke.nombre} (Nv. {poke.nivel})</Text>
                        <Text style={styles.hpInfoText}>HP: {poke.hpActual} / {poke.hpMaximo}</Text>
                        <View style={styles.barraFondo}>
                          <View style={[styles.barraRelleno, { width: `${porcentajeHp}%` }]} />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => { setModalVisible(false); setItemSeleccionado(null); }}
            >
              <Text style={styles.closeModalText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.volver} onPress={() => navigation.goBack()}>
        <Text style={styles.btnT}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', paddingTop: 50, paddingHorizontal: 16 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 6 },
  
  // Estilo sutil de línea de estado (no compite con los objetos interactivos)
  dineroContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    gap: 6,
  },
  dineroLabel: {
    color: '#8c9bae',
    fontSize: 13,
    fontWeight: '600',
  },
  dineroValor: {
    color: '#ffeb3b',
    fontSize: 14,
    fontWeight: 'bold',
  },

  msg: { color: '#aaa', textAlign: 'center', marginBottom: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', borderRadius: 12, padding: 14, marginBottom: 10 },
  icon: { width: 40, height: 40 },
  nombre: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  desc: { color: '#aaa', fontSize: 12 },
  cant: { color: '#e94560', fontWeight: 'bold', fontSize: 16 },
  volver: { backgroundColor: '#555', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 30, marginTop: 10 },
  btnT: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: '#fff', width: '85%', maxHeight: '65%', padding: 20, borderRadius: 12, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#333' },
  itemList: { width: '100%' },
  itemRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemIcon: { width: 45, height: 45, marginRight: 12 },
  itemText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  hpInfoText: { fontSize: 12, color: '#666', marginVertical: 2 },
  barraFondo: { height: 6, backgroundColor: '#ddd', borderRadius: 3, width: 150, overflow: 'hidden' },
  barraRelleno: { height: '100%', backgroundColor: '#4caf50' },
  closeModalButton: { marginTop: 15, backgroundColor: '#d9534f', padding: 12, borderRadius: 8, alignItems: 'center' },
  closeModalText: { color: '#fff', fontWeight: 'bold' },
});