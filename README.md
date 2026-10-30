# Move+ · Gestão Inteligente de Academias & Alta Performance

Sistema de agendamentos, matrículas, ocupação de turmas e controle de acesso com **identidade visual em Preto e Amarelo**, arquitetura fullstack moderna e proteção transacional contra *overbooking*.

---

## 🏗️ Arquitetura do Projeto

O ecossistema está organizado em **Back-end** e **Front-end**:

```
d:\move+\
├── frontend/                   # SPA React 18 + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/         # Button, Input, Badge, Navbar, DemoBar
│   │   ├── contexts/           # AuthContext (JWT, auto-login, demo switcher)
│   │   ├── pages/              # Login, Cadastro, GradeAulas, DetalhesAula, MeusAgendamentos
│   │   ├── services/           # Axios API Client com interceptors
│   │   └── types/              # Tipagens compartilhadas TypeScript
│   ├── tailwind.config.js      # Tokens de design Preto (#0A0A0A) & Amarelo (#FFD400)
│   └── vite.config.ts
├── backend/                    # API REST Node.js + Express + Prisma ORM
│   ├── prisma/
│   │   ├── schema.prisma       # Modelagem relacional completa
│   │   └── seed.ts             # Carga inicial com alunos, modalidades e turmas
│   ├── src/
│   │   ├── controllers/        # Auth (RF01/RF02), Aula (RF09), Agendamento (RF06/RF07/RF08)
│   │   ├── middlewares/        # JWT Authentication e RBAC (ALUNO / ADMIN)
│   │   └── index.ts            # Servidor Express na porta 3001
│   └── tsconfig.json
├── plano_implementacao_move_plus.md # Documento técnico de referência (Fases 0 a 4)
└── prints/                     # Protótipos visuais e PDF consolidado
```

---

## 🚀 Como Executar Localmente

### 1. Iniciar o Back-end
```bash
cd d:\move+\backend
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```
> O servidor iniciará em `http://localhost:3001` (API em `http://localhost:3001/api`).

### 2. Iniciar o Front-end
```bash
cd d:\move+\frontend
npm install
npm run dev
```
> Acesse no seu navegador em `http://localhost:5173`.

---

## 🎯 Entregas do MVP (Fase 1 — "A Fazer" no Trello)

| Requisito | Status | Implementação |
| :--- | :---: | :--- |
| **RF01 — Cadastro (AG)** | ✅ Concluído | Formulário com Zod, e-mail único, hash bcrypt e geração automática de matrícula ativa. |
| **RF02 — Login (AG)** | ✅ Concluído | Autenticação com JWT, rotas protegidas e interceptor Axios com persistência local. |
| **RF09 — Consulta de Horários e Vagas (PM)** | ✅ Concluído | Grade de aulas com filtro por modalidade, cálculo em tempo real de vagas e selos de ocupação. |
| **RF06 — Agendamento de Aula/Avaliação (PM)** | ✅ Concluído | Transação atômica (`prisma.$transaction`), prevenção de *overbooking*, bloqueio para inadimplentes e fila de espera automática com posição. |
| **RF07 — Cancelamento de Agendamento (PM)** | ✅ Concluído | Regra de trava mínima de 2 horas e promoção automática do primeiro aluno da fila de espera. |
| **RF08 — Meus Agendamentos (PM)** | ✅ Concluído | Tela de gestão com separação entre vagas confirmadas e inscrições em lista de espera. |

---

## 🎨 Identidade Visual & Design Tokens

- `--bg`: `#0A0A0A` (Fundo primário escuro)
- `--surface`: `#141414` / `#1C1C1C` (Cards, modais e containers)
- `--border`: `#2A2A2A` (Bordas e divisórias)
- `--primary`: `#FFD400` (Amarelo de ação e destaque, WCAG AA)
- `--on-primary`: `#0A0A0A` (Tipografia escura sobre amarelo)
- `--success`: `#22C55E` / `--danger`: `#EF4444` (Feedback operacional)
- **Tipografia**: *Bebas Neue* para títulos de impacto e *Inter* para o corpo de texto.
