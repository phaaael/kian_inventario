# Kian_Inventario

Sistema web para **gestão de equipamentos, empréstimos e suprimentos de TI**, desenvolvido para atender uma necessidade específica do ambiente corporativo.

O projeto foi pensado e utilizado para resolver um **problema pontual e real de operação**, centralizando solicitações, empréstimos, devoluções, controle de estoque e acompanhamento de ativos que antes dependiam de processos mais manuais.

Apesar de funcional e utilizado no contexto para o qual foi criado, o projeto ainda necessita de **diversos ajustes técnicos, melhorias de segurança, refatorações e evolução arquitetural** para atingir um padrão mais robusto de escalabilidade, manutenção e uso em ambientes de produção mais complexos.

---

## Sobre o projeto

O **Kian_Inventario** nasceu a partir de uma necessidade prática identificada dentro do ambiente corporativo.

O objetivo inicial não foi construir uma plataforma genérica ou uma solução completa de gestão de ativos, mas solucionar de forma rápida e funcional um problema específico relacionado ao controle de equipamentos e suprimentos administrados pelo setor de TI.

A aplicação permitiu centralizar processos que anteriormente poderiam depender de controles paralelos, planilhas, mensagens ou acompanhamento manual.

Entre os principais processos atendidos estão:

- Solicitação de equipamentos;
- Controle de empréstimos;
- Registro de devoluções;
- Solicitação de suprimentos;
- Aprovação ou recusa de solicitações;
- Controle de disponibilidade;
- Controle de estoque;
- Alertas de devolução;
- Notificações por e-mail;
- Exportação de informações.

O sistema cumpriu seu objetivo inicial e serviu como uma solução funcional para o cenário em que foi aplicado.

Entretanto, por ter sido desenvolvido com foco na resolução rápida de uma necessidade específica, algumas decisões técnicas foram priorizadas pela simplicidade e velocidade de implementação.

Por esse motivo, o projeto deve ser entendido como uma **primeira versão funcional**, com espaço significativo para evolução.

---

## Objetivo

O principal objetivo do projeto foi melhorar a rastreabilidade e organização dos recursos administrados pelo setor de TI.

A aplicação busca responder perguntas como:

```text
Quem solicitou o equipamento?
        │
        ▼
Quem aprovou?
        │
        ▼
Qual equipamento foi entregue?
        │
        ▼
Quem está utilizando?
        │
        ▼
Quando deverá ser devolvido?
        │
        ▼
O equipamento já foi devolvido?
```

Para suprimentos:

```text
Qual item foi solicitado?
        │
        ▼
Quem realizou a solicitação?
        │
        ▼
A solicitação foi aprovada?
        │
        ▼
Qual quantidade foi retirada?
        │
        ▼
Quanto ainda existe em estoque?
        │
        ▼
O estoque atingiu o nível crítico?
```

---

## Funcionalidades

### Autenticação de usuários

A aplicação possui autenticação para acesso às funcionalidades da plataforma.

O sistema diferencia funcionalidades administrativas das disponíveis para usuários comuns.

---

### Gestão de equipamentos

Permite controlar equipamentos disponibilizados pela área de TI.

Cada equipamento pode possuir informações como:

- Nome;
- Código de identificação;
- Situação;
- Disponibilidade;
- Responsável atual;
- Histórico relacionado ao empréstimo.

---

### Solicitação de equipamentos

Usuários podem solicitar equipamentos através da própria plataforma.

As solicitações podem conter:

- Usuário solicitante;
- Equipamento;
- Data da solicitação;
- Motivo;
- Previsão de devolução.

---

### Aprovação e recusa

A equipe responsável pode analisar as solicitações recebidas.

As operações incluem:

- Aprovação;
- Recusa;
- Registro do responsável;
- Alteração de informações;
- Registro do motivo da recusa.

---

### Controle de empréstimos

Após a aprovação, o equipamento passa a possuir um empréstimo ativo.

O sistema permite acompanhar:

