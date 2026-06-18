import express from 'express';
import path from 'path';
import { Organizacao } from './core/entities/Organizacao';
import { RegistroAtividade, TipoAtividade } from './core/entities/RegistroAtividade';
import { LoteCreditoCarbono } from './core/entities/LoteCreditoCarbono';
import { EmissaoTransporteStrategy } from './core/strategies/EmissaoTransporteStrategy';
import { EmissaoEletricidadeStrategy } from './core/strategies/EmissaoEletricidadeStrategy';
import { CalculadorEmissao } from './core/interfaces/CalculadorEmissao';

const app = express();
app.use(express.json());

// Servir a página HTML estática que vamos criar
app.use(express.static(path.join(__dirname, 'public')));

// --- CONFIGURAÇÃO DO CENÁRIO DE POO (Em Memória) ---
const estrategias = new Map<TipoAtividade, CalculadorEmissao>([
  ['TRANSPORTE', new EmissaoTransporteStrategy()],
  ['ELETRICIDADE', new EmissaoEletricidadeStrategy()]
]);

// Criamos duas organizações para simular o mercado
const fabrica = new Organizacao('1', 'Fábrica Metalúrgica S/A', estrategias);
const ong = new Organizacao('2', 'ONG Refloresta Tech', estrategias);

// A ONG já nasce com um lote de crédito de 5 Toneladas que ela gerou plantando árvores
const loteInicial = new LoteCreditoCarbono('LOTE-99', 5, 'Reflorestamento Ativo');
loteInicial.auditar(); // Deixamos auditado para poder vender!
ong.adicionarCredito(loteInicial);
// ----------------------------------------------------

// Rota para pegar os dados atuais das empresas para exibir na tela
app.get('/api/dados', (req, res) => {
  res.json({
    fabrica: {
      nome: fabrica.nome,
      poluicao: fabrica.calcularPegadaTotal().toFixed(2),
      balanco: fabrica.obterBalancoCarbonoEmKg().toFixed(2),
      creditos: fabrica.creditos.length
    },
    ong: {
      nome: ong.nome,
      poluicao: ong.calcularPegadaTotal().toFixed(2),
      balanco: ong.obterBalancoCarbonoEmKg().toFixed(2),
      creditos: ong.creditos.length
    }
  });
});

// Rota para simular poluição na fábrica
app.post('/api/poluir', (req, res) => {
  const { tipo, quantidade } = req.body;
  try {
    const atividade = new RegistroAtividade(tipo, Number(quantidade), 'Atividade via Painel Visual');
    fabrica.registrarAtividade(atividade);
    res.json({ tracking: 'sucesso' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para comprar o crédito da ONG
app.post('/api/comprar', (req, res) => {
  try {
    // A fábrica puxa o crédito da ONG usando a regra de negócio de POO que você testou!
    ong.transferirCredito('LOTE-99', fabrica);
    res.json({ tracking: 'sucesso' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n🌍 EcoCarbon System online em: http://localhost:${PORT}`);
});