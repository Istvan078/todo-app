"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// Peladnyositani az express appot
const app = (0, express_1.default)();
dotenv_1.default.config();
// Meghatarozni szerver portot
const port = process.env.PORT;
// Csinalni egy alapertelmezett route-ot
app.get("/", (req, res) => {
    res.send("Express + Tyscript server");
});
// Elkezdeni hallgatni a kereseket a meghatarozott porton
app.listen(port);
