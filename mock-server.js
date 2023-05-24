const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const middlewares = jsonServer.defaults();
const payload = { foo: "bar" };
const SECRET = "83e06176-fb12-420d-9606-75d51239923d";
// This login and password mechanism only dummy and only for the demo
const saltRounds = 11;  

server.use(middlewares);

server.use((req, res, next) => {
  if (req.url === "/login" || req.url === "/registration" || /^\/items\/\d+/.test(req.url) || req.url === "/items" || req.method === "PUT" || req.url === "/orders") {
    return next();
  }
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
});

server.use(jsonServer.bodyParser);

server.post("/registration", (req, res) => {
  const { username, email, password, fullName, city, postcode, adress } = req.body;

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      console.log("Salt: ", salt);
      return bcrypt.hash(password, salt);
    })
    .then((hash) => {
      const db = router.db.value();
      if (db.users.find((item) => item.email === email)) {
        return res.status(409).send({
          errorMessage:
            "This username already exists. Please choose another one. ",
        });
      }
      db.users.push({username, email, hash, fullName, city, postcode, adress });
      router.db.write();
      return res.send({ result: "OK" });
    })
    .catch((err) => console.error(err.message));
});

server.post("/login", (req, res) => {
  const { email, password } = req.body;

  const db = router.db.value();
  const user = db.users.find((item) => item.email === email);
  if (user && user.role === "admin") {
    validateUser(user.hash, password).then((valid) => {
      if (!valid) {
        return res.status(422).send({
          errorMessage: "Wrong credentials"
        })
      }
      let token;
      token = jwt.sign(
        {email: user.email, username: user.username, role: "admin"},
        SECRET
      )
      return res.send({token})
    })
  } else if (user) {
    validateUser(user.hash, password).then((valid) => {
      if (!valid) {
        return res.status(422).send({
          errorMessage: "Wrong credentials",
        });
      }
      let token;
        token = jwt.sign(
          { username: user.username, email:user.email, role: "regular", fullName: user.fullName, city: user.city, postcode: user.postcode, adress: user.adress },
          SECRET
        );
      return res.send({ token });
    });
  } else {
    return res.status(422).send({
      errorMessage: "Wrong credentials",
    });
  }
}
);

server.post("/orders", (req, res) => {
  const orderData = req.body;
  const db = router.db.value()
  db.orders.push(orderData)
  router.db.write();
  return res.send({ orderData });
})

server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});

function validateUser(hash, password) {
  return bcrypt.compare(password, hash).then((res) => {
    return res;
  });
}
