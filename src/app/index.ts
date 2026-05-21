
import express from "express";
import type { Express } from "express";
import { Request, Response } from "express";
import cors from "cors";


export function createExpressApp(): Express {
   
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.get("/", (Req: Request, res: Response) => {
        res.send("Hello World!");
    });
    return app;
}


// this is my Express file //