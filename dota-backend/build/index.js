"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes/routes"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
const address = "http://localhost:3000";
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)('tiny'));
app.use('/api', routes_1.default);
app.get('/', function (req, res) {
    res.redirect('/api');
});
app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});
exports.default = app;
