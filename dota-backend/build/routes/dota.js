"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dota_1 = require("../handlers/dota");
const DotaRouter = (0, express_1.Router)();
const dotaHandler = new dota_1.DotaHandler();
DotaRouter.get('/:id', dotaHandler.show);
exports.default = DotaRouter;
