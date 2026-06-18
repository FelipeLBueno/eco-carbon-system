import { CalculadorEmissao } from '../interfaces/CalculadorEmissao';

export class EmissaoTransporteStrategy implements CalculadorEmissao {
  // Regra: 1 Litro de Diesel emite aprox. 2.68 kg de CO2
  private readonly FATOR_DIESEL = 2.68;

  calcular(quantidade: number): number {
    return quantidade * this.FATOR_DIESEL;
  }
}