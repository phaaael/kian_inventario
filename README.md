# Kian_Inventario

Sistema web para **gestão de equipamentos, empréstimos e suprimentos de TI**, desenvolvido para centralizar e organizar processos internos relacionados ao controle de ativos, solicitações, devoluções e estoque.

O projeto surgiu a partir de uma necessidade real do ambiente corporativo, com o objetivo de substituir controles manuais por um fluxo digital mais estruturado, rastreável e eficiente.

---

## Sobre o projeto

O **Kian_Inventario** permite que usuários solicitem equipamentos e suprimentos diretamente pela plataforma, enquanto a equipe responsável realiza a análise, aprovação, recusa e acompanhamento de cada solicitação.

Além do gerenciamento de empréstimos, a aplicação possui controle de estoque, monitoramento de devoluções, notificações por e-mail e exportação de informações para Excel.

O sistema foi desenvolvido com foco em:

- Centralização das informações;
- Rastreabilidade das movimentações;
- Organização do estoque de TI;
- Controle de equipamentos emprestados;
- Redução de controles manuais;
- Padronização das solicitações;
- Maior visibilidade sobre ativos e suprimentos;
- Automação de alertas e notificações.

---

## Funcionalidades

### Autenticação de usuários

A aplicação possui sistema de autenticação para controle de acesso.

Os usuários podem acessar funcionalidades de acordo com suas permissões dentro da plataforma.

O sistema diferencia operações administrativas das funcionalidades disponíveis para usuários comuns.

---

## Gestão de equipamentos

O sistema permite o gerenciamento dos equipamentos disponibilizados pela área de TI.

Cada equipamento pode possuir informações como:

- Nome;
- Código de identificação;
- Situação;
- Disponibilidade;
- Responsável atual;
- Histórico de utilização.

Os equipamentos disponíveis podem ser solicitados através da própria plataforma.

Quando existe uma solicitação ou empréstimo ativo, a disponibilidade do equipamento é atualizada de acordo com o fluxo da operação.

---

## Solicitação de equipamentos

Os usuários podem realizar solicitações de empréstimo através da aplicação.

Cada solicitação pode conter informações como:

- Usuário solicitante;
- Equipamento;
- Código do equipamento;
- Data da solicitação;
- Motivo;
- Data prevista para devolução.

Após o envio, a solicitação fica disponível para análise administrativa.

---

## Aprovação de empréstimos

A equipe responsável pode analisar as solicitações realizadas pelos usuários.

As solicitações podem ser:

- Aprovadas;
- Recusadas;
- Alteradas;
- Finalizadas.

Em caso de recusa, também é possível registrar o motivo da decisão.

Quando uma solicitação é aprovada, o sistema registra o empréstimo e atualiza o estado do equipamento.

---

## Controle de devoluções

O sistema mantém o acompanhamento dos equipamentos emprestados.

É possível controlar:

- Data do empréstimo;
- Usuário responsável;
- Data prevista para devolução;
- Status da devolução;
- Equipamentos em atraso;
- Equipamentos próximos do vencimento.

Após a devolução, o equipamento pode voltar a ficar disponível para novas solicitações.

---

## Gestão de suprimentos

Além dos equipamentos, o **Kian_Inventario** também permite controlar materiais consumíveis utilizados pelo setor de TI.

Exemplos:

- Toners;
- Materiais de impressão;
- Consumíveis;
- Outros suprimentos internos.

Cada item pode possuir informações como:

- Nome;
- Quantidade atual;
- Quantidade mínima;
- Disponibilidade;
- Histórico de movimentação.

---

## Solicitação de suprimentos

Usuários podem solicitar materiais disponíveis através da plataforma.

A equipe responsável pode posteriormente:

- Analisar a solicitação;
- Aprovar;
- Recusar;
- Registrar o responsável pela decisão.

Quando uma solicitação é aprovada, a quantidade correspondente é descontada automaticamente do estoque.

---

## Controle de estoque mínimo

