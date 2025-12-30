import { Server } from "./app/server";
import { config } from "dotenv";

config();

new Server().start().catch(handleError);

function handleError(error: unknown) {
  console.error(error);
  process.exit(1);
}

process.on("uncaughtException", handleError);
