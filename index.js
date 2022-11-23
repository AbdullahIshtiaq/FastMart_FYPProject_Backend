const express = require('express');

const cors = require('cors');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const dbConfig = require('./config/db.config');

const auth = require('./middlewares/auth');
const errors = require('./middlewares/error');

const swaggerUi = require('swagger-ui-express'), swaggerDocument = require('./swagger.json');

const unless = require('express-unless');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.DB_CONFIG.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true

}).then(
    () => {
        console.log('Database Connented');
    },

    (error) => {
        console.log(dbConfig.DB_CONFIG.db);
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cors());

app.use("/uploads", express.static("uploads"));

app.use('/users', require('./routes/users.routes.js'));
app.use('/categories', require('./routes/categories.routes'));
app.use('/products', require('./routes/products.routes'));
app.use('/orders', require('./routes/orders.routes'));
app.use('/cards', require('./routes/cards.routes'));
app.use('/admin', require('./routes/admin.routes'));
app.use('/demands', require('./routes/demands.routes'));
app.use('/sales', require('./routes/sales.routes'));
app.use('/notifications', require('./routes/push-notication.routes'));
app.use('/complaints', require('./routes/complaints.routes'));

app.use(errors.errorHandler);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.port || 4000, function () {
    console.log('Ready to Go!')
})

