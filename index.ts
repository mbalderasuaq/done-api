import express from "express";
import { TaskRouter } from "./routes/task.route";
import swaggerUi  from "swagger-ui-express";
import swaggerSpec from "./swagger.json";

const app = express();

app.use(express.json());

app.use("/tasks", TaskRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});