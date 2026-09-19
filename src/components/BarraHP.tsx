import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  porcentaje: number;
  ancho?: number | `${number}%`;
  alto?: number;
};

export default function BarraHP({ porcentaje, ancho, alto = 8 }: Props) {
  const valor = Math.max(0, Math.min(100, porcentaje));
  const color = valor > 50 ? '#4ade80' : valor > 20 ? '#fbbf24' : '#ef4444';

  return (
    <View style={[styles.fondo, { height: alto, width: ancho ?? '100%' }]}>
      <View style={[styles.barra, { width: `${valor}%`, backgroundColor: color, height: alto }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  fondo: { backgroundColor: '#ccc', borderRadius: 4, overflow: 'hidden' },
  barra: { borderRadius: 4 },
});
