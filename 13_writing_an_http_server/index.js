// http module can help to create an http server
import http from "http";

// 1. we would like to setup a basic http server

const PORT = 3000; // we defined a variable to store the value of PORT

const server = http.createServer(async (req, res) => {
  // whenever any request hits to my server , this function will be called

  if (req.method == "GET") {
    res.end("get req recieved");
  } else if (req.method == "POST") {
    res.end("post req recieved");
  } else {
    res.end("hello");
  }
}); // creating a new server instance but it is not running

server.listen(PORT, () => {
  // this function will be called when the server is started
  console.log(`Server is running on PORT ${PORT}`);
});
