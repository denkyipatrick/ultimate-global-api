

const cors = require('cors');
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.set("port", process.env.NODE_PORT);
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	console.log(req.url, req.method);
	next();
});

require("./routes/admin.routes")(app);
require("./routes/message.routes")(app);
require("./routes/distributor.routes")(app);
require("./routes/notification.routes")(app);
require("./routes/distributorlevel.routes")(app);
require("./routes/distributorwallet.routes")(app);
require("./routes/wallettransaction.routes")(app);

app.listen(app.get("port"), () => {
	console.log(`MLM API running on ${app.get("port")}`);
});
