const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const resources = require("./routes/api/resources");
const categories = require("./routes/api/categories");
const users = require("./routes/api/users");
const products = require("./routes/api/products");
const invoices = require("./routes/api/invoices");

const app = express();
app.use(bodyParser.json());
const db = require("./config/key").mongoURL;

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDb Connect"))
  .catch(err => console.log(err));

app.use("/api/presentation", resources);
app.use("/api/categories", categories);
app.use("/api/users", users);
app.use("/api/products", products);
app.use("/api/invoices", invoices);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`App start in port ${port}`));
