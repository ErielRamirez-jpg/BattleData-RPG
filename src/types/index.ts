export type TipoCriatura = 
  | 'Planta' 
  | 'Fuego' 
  | 'Agua' 
  | 'Electricidad' 
  | 'Tierra' 
  | 'Metal' 
  | 'Normal' 
  | 'Salvaje';

export type TipoItem = 
  | 'Pocion' 
  | 'Pokeball' 
  | 'Revivir' 
  | 'Especial' 
  | string;

export interface Movimiento {
  nombre: string;
  tipo: TipoCriatura;
  poder: number;
  precision: number;
  categoria: 'Fisico' | 'Especial';
}