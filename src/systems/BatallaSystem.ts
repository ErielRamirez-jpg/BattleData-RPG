import { Criatura } from '../models/Criatura';
import { Movimiento, TipoCriatura } from '../types/index';
import { Cola } from '../structures/Cola';
import { Pila } from '../structures/Pila';

export type AccionTipo = 'atacar' | 'cambiar' | 'huir' | 'capturar' | 'item';

export interface AccionBatalla {
  tipo: AccionTipo;
  movimiento?: Movimiento;
  esJugador: boolean;
}

export type EstadoPantalla =
  | 'menu_principal_batalla'
  | 'elegir_ataque'
  | 'elegir_item'
  | 'elegir_cambio'
  | 'resultado';

// Matriz de efectividad flexibilizada para no fallar si se agregan más tipos
const efectividad: Partial<Record<TipoCriatura, Partial<Record<TipoCriatura, number>>>> = {
  Agua: { Agua: 1, Fuego: 2, Planta: 0.5, Electricidad: 1, Tierra: 2, Metal: 1 },
  Fuego: { Agua: 0.5, Fuego: 1, Planta: 2, Electricidad: 1, Tierra: 0.5, Metal: 2 },
  Planta: { Agua: 2, Fuego: 0.5, Planta: 1, Electricidad: 1, Tierra: 2, Metal: 0.5 },
  Electricidad: { Agua: 2, Fuego: 1, Planta: 0.5, Electricidad: 0.5, Tierra: 0, Metal: 1 },
  Tierra: { Agua: 1, Fuego: 2, Planta: 0.5, Electricidad: 2, Tierra: 1, Metal: 2 },
  Metal: { Agua: 0.5, Fuego: 0.5, Planta: 1, Electricidad: 1, Tierra: 1, Metal: 0.5 },
};

export function calcularDanio(atacante: Criatura, defensor: Criatura, mov: Movimiento) {
  const esFisico = mov.categoria === 'Fisico';
  const atk = esFisico ? atacante.ataque : atacante.ataqueEspecial;
  const def = esFisico ? defensor.defensa : defensor.defensaEspecial;
  
  const base = (((2 * atacante.nivel) / 5 + 2) * mov.poder * (atk / (def || 1))) / 50 + 2;
  
  let multi = efectividad[mov.tipo]?.[defensor.tipo1] ?? 1;
  if (defensor.tipo2) {
    multi *= efectividad[mov.tipo]?.[defensor.tipo2] ?? 1;
  }

  const random = 0.85 + Math.random() * 0.15;
  const stab = mov.tipo === atacante.tipo1 || mov.tipo === atacante.tipo2 ? 1.5 : 1;
  const danio = Math.floor(base * multi * random * stab);

  let mensaje = '';
  if (multi === 0) mensaje = '¡No afecta!';
  else if (multi >= 2) mensaje = '¡Es muy efectivo!';
  else if (multi <= 0.5) mensaje = 'No es muy efectivo...';

  return { danio: Math.max(1, danio), efectividad: multi, mensaje };
}

export class BatallaSystem {
  jugador: Criatura;
  enemigo: Criatura;
  equipoJugador: Criatura[];
  colaTurnos = new Cola<AccionBatalla>();
  pilaEstados = new Pila<EstadoPantalla>();
  mensajes: string[] = [];
  terminada = false;
  ganoJugador = false;

  constructor(equipo: Criatura[], enemigo: Criatura) {
    this.equipoJugador = equipo;
    this.jugador = equipo.find((c) => !c.estaDebilitado()) || equipo[0];
    this.enemigo = enemigo;
    this.pilaEstados.apilar('menu_principal_batalla');
  }

  elegirAtaque(mov: Movimiento) {
    if (this.terminada) return;
    this.colaTurnos.encolar({ tipo: 'atacar', movimiento: mov, esJugador: true });
    this.accionEnemigo();
    this.resolverTurno();
  }

  // Turno activado cuando el jugador usa una poción desde la Mochila
  turnoCura(): void {
    if (this.terminada) return;
    this.mensajes.push(`¡Usaste un objeto de curación!`);
    this.accionEnemigo();
    this.resolverTurno();
  }

  private accionEnemigo() {
    if (this.enemigo.estaDebilitado() || !this.enemigo.movimientos || this.enemigo.movimientos.length === 0) {
      return;
    }
    const mov = this.enemigo.movimientos[Math.floor(Math.random() * this.enemigo.movimientos.length)];
    this.colaTurnos.encolar({ tipo: 'atacar', movimiento: mov, esJugador: false });
  }

