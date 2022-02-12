const express = require("express");
require("./db/mongoose");
const userRoute = require("./routers/user");
const taskRoute = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRoute);
app.use(taskRoute);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

  
