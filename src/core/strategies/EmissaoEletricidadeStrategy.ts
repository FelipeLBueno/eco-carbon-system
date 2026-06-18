import { CalculadorEmissao } from '../interfaces/CalculadorEmissao';

export class EmissaoEletricidadeStrategy implements CalculadorEmissao {
  // Regra: 1 kWh consome aprox. 0.092 kg de CO2 na matriz energética
  private readonly FATOR_KWH = 0.092;

  calcular(quantidade: number): number {
    return quantidade * this.FATOR_KWH;
  }
}