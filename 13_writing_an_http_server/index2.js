import express from "express";
const app = express();
const PORT = 3001;

app.get("/", (req, res) => {
  res.send("get request ");
});
app.post("/user", (req, res) => {
  res.send("post /user request ");
});
app.post("/", (req, res) => {
  res.send("post request ");
});
app.put("/", (req, res) => {
  res.send("put request ");
});

app.listen(PORT, () => {
  console.log(`App is listening on PORT ${PORT}`);
});
