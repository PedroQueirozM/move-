"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const aula_routes_1 = __importDefault(require("./routes/aula.routes"));
const agendamento_routes_1 = __importDefault(require("./routes/agendamento.routes"));
const modalidade_routes_1 = __importDefault(require("./routes/modalidade.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));
app.use(express_1.default.json());
// Rotas da API
app.use('/api/auth', auth_routes_1.default);
app.use('/api/aulas', aula_routes_1.default);
app.use('/api/agendamentos', agendamento_routes_1.default);
app.use('/api/modalidades', modalidade_routes_1.default);
// Health check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'online',
        app: 'Move+ API',
        timestamp: new Date().toISOString()
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Move+ Backend rodando com sucesso na porta ${PORT}`);
    console.log(`📡 URL base: http://localhost:${PORT}/api`);
});
exports.default = app;
