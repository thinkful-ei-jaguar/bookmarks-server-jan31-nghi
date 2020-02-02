const knex = require('knex');
const app = require('./app');
const { PORT , DB_URL } = require('./config');

// Instantiate knex object
const db = knex({
    client: 'pg',
    connection: DB_URL
});

// Inject db into app as a property
app.set('db', db);

app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));