Os suprimentos podem possuir uma quantidade mínima configurada.

Quando determinado item atinge ou fica abaixo do nível considerado crítico, o sistema consegue identificar a necessidade de reposição.

Esse controle permite que a equipe responsável atue preventivamente, reduzindo o risco de indisponibilidade de materiais essenciais.

---

## Monitoramento automático

O sistema possui rotinas responsáveis pelo acompanhamento periódico de informações importantes.

Entre elas estão verificações relacionadas a:

- Equipamentos próximos da devolução;
- Equipamentos com devolução prevista para o dia;
- Empréstimos atrasados;
- Estoque crítico;
- Necessidade de reposição de suprimentos.

Essas rotinas ajudam a reduzir a dependência de verificações manuais.

---

## Notificações por e-mail

O projeto utiliza **Nodemailer** para envio de notificações.

O sistema pode trabalhar com mensagens relacionadas a eventos como:

- Nova solicitação;
- Solicitação aprovada;
- Solicitação recusada;
- Alteração de empréstimo;
- Confirmação de devolução;
- Proximidade da data de devolução;
- Empréstimo em atraso;
- Estoque crítico;
- Necessidade de reposição.

Essa funcionalidade melhora a comunicação entre usuários e equipe responsável.

---

## Exportação de dados

A aplicação possui recursos para exportação de informações para arquivos Excel.

Os arquivos são gerados no formato:

```text
.xlsx
```

A funcionalidade pode ser utilizada para exportar informações como:

- Histórico de empréstimos;
- Solicitações;
- Solicitações de suprimentos;
- Dados administrativos.

A geração das planilhas é realizada através da biblioteca **Excel4Node**.

---

# Fluxo de empréstimo

O fluxo principal de empréstimo funciona da seguinte maneira:

```text
Usuário
   │
   ▼
Seleciona um equipamento
   │
   ▼
Realiza uma solicitação
   │
   ▼
Solicitação pendente
   │
   ▼
Equipe responsável analisa
   │
   ├──────────────► Recusada
   │
   ▼
Aprovada
   │
   ▼
Empréstimo registrado
   │
   ▼
Equipamento em utilização
   │
   ▼
Devolução
   │
   ▼
Empréstimo finalizado
   │
   ▼
Equipamento disponível
```

---

# Fluxo de suprimentos

```text
Usuário
   │
   ▼
Seleciona um suprimento
   │
   ▼
Realiza uma solicitação
   │
   ▼
Equipe responsável analisa
   │
   ├──────────────► Recusada
   │
   ▼
Aprovada
   │
   ▼
Baixa automática no estoque
   │
   ▼
Verificação do estoque mínimo
   │
   ├──── Estoque normal
   │
   └──── Estoque crítico
             │
             ▼
      Processo de reposição
```

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

## Bibliotecas e dependências

- Express
- EJS
- Express Session
- MySQL2
- Nodemailer
- Moment.js
- Excel4Node
- Node Cron

---

# Arquitetura

