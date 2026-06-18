import { Organizacao } from '../../src/core/entities/Organizacao';
import { RegistroAtividade, TipoAtividade } from '../../src/core/entities/RegistroAtividade';
import { LoteCreditoCarbono } from '../../src/core/entities/LoteCreditoCarbono';
import { EmissaoTransporteStrategy } from '../../src/core/strategies/EmissaoTransporteStrategy';
import { EmissaoEletricidadeStrategy } from '../../src/core/strategies/EmissaoEletricidadeStrategy';
import { CalculadorEmissao } from '../../src/core/interfaces/CalculadorEmissao';

describe('Organizacao - Cálculo de Pegada e Balanço de Carbono', () => {
  let estrategias: Map<TipoAtividade, CalculadorEmissao>;
  let empresa: Organizacao;

  beforeEach(() => {
    // 1. Configura as estratégias reais de cálculo com seus fatores químicos/ambientais
    estrategias = new Map<TipoAtividade, CalculadorEmissao>([
      ['TRANSPORTE', new EmissaoTransporteStrategy()],
      ['ELETRICIDADE', new EmissaoEletricidadeStrategy()]
    ]);

    empresa = new Organizacao('10', 'Logística Sustentável S/A', estrategias);
  });

  it('deve calcular corretamente a pegada de carbono total baseada nas diferentes atividades', () => {
    // 100 Litros de Diesel (100 * 2.68 = 268 kg CO2)
    empresa.registrarAtividade(new RegistroAtividade('TRANSPORTE', 100, 'Viagens de entrega'));
    // 1000 kWh de energia (1000 * 0.092 = 92 kg CO2)
    empresa.registrarAtividade(new RegistroAtividade('ELETRICIDADE', 1000, 'Consumo do galpão'));

    // Total de poluição esperado: 268 + 92 = 360 kg de CO2
    expect(empresa.calcularPegadaTotal()).toBe(360);
  });

  it('deve calcular o balanço ecológico positivo quando a empresa tem mais créditos auditados do que poluição', () => {
    // Empresa polui 360 kg de CO2
    empresa.registrarAtividade(new RegistroAtividade('TRANSPORTE', 100, 'Entregas'));
    empresa.registrarAtividade(new RegistroAtividade('ELETRICIDADE', 1000, 'Galpão'));

    // Empresa possui 1 Lote Auditado de 1 Tonelada (1 Ton = 1000 kg de CO2)
    const loteVerde = new LoteCreditoCarbono('L-99', 1, 'Reflorestamento');
    loteVerde.auditar();
    empresa.adicionarCredito(loteVerde);

    // Balanço esperado: 1000kg (crédito) - 360kg (poluição) = 640kg de saldo positivo
    expect(empresa.obterBalancoCarbonoEmKg()).toBe(640);
  });

  it('deve ignorar créditos em formato de RASCUNHO na hora de calcular o balanço ecológico', () => {
    // Empresa polui 360 kg de CO2
    empresa.registrarAtividade(new RegistroAtividade('TRANSPORTE', 100, 'Entregas'));

    // Empresa possui um crédito de 2 Toneladas, mas ainda é RASCUNHO (não foi auditado)
    const loteRascunho = new LoteCreditoCarbono('L-00', 2, 'Projeto Novo');
    empresa.adicionarCredito(loteRascunho);

    // Como o rascunho é ignorado, o saldo deve ser apenas o saldo negativo da poluição: 0 - 268 = -268kg
    expect(empresa.obterBalancoCarbonoEmKg()).toBe(-268);
  });
});