- Responsável;
- Data de retirada;
- Data prevista para devolução;
- Situação;
- Atrasos;
- Finalização do empréstimo.

---

### Controle de devoluções

Após a devolução, o equipamento pode voltar a ficar disponível para utilização.

Também é possível acompanhar equipamentos:

- Próximos da devolução;
- Com devolução prevista para o dia;
- Atrasados.

---

### Gestão de suprimentos

A aplicação também possui controle de suprimentos utilizados pelo setor de TI.

Exemplos:

- Toners;
- Materiais de impressão;
- Consumíveis;
- Outros itens internos.

Para cada item podem ser controlados dados como:

- Quantidade atual;
- Quantidade mínima;
- Disponibilidade;
- Movimentações.

---

### Solicitação de suprimentos

Usuários podem solicitar itens disponíveis.

A equipe responsável pode:

- Aprovar;
- Recusar;
- Registrar o responsável pela decisão.

Quando aprovado, o estoque é atualizado conforme a quantidade solicitada.

---

### Controle de estoque mínimo

Cada item pode possuir um nível mínimo configurado.

Quando o estoque atinge um valor considerado crítico, o sistema pode identificar a necessidade de reposição.

---

### Monitoramento automático

A aplicação possui rotinas destinadas ao acompanhamento de informações relevantes.

Entre elas:

- Empréstimos próximos da devolução;
- Empréstimos vencidos;
- Estoque crítico;
- Necessidade de reposição.

---

### Notificações por e-mail

O projeto utiliza **Nodemailer** para envio de notificações.

As notificações podem estar relacionadas a:

- Novas solicitações;
- Aprovações;
- Recusas;
- Alterações;
- Devoluções;
- Equipamentos atrasados;
- Estoque crítico;
- Reposição de suprimentos.

---

### Exportação para Excel

A plataforma possui recursos para exportação de informações para arquivos `.xlsx`.

Podem ser exportados dados relacionados a:

- Empréstimos;
- Solicitações;
- Suprimentos;
- Informações administrativas.

A geração dos arquivos utiliza **Excel4Node**.

---

# Tecnologias utilizadas

## Backend

- Node.js
- Express.js

## Frontend

- EJS
- HTML5
- CSS3
- JavaScript

## Banco de dados

- MySQL
- MySQL2

## Dependências e bibliotecas

- Express
- EJS
- Express Session
- MySQL2
- Nodemailer
- Moment.js
- Excel4Node
- Node Cron

---

# Arquitetura atual

O projeto foi organizado utilizando conceitos inspirados no padrão **MVC — Model, View, Controller**.

```text
Kian_Inventario/
│
├── controllers/
│   ├── adminController.js
│   ├── homeController.js
│   ├── inventoryController.js
│   ├── loginController.js
│   └── registerController.js
│
├── resources/
│   ├── database.js
│   ├── dateUtils.js
│   ├── notice.js
│   └── spreadsheet_export.js
│
├── routes/
│   ├── adminRouter.js
│   ├── homeRouter.js
│   ├── inventoryRouter.js
│   ├── loginRouter.js
│   └── registerRouter.js
│
├── views/
│
├── public/
│
├── app.js
├── package.json
└── package-lock.json
```

A estrutura atual foi suficiente para atender ao objetivo inicial do projeto.

No entanto, com o crescimento da aplicação, algumas responsabilidades acabaram ficando concentradas em determinados arquivos e camadas.

Uma evolução futura deve buscar uma separação mais clara entre:

- Camada HTTP;
- Regras de negócio;
- Acesso ao banco;
- Serviços externos;
- Validações;
- Jobs;
- Notificações;
- Controle de permissões.

---

# Limitações atuais

O projeto foi desenvolvido priorizando a solução do problema existente naquele momento.

Por isso, existem pontos que precisam ser revistos antes de considerar a aplicação como uma solução madura ou preparada para maior escala.

Entre eles:

