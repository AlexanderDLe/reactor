"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = require("./routes/auth");
var app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.use(auth_1.router);
app.listen(3000, function () { return console.log('Listening on port 3000'); });
