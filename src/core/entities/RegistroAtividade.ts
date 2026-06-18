export type TipoAtividade = 'TRANSPORTE' | 'ELETRICIDADE';

export class RegistroAtividade {
  constructor(
    public readonly tipo: TipoAtividade,
    public readonly quantidade: number,
    public readonly descricao: string
  ) {
    // Validação básica de integridade: não existe poluição negativa ou zerada
    if (quantidade <= 0) {
      throw new Error("A quantidade da atividade deve ser maior que zero.");
    }
  }
}