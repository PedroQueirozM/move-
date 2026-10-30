"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aula_controller_1 = require("../controllers/aula.controller");
const router = (0, express_1.Router)();
// Permite listar mesmo sem auth, mas se houver token identifica status do aluno
router.get('/', aula_controller_1.listAulas);
router.get('/:id', aula_controller_1.getAulaById);
exports.default = router;
