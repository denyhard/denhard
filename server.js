const express = require("express");
const bodyParser = require("body-parser");
// const { userRoutes, journalRoutes } = require('./routes');
const userRoutes = require("./routes/userRoutes");
const journalRoutes = require("./routes/journalRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/api/users", userRoutes);
app.use("/api/journals", journalRoutes);

app.use(express.static("public"));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
