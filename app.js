require("dotenv").config();
const Express = require("express");

const dbConnection = require('./db');
const app = Express();
const bodyParser = require('body-parser');

const middleware = require("./middleware")
app.use(Express.json())
//app.use tells us we wnat the middleware to be global
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require("./middleware/headers"));
app.use(Express.json());

const controllers = require('./controllers');

app.use('/', controllers.usercontroller)
app.use('/admin', controllers.admincontroller)
app.use('/review', controllers.reviewcontroller)
app.use('/product', controllers.productscontroller)
// app.use(middleware.userRole)
app.use(middleware.validateSession)

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[Server]: App is listening on ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(`[Server]: server crashed. Error = ${err}`)
    })
// dbConnection.authenticate()
//     .then(() => dbConnection.sync({ force: true }))
//     .then(() => {
//         app.listen(process.env.PORT, () => {
//             console.log(`[Server]: App is listening on ${process.env.PORT}`);
//         })
//     })
//     .catch((err) => {
//         console.log(`[Server]: server crashed. Error = ${err}`)
//     })

