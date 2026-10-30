"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const modalidade_controller_1 = require("../controllers/modalidade.controller");
const router = (0, express_1.Router)();
router.get('/', modalidade_controller_1.listModalidades);
exports.default = router;