O projeto possui uma organização inspirada no padrão **MVC — Model, View, Controller**, separando responsabilidades e facilitando a manutenção da aplicação.

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
│   ├── admin/
│   ├── inventory/
│   └── ...
│
├── public/
│
├── app.js
├── package.json
└── package-lock.json
```

---

## Controllers

A camada de controllers concentra parte das regras de negócio responsáveis pelo processamento das requisições recebidas pela aplicação.

Exemplos:

```text
adminController.js
inventoryController.js
loginController.js
```

---

## Routes

As rotas definem os endpoints HTTP disponíveis na aplicação e direcionam as requisições para seus respectivos controllers.

Exemplos:

```text
adminRouter.js
inventoryRouter.js
loginRouter.js
```

---

## Views

As interfaces são renderizadas no servidor utilizando **EJS**.

As views são responsáveis pela apresentação das informações para os usuários e administradores.

---

## Resources

O diretório `resources` concentra funcionalidades auxiliares utilizadas pelo restante da aplicação.

Entre elas estão:

- Conexão com banco de dados;
- Manipulação de datas;
- Envio de notificações;
- Geração de planilhas.

---

# Banco de dados

A aplicação utiliza **MySQL** como banco de dados relacional.

Entre as principais estruturas utilizadas pelo projeto estão entidades responsáveis pelo gerenciamento de:

```text
Usuários
Equipamentos
Suprimentos
Solicitações
Empréstimos
Requisições de suprimentos
```

Na implementação atual, são utilizadas estruturas como:

```text
kian_usuarios
kian_equipamentos
kian_suprimentos
kian_solicitacoes
kian_emprestimos
kian_reqsuprimentos
```

---

# Requisitos

Para executar o projeto localmente é necessário possuir:

- Node.js;
- NPM;
- MySQL;
- Git;
- Banco de dados configurado.

---

# Instalação

Clone o repositório:

```bash
git clone https://github.com/phaaael/kian_inventory.git
```

Entre no diretório:

```bash
cd kian_inventory
```

Instale as dependências:

```bash
npm install
```

Configure o banco de dados e as variáveis necessárias para execução.

Depois, inicie a aplicação:

```bash
node app.js
```

A aplicação poderá ser acessada através de:

```text
http://localhost:3000
```

---

# Configuração através de variáveis de ambiente

Informações sensíveis não devem ser armazenadas diretamente no código-fonte.

A abordagem recomendada é utilizar um arquivo:

```text
.env
```

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

Também é recomendado adicionar ao `.gitignore`:

```gitignore
node_modules/

.env
.env.*

logs/

.DS_Store
```

---

# Segurança

Como se trata de uma aplicação que manipula autenticação e informações corporativas, alguns cuidados são importantes.

## Credenciais

Nunca devem ser versionadas informações como:

- Senhas;
- Credenciais do banco;
- Credenciais SMTP;
- Tokens;
- Chaves de sessão;
- API Keys.

Essas informações devem utilizar variáveis de ambiente.

---

## Senhas de usuários

As senhas nunca devem ser armazenadas em texto puro.

A implementação recomendada utiliza algoritmos de hash seguros, como:

```text
bcrypt
```

ou:

```text
Argon2
```

---

## Sessões

Em produção, é recomendado utilizar um armazenamento persistente para as sessões.

Também devem ser configuradas opções de segurança para os cookies, como:

```text
httpOnly
secure
sameSite
```

---

## HTTPS

Para ambientes de produção, a aplicação deve ser disponibilizada exclusivamente através de HTTPS.

---

# Melhorias futuras

O projeto pode continuar evoluindo através da implementação de funcionalidades e melhorias arquiteturais.

### Segurança

- [ ] Migrar todas as credenciais para `.env`;
- [ ] Implementar hash de senhas;
- [ ] Adicionar Helmet;
- [ ] Implementar Rate Limiting;
- [ ] Implementar proteção CSRF;
- [ ] Melhorar gerenciamento de sessão;
- [ ] Implementar política de senha.

### Arquitetura

- [ ] Separar completamente regras de negócio da camada HTTP;
- [ ] Implementar camada de Services;
- [ ] Implementar camada de Repositories;
- [ ] Criar tratamento centralizado de erros;
- [ ] Implementar validação de dados;
- [ ] Criar migrations do banco;
- [ ] Criar seed de desenvolvimento.

### Controle de acesso

- [ ] Implementar RBAC;
- [ ] Criar diferentes níveis de permissão;
- [ ] Melhorar middleware de autenticação;
- [ ] Criar trilha de auditoria.

### Observabilidade

- [ ] Implementar logs estruturados;
- [ ] Registrar operações administrativas;
- [ ] Criar histórico completo de alterações;
- [ ] Implementar monitoramento da aplicação.

### Interface

- [ ] Modernizar o frontend;
- [ ] Melhorar responsividade;
- [ ] Criar dashboard administrativo;
- [ ] Criar indicadores visuais;
- [ ] Adicionar filtros e pesquisas avançadas.

### Infraestrutura

- [ ] Criar Dockerfile;
- [ ] Criar Docker Compose;
- [ ] Automatizar inicialização do banco;
- [ ] Criar ambiente separado de desenvolvimento;
- [ ] Implementar CI/CD;
- [ ] Automatizar testes durante o deploy.

### Qualidade

- [ ] Criar testes unitários;
- [ ] Criar testes de integração;
- [ ] Criar testes end-to-end;
- [ ] Adicionar ESLint;
- [ ] Adicionar Prettier;
- [ ] Implementar validação automática em Pull Requests.

---

# Possível evolução arquitetural

Uma evolução futura do projeto poderia utilizar uma arquitetura semelhante a:

```text
src/
│
├── config/
│
├── controllers/
│
├── middlewares/
│
├── models/
│
├── repositories/
│
├── routes/
│
├── services/
│
├── jobs/
│
├── utils/
│
└── views/
```

Fluxo:

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
MySQL
```

