// Instance to connect to test db
const knex = require('knex');
// Testing functions in app
const app = require('../src/app');
// Load data for test db
const {makeData} = require('./bookmarks.fixtures');

describe('App', () => {
  // Declares variable for db
  let db;
  // Instantiates variable for db
  before('Connects to db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    // set db for app
    app.set('db',db);
  });
  before('Cleans db before testing', () => db('bookmarks').truncate());
  afterEach('Cleans db again after each', () => db('bookmarks').truncate());
  // Destroys connection
  after('Disconnects the db', () => db.destroy());

  context('Given db has data', () => {
    // Creates data
    const testBookmarks = makeData();
    // Insert data before each test
    beforeEach('Insert data', () => db.insert(testBookmarks).into('bookmarks'));

    // ------- Test 1
    it('GET /bookmarks should expect 200', () => {
      return supertest(app)
        .get('/bookmarks')
        .expect(200, testBookmarks);
    });
    // ------- Test 2
    it('GET /bookmarks/:id should expect 200', () => {
      const id = 2;
      const testBookmark = testBookmarks[id-1];
      return supertest(app)
        .get(`/bookmarks/${id}`)
        .expect(200, testBookmark);
    });
    // ------- Test 3

  });


  context('Given db has no data', () => {
    // ------- Test 4
    it('GET /bookmarks should expect empty []', () => {
      return supertest(app)
        .get('/bookmarks')
        .expect(200, []);
    });
    // ------- Test 5
    it.skip('POST /bookmarks should expect 201', () => {
      const newBookmark = {
        title: 'Amazon',
        url: 'https://www.amazon.com',
        description: 'Favorite shopping site',
        rating: '2'
      };
      return supertest(app)
        .post('/bookmarks')
        .send(newBookmark)
        .expect(201)
        .expect(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.title).to.eql(newBookmark.title);
          expect(res.body.url).to.eql(newBookmark.url);
          expect(res.body.description).to.eql(newBookmark.description);
          expect(res.header.location).to.eql(`/bookmarks/${res.body.id}`);

          return db('bookmarks')
            .select('*')
            .where({id: res.body.id})
            .first()
            .then(savedItem => expect(savedItem).to.exist);
        })
        .then(posted => 
          supertest(app)
          .get(`/bookmarks/${posted.body.id}`)
          .expect(posted.body));
    });
  });
});