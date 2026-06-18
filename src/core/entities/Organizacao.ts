import { RegistroAtividade, TipoAtividade } from './RegistroAtividade';
import { LoteCreditoCarbono } from './LoteCreditoCarbono';
import { CalculadorEmissao } from '../interfaces/CalculadorEmissao';

export class Organizacao {
  private _atividades: RegistroAtividade[] = [];
  private _carteiraCreditos: LoteCreditoCarbono[] = [];

  constructor(
    public readonly id: string,
    public readonly nome: string,
    // Injeção de Dependência: Passamos as regras de cálculo no construtor
    private readonly _estrategiasCalculo: Map<TipoAtividade, CalculadorEmissao>
  ) {}

  registrarAtividade(atividade: RegistroAtividade): void {
    this._atividades.push(atividade);
  }

  adicionarCredito(lote: LoteCreditoCarbono): void {
    this._carteiraCreditos.push(lote);
  }

  get creditos(): readonly LoteCreditoCarbono[] {
    return this._carteiraCreditos;
  }

  /**
   * REGRA DE NEGÓCIO: Calcula o total de CO2 emitido usando o polimorfismo das Strategies
   */
  calcularPegadaTotal(): number {
    return this._atividades.reduce((total, atividade) => {
      const estrategia = this._estrategiasCalculo.get(atividade.tipo);
      if (!estrategia) {
        throw new Error(`Regra de cálculo não encontrada para: ${atividade.tipo}`);
      }
      return total + estrategia.calcular(atividade.quantidade);
    }, 0);
  }

  /**
   * REGRA DE NEGÓCIO COMPLEXA: Descobre se a empresa está "Devendo" para o planeta.
   * Transforma os créditos acumulados (que estão em Toneladas) para Kg (1 Ton = 1000 Kg)
   * e subtrai da poluição.
   */
  obterBalancoCarbonoEmKg(): number {
    const totalCreditosKg = this._carteiraCreditos
      .filter(lote => lote.status === 'AUDITADO') // Só valem os auditados!
      .reduce((total, lote) => total + (lote.quantidadeToneladas * 1000), 0);

    const totalPoluicaoKg = this.calcularPegadaTotal();

    return totalCreditosKg - totalPoluicaoKg;
  }

  transferirCredito(loteId: string, organizacaoDestino: Organizacao): void {
    const index = this._carteiraCreditos.findIndex(lote => lote.id === loteId);
    if (index === -1) throw new Error("Operação negada: Lote não pertence a esta organização.");
    
    const lote = this._carteiraCreditos[index];
    if (lote.status !== 'AUDITADO') {
      throw new Error(`Transação bloqueada: O lote está como ${lote.status}.`);
    }

    this._carteiraCreditos.splice(index, 1);
    organizacaoDestino.adicionarCredito(lote);
  }
}