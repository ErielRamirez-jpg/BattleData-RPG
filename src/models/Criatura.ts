import { Movimiento, TipoCriatura } from '../types/index';

export class Criatura {
  id: number;
  nombre: string;
  tipo1: TipoCriatura;
  tipo2: TipoCriatura | null;
  nivel: number;
  hpMaximo: number;
  hpActual: number;
  ataque: number;
  defensa: number;
  ataqueEspecial: number;
  defensaEspecial: number;
  velocidad: number;
  descripcion: string;
  icono: any; // Sprite para menús / ícono
  spriteFront: any; // Sprite frontal
  spriteBack: any; // Sprite trasero
  movimientos: Movimiento[] = [];
  experiencia: number = 0;

  constructor(
    id: number,
    nombre: string,
    tipo1: TipoCriatura,
    tipo2: TipoCriatura | null,
    nivel: number,
    hpMaximo: number,
    ataque: number,
    defensa: number,
    ataqueEspecial: number,
    defensaEspecial: number,
    velocidad: number,
    descripcion: string,
    icono: any,
    spriteFront?: any,
    spriteBack?: any
  ) {
    this.id = id;
    this.nombre = nombre;
    this.tipo1 = tipo1;
    this.tipo2 = tipo2;
    this.nivel = nivel;
    this.hpMaximo = hpMaximo;
    this.hpActual = hpMaximo;
    this.ataque = ataque;
    this.defensa = defensa;
    this.ataqueEspecial = ataqueEspecial;
    this.defensaEspecial = defensaEspecial;
    this.velocidad = velocidad;
    this.descripcion = descripcion;
    this.icono = icono;
    this.spriteFront = spriteFront || icono;
    this.spriteBack = spriteBack || icono;
  }

  // Getters para compatibilidad de vistas
  getspriteFrontal(): any {
    return this.spriteFront;
  }

  getspriteIcon(): any {
    return this.icono;
  }

  estaDebilitado(): boolean {
    return this.hpActual <= 0;
  }

  recibirDanio(danio: number): void {
    this.hpActual = Math.max(0, this.hpActual - danio);
  }

  curar(cantidad: number): void {
    this.hpActual = Math.min(this.hpMaximo, this.hpActual + cantidad);
  }

  aprenderMovimiento(mov: Movimiento): void {
    if (this.movimientos.length < 4) {
      this.movimientos.push(mov);
    }
  }

  ganarExperiencia(exp: number): { subioDeNivel: boolean; nuevoNivel: number; hpMaximo: number; hpActual: number } {
    this.experiencia += exp;
    let subioDeNivel = false;
    let experienciaNecesaria = this.nivel * 50;

    while (this.experiencia >= experienciaNecesaria) {
      this.experiencia -= experienciaNecesaria;
      this.nivel += 1;
      subioDeNivel = true;

      // Incremento de estadísticas y vida al subir de nivel
      const incrementoHp = Math.floor(this.hpMaximo * 0.1) + 3;
      this.hpMaximo += incrementoHp;
      this.hpActual = this.hpMaximo; // Cura toda la vida al subir de nivel

      this.ataque += Math.floor(this.ataque * 0.08) + 1;
      this.defensa += Math.floor(this.defensa * 0.08) + 1;
      this.ataqueEspecial += Math.floor(this.ataqueEspecial * 0.08) + 1;
      this.defensaEspecial += Math.floor(this.defensaEspecial * 0.08) + 1;
      this.velocidad += Math.floor(this.velocidad * 0.08) + 1;

      // Mejora automática del poder de los movimientos existentes al subir de nivel
      if (this.movimientos && this.movimientos.length > 0) {
        this.movimientos = this.movimientos.map(mov => {
          const poderActual = mov.poder || 10;
          const nuevoPoder = Math.round(poderActual * 1.15) + 1;
          
          return {
            ...mov,
            poder: nuevoPoder,
          };
        });
      }

      experienciaNecesaria = this.nivel * 50;
    }

    return { 
      subioDeNivel, 
      nuevoNivel: this.nivel, 
      hpMaximo: this.hpMaximo, 
      hpActual: this.hpActual 
    };
  }
}