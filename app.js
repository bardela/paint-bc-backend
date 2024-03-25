const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

const { PAINTS, USERS } = require("./data/data");
require('./routes/usersRoutes')(app, USERS);
require('./routes/paintsRoutes')(app, PAINTS);
require('./routes/othersRoutes')(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
})