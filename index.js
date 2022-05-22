const express = require('express');

const mongoose = require('mongoose');
const dbConfig = require('./config/db.config');

const auth = require('./middlewares/auth');
const errors = require('./middlewares/error');

const swaggerUi = require('swagger-ui-express'), swaggerDocument = require('./swagger.json');

const unless = require('express-unless');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true

}).then(
    () => {
        console.log('Database Connented');
    },
    (error) => {
        console.log('Database Not Connented: ' + error);
    }

);

// auth.authenticateToken.unless = unless;
// app.use(
//     auth.authenticateToken.unless({
//         path: [
//             { url: "/users/login", methods: ["POST"] },
//             { url: "/users/register", methods: ["POST"] }
//         ]
//     })
// )


app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use('/users', require('./routes/users.routes.js'));
app.use('/categories', require('./routes/categories.routes'));

app.use(errors.errorHandler);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.port || 4000, function () {
    console.log('Ready to Go!')
})