Essa abordagem permitiria uma separação maior de responsabilidades e facilitaria testes, manutenção e evolução da aplicação.

---

# Motivação

O **Kian_Inventario** foi desenvolvido a partir de uma necessidade real encontrada no ambiente corporativo.

O gerenciamento de equipamentos e materiais de TI pode rapidamente se tornar complexo quando realizado através de planilhas, mensagens, e-mails ou controles paralelos.

O projeto busca centralizar esse processo dentro de uma única aplicação.

Com isso, torna-se possível identificar com maior facilidade:

```text
Quem solicitou?
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
O equipamento foi devolvido?
        │
        ▼
Qual é a quantidade disponível?
```

Além de melhorar o processo operacional, a aplicação fornece maior rastreabilidade e organização das informações.

---

# Aprendizados

O desenvolvimento deste projeto envolve conceitos importantes de desenvolvimento de software, incluindo:

- Desenvolvimento backend com Node.js;
- Construção de aplicações web com Express;
- Renderização server-side com EJS;
- Modelagem de banco de dados relacional;
- Integração com MySQL;
- Controle de sessões;
- Autenticação;
- Controle de permissões;
- Integração SMTP;
- Manipulação de datas;
- Execução de tarefas agendadas;
- Geração de arquivos Excel;
- Organização de aplicações utilizando conceitos de MVC;
- Automação de processos corporativos;
- Desenvolvimento orientado à resolução de problemas reais.

---

# Contexto corporativo

O projeto foi originalmente criado para auxiliar processos internos relacionados ao gerenciamento de recursos de Tecnologia da Informação.

Por esse motivo, informações sensíveis relacionadas à infraestrutura, usuários, banco de dados, credenciais ou ambiente corporativo não devem fazer parte do repositório público.

O código disponibilizado deve conter apenas as informações necessárias para demonstrar a arquitetura, funcionalidades e conceitos utilizados no desenvolvimento.

---

# Autor

### Raphael Nunes

Desenvolvedor de Software e Analista de Sistemas, com atuação em desenvolvimento de soluções, automação de processos, integrações e infraestrutura tecnológica.

GitHub:

```text
https://github.com/phaaael
```

---

# Licença

O projeto utiliza atualmente a licença definida no arquivo `package.json`.

Caso o projeto permaneça disponível publicamente, recomenda-se adicionar um arquivo `LICENSE` específico ao repositório.

---

# Status do projeto

```text
Projeto funcional
│
├── Gestão de usuários
├── Gestão de equipamentos
├── Controle de empréstimos
├── Gestão de suprimentos
├── Controle de estoque
├── Fluxo de aprovação
├── Notificações
└── Exportação de dados
```

O projeto continua disponível para evolução arquitetural, melhorias de segurança e modernização da experiência do usuário.

---

## Kian_Inventario

**Transformando o controle de ativos e suprimentos de TI em um processo centralizado, rastreável e eficiente.**
