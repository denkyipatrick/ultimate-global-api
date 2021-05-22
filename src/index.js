'use strict';

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const https = require('https');

const app = express();

app.use(cors());
app.use(express.json());
app.disable('x-powered-by');
app.set('port', process.env.NODE_PORT);

require("./routes/admin.routes")(app);
require("./routes/message.routes")(app);
require("./routes/adminnews.routes")(app);
require("./routes/distributor.routes")(app);
require("./routes/notification.routes")(app);
require("./routes/distributorlevel.routes")(app);
require("./routes/distributorwallet.routes")(app);
require("./routes/wallettransaction.routes")(app);

if (process.env.USE_HTTPS.indexOf('yes') > -1) {
	https.createServer({
	  key: fs.readFileSync('./ssl/lollandscreditunion_com.key'),
	  cert: fs.readFileSync('./ssl/lollandscreditunion_com.crt'),
	  ca: fs.readFileSync('./ssl/lollandscreditunion_com.ca-bundle'),
	}, app).listen(app.get('port'), () => {
	  console.log(`MLM server running securely on ${app.get('port')}`);
	});
} else {
	app.listen(app.get("port"), () => {
		console.log(`MLM API running on ${app.get("port")}`);
	});
}
