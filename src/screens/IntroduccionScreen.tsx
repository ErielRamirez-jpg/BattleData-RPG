import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  Alert,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useGame } from '../context/GameContext';
import {
  crearCharmander,
  crearBulbasaur,
  crearSquirtle,
} from '../data/criaturas';
import { Criatura } from '../models/Criatura';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Introduccion'>;
};

const { width } = Dimensions.get('window');

const FONDO_ELEGIR = require('../assets/backgrounds/Fondo para elegir pokemon.jpg');
const PROFESORA_ENCINA = require('../assets/backgrounds/ProfesoraEncina.png');

export default function IntroduccionScreen({ navigation }: Props) {
  const { setEquipo, setNombreJugador } = useGame();
  
  const [fase, setFase] = useState<'dialogo' | 'nombre' | 'eleccion'>('dialogo');
  const [pasoDialogo, setPasoDialogo] = useState(0);
  const [inputNombre, setInputNombre] = useState('');
  
  // Guardamos la referencia al creador y los datos visuales de la opción elegida
  const [inicialSeleccionado, setInicialSeleccionado] = useState<{
    creador: () => Criatura;
    nombre: string;
    tipo: string;
    color: string;
  } | null>(null);

  const dialogosProfesor = [
    '¡Hola! Te doy la bienvenida al mundo de los Pokémon.',
    'Mi nombre es Profesora Encina. Este mundo está habitado por criaturas llamadas Pokémon.',
    'Para algunos son mascotas, para otros son compañeros de combate...',
    'Pero antes de empezar tu aventura táctica, dime... ¿Cómo te llamas?',
  ];

  const iniciales = [
    {
      creador: () => crearBulbasaur(5),
      nombre: 'Bulbasaur',
      tipo: 'Planta',
      color: '#78C850',
      icono: crearBulbasaur(5).icono,
    },
    {
      creador: () => crearCharmander(5),
      nombre: 'Charmander',
      tipo: 'Fuego',
      color: '#F08030',
      icono: crearCharmander(5).icono,
    },
    {
      creador: () => crearSquirtle(5),
      nombre: 'Squirtle',
      tipo: 'Agua',
      color: '#6890F0',
      icono: crearSquirtle(5).icono,
    },
  ];

  const avanzarDialogo = () => {
    if (pasoDialogo < dialogosProfesor.length - 1) {
      setPasoDialogo(pasoDialogo + 1);
    } else {
      setFase('nombre');
    }
  };

  const confirmarNombre = () => {
    if (!inputNombre.trim()) {
      Alert.alert('Profesora Encina', 'Por favor ingresa tu nombre para continuar.');
      return;
    }
    setNombreJugador(inputNombre.trim());
    setFase('eleccion');
  };

  const seleccionarInicial = (item: typeof iniciales[0]) => {
    setInicialSeleccionado(item);
  };

  const comenzarAventura = () => {
    if (!inicialSeleccionado) return;
    
    // Genera la criatura correcta al momento de confirmar
    const criaturaReal = inicialSeleccionado.creador();
    setEquipo([criaturaReal]);

    Alert.alert(
      '¡Profesora Encina!',
      `¡Excelente elección! ${inicialSeleccionado.nombre} y tú, ${inputNombre}, harán un gran equipo. ¡Tu aventura comienza ahora!`,
      [
        {
          text: 'Comenzar Viaje',
          onPress: () => navigation.replace('Mapa'),
        },
      ]
    );
  };

  return (
    <ImageBackground source={FONDO_ELEGIR} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.profesorBox}>
            <View style={styles.profesorAvatar}>
              <Image source={PROFESORA_ENCINA} style={styles.profesorImg} resizeMode="cover" />
            </View>
            <Text style={styles.profesorTitulo}>Profesora Encina</Text>
          </View>

          {fase === 'dialogo' && (
            <TouchableOpacity style={styles.dialogoBox} onPress={avanzarDialogo} activeOpacity={0.8}>
              <Text style={styles.dialogoTexto}>{dialogosProfesor[pasoDialogo]}</Text>
              <Text style={styles.tapToContinue}>Toca para continuar ▼</Text>
            </TouchableOpacity>
          )}

          {fase === 'nombre' && (
            <View style={styles.inputCard}>
              <Text style={styles.label}>Escribe tu nombre de Entrenador:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej. Red, Ash, Maya"
                placeholderTextColor="#888"
                value={inputNombre}
                onChangeText={setInputNombre}
                maxLength={12}
              />
              <TouchableOpacity style={styles.btnConfirmar} onPress={confirmarNombre}>
                <Text style={styles.btnText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          )}

          {fase === 'eleccion' && (
            <View style={styles.eleccionContainer}>
              <Text style={styles.subtituloEleccion}>Elige a tu primer compañero Pokémon:</Text>
              <View style={styles.inicialesGrid}>
                {iniciales.map((item) => {
                  const esSeleccionado = inicialSeleccionado?.nombre === item.nombre;
                  return (
                    <TouchableOpacity
                      key={item.nombre}
                      style={[
                        styles.cardInicial,
                        { borderColor: item.color },
                        esSeleccionado && { backgroundColor: item.color + '44', borderWidth: 3 },
                      ]}
                      onPress={() => seleccionarInicial(item)}
                    >
                      <Image source={item.icono} style={styles.spriteInicial} resizeMode="contain" />
                      <Text style={styles.nombreInicial}>{item.nombre}</Text>
                      <Text style={{ color: item.color, fontSize: 12, fontWeight: 'bold' }}>
                        {item.tipo}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {inicialSeleccionado && (
                <TouchableOpacity style={styles.btnComenzar} onPress={comenzarAventura}>
                  <Text style={styles.btnText}>Elegir a {inicialSeleccionado.nombre} y Empezar</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  profesorBox: { alignItems: 'center', marginTop: 10 },
  profesorAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1f2937',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#e94560',
  },
  profesorImg: { width: '100%', height: '100%' },
  profesorTitulo: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  dialogoBox: {
    backgroundColor: 'rgba(245, 245, 220, 0.95)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 4,
    borderColor: '#374151',
    minHeight: 120,
    justifyContent: 'space-between',
  },
  dialogoTexto: { color: '#111827', fontSize: 16, fontWeight: '600', lineHeight: 22 },
  tapToContinue: { color: '#ef4444', fontSize: 12, fontWeight: 'bold', textAlign: 'right', marginTop: 8 },
  inputCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#374151',
  },
  label: { color: '#f3f4f6', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  textInput: {
    backgroundColor: '#111827',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#4b5563',
    marginBottom: 16,
  },
  btnConfirmar: { backgroundColor: '#e94560', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  eleccionContainer: { width: '100%' },
  subtituloEleccion: {
    color: '#f3f4f6',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  inicialesGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  cardInicial: {
    width: (width - 60) / 3,
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  spriteInicial: { width: 50, height: 50, marginBottom: 6 },
  nombreInicial: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  btnComenzar: { backgroundColor: '#10b981', padding: 16, borderRadius: 10, alignItems: 'center' },
});