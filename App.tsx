import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameProvider } from './src/context/GameContext';

import IntroduccionScreen from './src/screens/IntroduccionScreen';
import MenuPrincipalScreen from './src/screens/MenuPrincipal';
import MapaScreen from './src/screens/MapaScreen';
import Ruta2Screen from './src/screens/Ruta2Screen';
import Ruta3Screen from './src/screens/Ruta3Screen';
import CentroPokemonScreen from './src/screens/CentroPokemonScreen';
import BatallaScreen from './src/screens/BatallaScreen';
import MercadoScreen from './src/screens/MercadoScreen';
import MochilaScreen from './src/screens/MochilaScreen';
import PokedexScreen from './src/screens/PokedexScreen';
import SeleccionEquipoScreen from './src/screens/SeleccionEquipoScreen';
import EquipoScreen from './src/screens/EquipoScreen';
import CajaScreen from './src/screens/CajaScreen';
import GuardarCargarScreen from './src/screens/GuardarCargarScreen';
import { PokemonData } from './src/utils/pokemonDatabase';

export type RootStackParamList = {
  Introduccion: undefined;
  MenuPrincipal: undefined;
  Mapa: { posicionAnterior?: { fila: number; col: number } } | undefined;
  Ruta2: {
    rutaOrigen?: string;
    posicionAnterior?: { fila: number; col: number };
  } | undefined;
  Ruta3: {
    rutaOrigen?: string;
    posicionAnterior?: { fila: number; col: number };
  } | undefined;
  CentroPokemon: { posicionAnterior?: { fila: number; col: number } } | undefined;
  Batalla: {
    enemyPokemon?: PokemonData;
    esEntrenador?: boolean;
    playerPokemon?: PokemonData;
    rutaOrigen?: string;
    posicionAnterior?: { fila: number; col: number };
  } | undefined;
  Mercado: undefined;
  Mochila: undefined;
  Pokedex: undefined;
  SeleccionEquipo: undefined;
  Equipo: undefined;
  Caja: undefined;
  GuardarCargar: { modo: 'guardar' | 'cargar' };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MenuPrincipal" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MenuPrincipal" component={MenuPrincipalScreen} />
          <Stack.Screen name="Introduccion" component={IntroduccionScreen} />
          <Stack.Screen name="Mapa" component={MapaScreen} />
          <Stack.Screen name="Ruta2" component={Ruta2Screen} />
          <Stack.Screen name="Ruta3" component={Ruta3Screen} />
          <Stack.Screen name="CentroPokemon" component={CentroPokemonScreen} />
          <Stack.Screen name="Batalla" component={BatallaScreen} />
          <Stack.Screen name="Mercado" component={MercadoScreen} />
          <Stack.Screen name="Mochila" component={MochilaScreen} />
          <Stack.Screen name="Pokedex" component={PokedexScreen} />
          <Stack.Screen name="SeleccionEquipo" component={SeleccionEquipoScreen} />
          <Stack.Screen name="Equipo" component={EquipoScreen} />
          <Stack.Screen name="Caja" component={CajaScreen} />
          <Stack.Screen name="GuardarCargar" component={GuardarCargarScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}