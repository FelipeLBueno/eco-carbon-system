export type StatusCredito = 'RASCUNHO' | 'AUDITADO' | 'COMPENSADO';

export class LoteCreditoCarbono {
  // 1. Atributo privado para controlar o estado interno
  private _status: StatusCredito = 'RASCUNHO';

  constructor(
    public readonly id: string,
    public readonly quantidadeToneladas: number,
    public readonly projetoOrigem: string
  ) {
    // 2. Validação no construtor (Regra de integridade)
    if (quantidadeToneladas <= 0) {
      throw new Error("A quantidade de toneladas de CO2 deve ser maior que zero.");
    }
  }

  // 3. Getter para permitir apenas a leitura do status por fora da classe
  get status(): StatusCredito {
    return this._status;
  }

  /**
   * 4. Regra de Negócio: Transição de estado controlada
   */
  auditar(): void {
    if (this._status !== 'RASCUNHO') {
      throw new Error(`Não é possível auditar um lote que já está como ${this._status}.`);
    }
    this._status = 'AUDITADO';
  }

  /**
   * 5. Regra de Negócio: O crédito é "gastado" para abater a poluição
   */
  compensar(): void {
    if (this._status !== 'AUDITADO') {
      throw new Error("Apenas créditos devidamente AUDITADOS podem ser utilizados para compensação.");
    }
    this._status = 'COMPENSADO';
  }
}