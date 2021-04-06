import express, { Application as ExpressApp } from "express";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import { serve, setup } from "swagger-ui-express";
import morgan from "morgan";

import "dotenv/config";

import { GithubStrategy } from "./services/github";
import { controllers } from "./controllers";
import { swaggerJSON } from "../documentation/swagger";

const app: ExpressApp = express();

app.use(morgan("combined"));
app.use(cors({ origin: "*" }));

app.use("/docs", serve, setup(swaggerJSON));

app.use(
  session({
    name: "web3hub",
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use("/", controllers);
passport.use(GithubStrategy);

export { app };