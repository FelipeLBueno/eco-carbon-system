import { Organizacao } from '../../src/core/entities/Organizacao';
import { LoteCreditoCarbono } from '../../src/core/entities/LoteCreditoCarbono';

describe('Mercado de Carbono - Transações entre Organizações', () => {
  let empresaOrigem: Organizacao;
  let empresaDestino: Organizacao;

beforeEach(() => {
    // Passamos um mapa vazio por enquanto para os testes de mercado não quebrarem
    empresaOrigem = new Organizacao('1', 'EcoReflorestadora Corp', new Map());
    empresaDestino = new Organizacao('2', 'Industria Poluidora S/A', new Map());
  });

  it('deve transferir um lote de crédito com sucesso se ele estiver devidamente AUDITADO', () => {
    // 1. Cenário: Criamos um lote e mudamos o status dele para AUDITADO
    const loteVerde = new LoteCreditoCarbono('LOTE-01', 500, 'Projeto Amazônia');
    loteVerde.auditar(); 
    
    empresaOrigem.adicionarCredito(loteVerde);
    
    // 2. Ação: Executamos a transferência
    empresaOrigem.transferirCredito('LOTE-01', empresaDestino);

    // 3. Validação: O lote saiu da origem e foi para o destino?
    expect(empresaOrigem.creditos.length).toBe(0);
    expect(empresaDestino.creditos.length).toBe(1);
    expect(empresaDestino.creditos[0].status).toBe('AUDITADO');
  });

  it('deve barrar a venda se o lote de crédito ainda estiver em formato de RASCUNHO', () => {
    // 1. Cenário: Criamos um lote mas NÃO auditamos (ele nasce como RASCUNHO)
    const loteRascunho = new LoteCreditoCarbono('LOTE-02', 100, 'Projeto Piloto');
    empresaOrigem.adicionarCredito(loteRascunho);

    // 2. Ação e Validação: O sistema DEVE estourar um erro ao tentar transferir
    expect(() => {
      empresaOrigem.transferirCredito('LOTE-02', empresaDestino);
    }).toThrow("Transação bloqueada");
    
    // O lote NÃO pode ter saído da empresa de origem
    expect(empresaOrigem.creditos.length).toBe(1);
    expect(empresaDestino.creditos.length).toBe(0);
  });
});