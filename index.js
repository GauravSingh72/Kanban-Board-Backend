const express = require("express");
const { connection } = require("./Config/db");
const { userRouter } = require("./Routes/user.route");
const app = express();
var cors = require("cors");
const { boardRouter } = require("./Routes/board.route");
const { Auth } = require("./Middleware/Auth.middleware");
require("dotenv").config();

app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;

app.use("/", userRouter);
app.use(Auth);
app.use("/board", boardRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log(error.message);
  }

  console.log(`listening on port ${PORT}`);
});