- Acoplamento entre algumas regras de negócio e controllers;
- Ausência de uma camada dedicada de services;
- Ausência de repositories;
- Validações que podem ser centralizadas;
- Tratamento de erros que pode ser melhorado;
- Gerenciamento de sessão que pode evoluir;
- Necessidade de melhorias na autenticação;
- Necessidade de revisão de segurança;
- Ausência de migrations estruturadas;
- Ausência de testes automatizados;
- Ausência de pipeline de CI/CD;
- Necessidade de melhor observabilidade;
- Necessidade de logs estruturados;
- Necessidade de trilha de auditoria;
- Possibilidade de melhorar a organização do banco de dados;
- Possibilidade de modernizar o frontend.

Essas limitações não impedem que o sistema cumpra sua função atual, mas representam pontos importantes para uma futura evolução.

---

# Evolução arquitetural

Uma das principais melhorias planejadas é a reorganização da arquitetura.

Uma possível estrutura seria:

```text
src/
│
├── config/
│
├── controllers/
│
├── middlewares/
│
├── routes/
│
├── services/
│
├── repositories/
│
├── models/
│
├── validators/
│
├── jobs/
│
├── utils/
│
└── views/
```

O fluxo poderia seguir:

```text
Request
   │
   ▼
Route
   │
   ▼
Middleware
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Database
```

Nesse modelo:

**Controllers** seriam responsáveis principalmente por receber e responder às requisições.

**Services** concentrariam as regras de negócio.

**Repositories** seriam responsáveis pelo acesso aos dados.

**Middlewares** tratariam autenticação, autorização, validações e outros comportamentos transversais.

**Jobs** concentrariam tarefas automáticas e agendadas.

Essa organização reduziria o acoplamento e facilitaria testes e manutenção.

---

# Melhorias planejadas

## Arquitetura

- [ ] Criar camada de Services;
- [ ] Criar camada de Repositories;
- [ ] Reduzir responsabilidades dos Controllers;
- [ ] Centralizar regras de negócio;
- [ ] Implementar tratamento global de exceções;
- [ ] Criar validações reutilizáveis;
- [ ] Reorganizar estrutura do projeto;
- [ ] Aplicar princípios SOLID onde fizer sentido.

## Segurança

- [ ] Migrar configurações sensíveis para `.env`;
- [ ] Implementar hash seguro de senhas;
- [ ] Revisar autenticação;
- [ ] Implementar autorização baseada em roles;
- [ ] Implementar Rate Limiting;
- [ ] Adicionar Helmet;
- [ ] Implementar proteção CSRF;
- [ ] Revisar cookies e sessões;
- [ ] Remover informações sensíveis do histórico do Git.

## Banco de dados

- [ ] Criar migrations;
- [ ] Criar seeds;
- [ ] Revisar relacionamentos;
- [ ] Criar constraints adequadas;
- [ ] Revisar índices;
- [ ] Padronizar consultas;
- [ ] Separar acesso ao banco das regras de negócio.

## Qualidade

- [ ] Implementar testes unitários;
- [ ] Implementar testes de integração;
- [ ] Criar testes end-to-end;
- [ ] Adicionar ESLint;
- [ ] Adicionar Prettier;
- [ ] Criar padrões de código;
- [ ] Automatizar validações através do CI.

## Infraestrutura

- [ ] Criar Dockerfile;
- [ ] Criar Docker Compose;
- [ ] Criar configuração separada por ambiente;
- [ ] Criar pipeline de CI/CD;
- [ ] Automatizar deploy;
- [ ] Criar health checks.

## Observabilidade

- [ ] Implementar logs estruturados;
- [ ] Criar registros de auditoria;
- [ ] Monitorar erros;
- [ ] Monitorar execução de jobs;
- [ ] Criar métricas da aplicação.

## Interface

- [ ] Modernizar a experiência do usuário;
- [ ] Melhorar responsividade;
- [ ] Criar dashboard;
- [ ] Adicionar indicadores;
- [ ] Melhorar pesquisas e filtros;
- [ ] Padronizar componentes visuais.

