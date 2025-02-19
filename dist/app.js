"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
require("./database/connection");
const auth_1 = __importDefault(require("./routes/auth"));
const packages_1 = __importDefault(require("./routes/packages"));
const users_1 = __importDefault(require("./routes/users"));
const healthCheck_1 = __importDefault(require("./routes/healthCheck"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_PORT,
    methods: ["GET, POST", "DELETE"],
    credentials: true,
}));
app.use("/auth", auth_1.default);
app.use("/packages", packages_1.default);
app.use("/users", users_1.default);
app.use("/health-check", healthCheck_1.default);
app.use((_, __, next) => {
    next((0, http_errors_1.default)(404));
});
app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});
exports.default = app;
