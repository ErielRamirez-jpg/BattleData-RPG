import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'MenuPrincipal'> };
const { width } = Dimensions.get('window');

export default function MenuPrincipal({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Pokemon</Text>
      <Text style={styles.subtitulo}>Edición Táctica</Text>

      <View style={styles.menuBox}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Introduccion')}>
          <Text style={styles.btnText}>NUEVA PARTIDA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.sec]} onPress={() => navigation.navigate('GuardarCargar', { modo: 'cargar' })}>
          <Text style={styles.btnText}>CARGAR PARTIDA</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Estructuras de Datos • Expo React Native</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  subtitulo: {
    fontSize: 14,
    color: '#e94560',
    marginBottom: 40,
    textTransform: 'uppercase',
  },
  menuBox: {
    width: width * 0.8,
    gap: 16,
  },
  btn: {
    backgroundColor: '#e94560',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  sec: {
    backgroundColor: '#16213e',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    color: '#555',
    fontSize: 11,
  },
});