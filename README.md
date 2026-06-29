# EcoCarbon System | Gestão e Compensação de Créditos de Carbono

Um sistema de software orientado a objetos para simulação, cálculo de pegada de carbono e transações auditadas de créditos de compensação ambiental, alinhado ao **ODS 13 (Ação Contra a Mudança Global do Clima)** da Agenda 2030 da ONU.

## O Projeto

O **EcoCarbon System** gerencia as regras complexas de conformidade ambiental de organizações, calculando dinamicamente suas emissões de gases de efeito estufa (GEE) com base em diferentes matrizes de atividade e gerenciando um mercado interno de transferência de créditos auditados.

### Regras de Negócio

1. **Cálculo Dinâmico de Emissões GEE:** Aplicação de fatores de conversão variáveis baseados no escopo da atividade (ex: queima de combustível fóssil vs. consumo elétrico industrial), utilizando o padrão de projeto *Strategy*.
2. **Auditoria de Transações de Crédito:** Uma empresa só pode vender créditos se eles estiverem no estado de "Auditado e Ativo". O sistema impede transações se o saldo consolidado pós-venda violar o limite mínimo de segurança da organização vendedora.
3. **Taxação Verde Progressiva:** Transações comerciais entre setores de alto impacto ambiental sofrem uma retenção interna de créditos (taxação de salvaguarda) para fundos de reflorestamento locais.

## Arquitetura e Engenharia de Software

O projeto adota uma **Arquitetura em Camadas** para garantir o isolamento total das regras de negócio em relação a bancos de dados ou interfaces de usuário. Isso nos permite garantir 100% de testabilidade do núcleo do sistema.

### Pilares Aplicados

* **Encapsulamento Estrito:** Entidades críticas como `ContaCarbono` possuem estados que mudam e são protegidos. Saldos e históricos não podem ser alterados diretamente via setters públicos, apenas por métodos de domínio controlados (ex: `debitar()`, `creditar()`).
* **Polimorfismo & Interfaces:** Uso de interfaces para desacoplamento de serviços e estratégias de cálculo, permitindo que novos escopos de poluentes sejam adicionados sem alterar o código.
* **Tratamento de Exceções Customizado:** Lançamento de exceções de domínio explícitas (ex: `SaldoInsuficienteException`, `CreditoNaoAuditadoException`) impedindo que o sistema atinja estados inconsistentes.

## Testes Automatizados

As regras de cálculo e o fluxo de transações são validados rigorosamente através de testes unitários automatizados.

### Como Executar o Projeto (Passo a Passo)

Siga as instruções abaixo para configurar o ambiente e rodar a aplicação no seu computador (Windows/Linux/Mac).

### Pré-requisitos (Instalação do Node.js e NPM)

Caso ainda não tenha o ambiente do Node instalado:

1. Acesse o site oficial do [Node.js](https://nodejs.org/).
2. Baixe e instale a versão **LTS** (Recomendada). O **NPM** (gerenciador de pacotes) é instalado automaticamente.
3. Para confirmar se a instalação deu certo, abra o terminal e digite:

   ```bash
   node -v
   npm -v

4. Depois abra a pasta do projeto no VS Code e instale as dependências necessárias executando:

   ```Bash
   npm install

## Comandos Disponíveis

O projeto possui duas formas independentes de execução.

1. Validar o Motor de Regras (Back-end)

* Se o objetivo for validar a inteligência do sistema, os cálculos químicos/ambientais e as travas de segurança isoladamente, execute a suíte de testes automatizados:

   ```Bash
   npm test

### Como funciona?

O framework Jest vai rodar os arquivos de teste na pasta tests/. Ele simula cenários reais (como tentativas de fraudar créditos ou cálculos de poluição por transporte e energia) e valida se as classes se comportaram corretamente.

2. Iniciar a Interface Visual (Front-end + Servidor)

* Se o objetivo for realizar o "tour demonstrativo" (demo) do software através de um painel visual no navegador, ligue o servidor web:

   ```Bash
   npm start

O que acontece: O ts-node-dev vai compilar e rodar o arquivo src/main.ts, inicializando um servidor web local via Express na porta 3000.

   ### Como acessar
   Após o comando iniciar, abra o seu navegador de internet e acesse o endereço:
   <http://localhost:3000>
