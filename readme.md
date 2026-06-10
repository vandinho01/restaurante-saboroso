# Restaurante Saboroso

Sistema de gestão para restaurante desenvolvido com Node.js, incluindo painel administrativo, gerenciamento de reservas, menus, contatos e notificações em tempo real.

## Tecnologias

- **Node.js** — ambiente de execução JavaScript no backend
- **Express** — framework para criação do servidor
- **MySQL2** — cliente MySQL com suporte a Promises
- **Socket.io** — comunicação em tempo real
- **Redis** — gerenciamento de sessões com connect-redis
- **EJS** — motor de templates para renderização dinâmica
- **Formidable** — processamento de upload de arquivos
- **Moment.js** — manipulação de datas e horários
- **Axios** — requisições HTTP assíncronas
- **SweetAlert2** — alertas customizados no frontend

## Requisitos

- Node.js 18+
- MySQL
- Redis

## Instalação

```bash
git clone https://github.com/DevPatriick/Projeto_Restaurante_Saboroso
cd Projeto_Restaurante_Saboroso
npm install
```

Configure as variáveis de ambiente criando um arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=saboroso
SESSION_SECRET=sua_chave_secreta
REDIS_HOST=localhost
REDIS_PORT=6379
```

Inicie o servidor:

```bash
npm start
```

Acesse em `http://localhost:3000`.

## Estrutura do Projeto

```
├── bin/                  # Scripts de inicialização
├── inc/                  # Módulos internos (models, paginação)
├── public/               # Arquivos estáticos
│   ├── admin/            # Assets do painel administrativo
│   ├── css/              # Estilos
│   ├── images/           # Imagens
│   └── js/               # Scripts JavaScript
├── routes/               # Definição de rotas
│   ├── admin.js          # Rotas do painel administrativo
│   └── index.js          # Rotas públicas
├── views/                # Templates EJS
│   ├── admin/            # Views do painel administrativo
│   └── inc/              # Componentes reutilizáveis
├── app.js                # Arquivo principal
└── package.json
```

## Rotas Públicas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Página inicial com listagem de menus |
| GET | `/menus` | Página de menus |
| GET | `/contacts` | Formulário de contato |
| POST | `/contacts` | Envio de contato |
| GET | `/reservations` | Formulário de reservas |
| POST | `/reservations` | Criação de reserva |
| GET | `/services` | Página de serviços |
| POST | `/subscribe` | Cadastro de e-mail |

## Rotas Administrativas

Todas as rotas abaixo requerem autenticação. Usuários não autenticados são redirecionados para `/admin/login`.

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/admin/login` | Página de login |
| POST | `/admin/login` | Autenticação |
| GET | `/admin/logout` | Encerramento de sessão |

### Dashboard

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/admin/` | Dashboard com totais |
| GET | `/admin/dashboard` | Dados do dashboard em JSON |

### Usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/admin/users` | Listagem de usuários |
| POST | `/admin/users` | Criação ou atualização de usuário |
| POST | `/admin/users/password-change` | Alteração de senha |
| DELETE | `/admin/users/:id` | Remoção de usuário |

### Menus

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/admin/menus` | Listagem de menus |
| POST | `/admin/menus` | Criação ou atualização de menu |
| DELETE | `/admin/menus/:id` | Remoção de menu |

### Reservas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/admin/reservations` | Listagem com filtro por período |
| POST | `/admin/reservations` | Criação ou atualização de reserva |
| DELETE | `/admin/reservations/:id` | Remoção de reserva |
| GET | `/admin/reservations/chart` | Dados para gráfico |

### Contatos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/admin/contacts` | Listagem de contatos |
| DELETE | `/admin/contacts/:id` | Remoção de contato |

### E-mails

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/admin/emails` | Listagem de e-mails cadastrados |
| DELETE | `/admin/emails/:id` | Remoção de e-mail |

## Funcionalidades

- Gerenciamento completo de menus com upload de imagens
- Sistema de reservas com filtro por período e gráfico de acompanhamento
- Notificações em tempo real via Socket.io ao receber contatos e reservas
- Paginação de listagens
- Controle de sessão com Redis
- Painel administrativo com dashboard de totais