  private resolverTurno() {
    const acciones = this.colaTurnos.recorrer();
    this.colaTurnos.limpiar();

    if (acciones.length === 2 && acciones.every((a) => a.tipo === 'atacar')) {
      const primero =
        this.jugador.velocidad >= this.enemigo.velocidad
          ? acciones.find((a) => a.esJugador)!
          : acciones.find((a) => !a.esJugador)!;
      
      const segundo = acciones.find((a) => a !== primero)!;

      this.ejecutar(primero);
      if (!this.terminada) {
        this.ejecutar(segundo);
      }
    } else {
      for (const a of acciones) {
        this.ejecutar(a);
        if (this.terminada) break;
      }
    }

    this.verificarFin();
    this.pilaEstados.limpiar();
    this.pilaEstados.apilar('menu_principal_batalla');
  }

  private ejecutar(accion: AccionBatalla) {
    if (accion.tipo !== 'atacar' || !accion.movimiento) return;

    const atk = accion.esJugador ? this.jugador : this.enemigo;
    const def = accion.esJugador ? this.enemigo : this.jugador;

    if (atk.estaDebilitado()) return;

    if (Math.random() * 100 > accion.movimiento.precision) {
      this.mensajes.push(`¡${atk.nombre} falló!`);
      return;
    }

    const r = calcularDanio(atk, def, accion.movimiento);
    def.recibirDanio(r.danio);

    let msg = `¡${atk.nombre} usó ${accion.movimiento.nombre}!`;
    if (r.mensaje) msg += ` ${r.mensaje}`;
    msg += ` (-${r.danio} HP)`;

    this.mensajes.push(msg);
  }

  intentarHuir() {
    const chance = (this.jugador.velocidad / (this.enemigo.velocidad + 1)) * 50 + 30;
    if (Math.random() * 100 < chance) {
      this.mensajes.push('¡Escapaste con éxito!');
      this.terminada = true;
      return true;
    }
    this.mensajes.push('¡No pudiste escapar!');
    this.accionEnemigo();
    this.resolverTurno();
    return false;
  }

  intentarCapturar(ratio = 1) {
    if (this.enemigo.estaDebilitado()) {
      this.mensajes.push('No puedes capturar a una criatura debilitada.');
      return false;
    }

    const hpF = (this.enemigo.hpMaximo * 3 - this.enemigo.hpActual * 2) / (this.enemigo.hpMaximo * 3);
    const chance = hpF * 100 * ratio * (1 / (this.enemigo.nivel / 10 + 1));

    if (Math.random() * 100 < Math.min(95, chance)) {
      this.mensajes.push(`¡Atrapado! ¡${this.enemigo.nombre} ha sido capturado!`);
      this.terminada = true;
      this.ganoJugador = true;
      return true;
    }

    this.mensajes.push(`¡${this.enemigo.nombre} se liberó de la Pokébola!`);
    this.accionEnemigo();
    this.resolverTurno();
    return false;
  }

  cambiarCriatura(nueva: Criatura) {
    if (nueva.estaDebilitado()) {
      this.mensajes.push('Esa criatura está debilitada y no puede luchar.');
      return;
    }
    this.jugador = nueva;
    this.mensajes.push(`¡Adelante, ${nueva.nombre}!`);
    this.accionEnemigo();
    this.resolverTurno();
  }

  private verificarFin() {
    if (this.enemigo.estaDebilitado()) {
      this.mensajes.push(`¡${this.enemigo.nombre} enemigo se debilitó!`);
      this.jugador.ganarExperiencia(this.enemigo.nivel * 20);
      this.terminada = true;
      this.ganoJugador = true;
    } else if (this.jugador.estaDebilitado()) {
      const vivo = this.equipoJugador.find((c) => !c.estaDebilitado());
      if (vivo) {
        this.mensajes.push(`¡${this.jugador.nombre} se debilitó! Elige a otro compañero.`);
      } else {
        this.mensajes.push('¡Todos tus Pokémon han sido debilitados!');
        this.terminada = true;
        this.ganoJugador = false;
      }
    }
  }

  obtenerUltimoMensaje() {
    return this.mensajes[this.mensajes.length - 1] || '';
  }
}