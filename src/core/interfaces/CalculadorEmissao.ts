export interface CalculadorEmissao {
  // Retorna o CO2 em kg. Cada atividade calcula do seu jeito.
  calcular(quantidade: number): number;
}