---

# Segurança

Informações sensíveis não devem permanecer diretamente no código-fonte.

É recomendado utilizar variáveis de ambiente.

Exemplo:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=kian_inventory
DB_USER=usuario
DB_PASSWORD=senha

SESSION_SECRET=altere-esta-chave

SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=email@empresa.com
SMTP_PASSWORD=senha
```

E no `.gitignore`:

```gitignore
node_modules/

.env
.env.*

logs/
```

Senhas de usuários também devem ser armazenadas utilizando algoritmos seguros de hash, como:

```text
bcrypt
```

ou:

```text
Argon2
```

---

# Contexto do desenvolvimento

O **Kian_Inventario não nasceu como um produto comercial ou como uma plataforma genérica de inventário**.

Ele foi desenvolvido para solucionar um problema específico encontrado no dia a dia da operação.

A prioridade inicial foi:

```text
Identificar o problema
        │
        ▼
Criar uma solução funcional
        │
        ▼
Colocar a solução em utilização
        │
        ▼
Validar o processo na prática
```

Essa abordagem permitiu transformar rapidamente uma necessidade operacional em uma aplicação funcional.

Ao mesmo tempo, isso significa que diversas decisões arquiteturais podem e devem ser revistas em uma futura versão.

O projeto representa, portanto, tanto uma solução utilizada em um cenário real quanto uma base para estudos e evolução em temas como:

- Arquitetura de software;
- Segurança;
- Design de APIs;
- Qualidade de código;
- Testes;
- Observabilidade;
- DevOps;
- Escalabilidade;
- Manutenibilidade.

---

# Aprendizados

O projeto permitiu trabalhar com conceitos como:

- Desenvolvimento backend com Node.js;
- Express;
- Aplicações server-side;
- EJS;
- MySQL;
- Modelagem de dados;
- Sessões;
- Autenticação;
- Fluxos de aprovação;
- Automação de processos;
- SMTP;
- Tarefas agendadas;
- Manipulação de datas;
- Exportação de dados;
- Resolução de problemas reais através de software.

Um dos principais aprendizados também foi perceber que **uma solução funcional não significa necessariamente uma solução arquiteturalmente madura**.

A evolução do projeto passa justamente por transformar uma implementação inicialmente orientada à resolução rápida do problema em uma aplicação mais organizada, segura, testável e sustentável.

---

# Status do projeto

```text
Status: funcional / em evolução
```

A aplicação foi utilizada para atender ao problema para o qual foi originalmente desenvolvida.

Atualmente, o projeto pode ser considerado uma **versão funcional inicial**, que serve como base para uma futura refatoração e evolução arquitetural.

```text
Problema real
     │
     ▼
Solução funcional
     │
     ▼
Validação no uso real
     │
     ▼
Refatoração
     │
     ▼
Melhoria arquitetural
     │
     ▼
Maior segurança
     │
     ▼
Maior manutenibilidade
```

---

# Autor

### Raphael Nunes

Desenvolvedor de Software e Analista de Sistemas, com atuação em desenvolvimento de soluções, automação de processos, integrações e infraestrutura tecnológica.

GitHub:

```text
https://github.com/phaaael
```

---

# Considerações finais

O **Kian_Inventario** demonstra a utilização do desenvolvimento de software para resolver uma necessidade concreta do ambiente corporativo.

Mais do que apresentar uma aplicação finalizada, o projeto também representa um processo de evolução técnica.

A primeira etapa foi resolver o problema.

A próxima é evoluir a solução.

O objetivo das futuras versões é melhorar progressivamente:

- Arquitetura;
- Segurança;
- Qualidade;
- Testabilidade;
- Observabilidade;
- Manutenção;
- Escalabilidade.

Dessa forma, o projeto deixa de ser apenas uma solução pontual e passa também a servir como base para aplicar boas práticas modernas de Engenharia de Software.
