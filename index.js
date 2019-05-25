const express = require('express');
const helmet = require('helmet');

const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3'
  },
  useNullAsDefault: true
}

const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

// /api/zoos endpoints here
server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(animals => {
      res.status(200).json(animals);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.get('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .first()
    .then(zoo => {
      if(zoo) {
        res.status(200).json(zoo);
      } else {
        res.status(404).json({ message: 'Zoo not found' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.post('/api/zoos', (req, res) => {
  const name = req.body.name;
  db('zoos')
    .insert(req.body)
    .then(results => {
      return db('zoos')
      .where({ id: results[0] })
      .first()
      .then(zoo => {
        if(!name) {
          res.status(400).json({ error: 'Name required' });
        } else {
          res.status(201).json(zoo.id);
        }
      })
      .catch(err => {
        res.status(500).json(err);
      })
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.put('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .update(req.body)
    .then(name => {
      if(!name) {
        res.status(404).json({ message: 'Record doesn\'t exist' });
      } else {
        res.status(200).json({ message: 'Record updated' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.delete('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if(count > 0) {
        res.status(200).json({ message: `${count} record deleted` });
      } else {
        res.status(404).json({ message: 'Record doesn\'t exist' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// /api/bears endpoints
server.get('/api/bears', (req, res) => {
  db('bears')
    .then(animals => {
      res.status(200).json(animals);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.get('/api/bears/:id', (req, res) => {
  db('bears')
    .where({ id: req.params.id })
    .first()
    .then(bear => {
      if(bear) {
        res.status(200).json(bear);
      } else {
        res.status(404).json({ message: 'Bear not found' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.post('/api/bears', (req, res) => {
  db('bears')
    .insert(req.body)
    .then(results => {
      return db('bears')
      .where({ id: results[0] })
      .first()
      .then(bear => {
        if(!req.body) {
          res.status(400).json({ error: 'Name required' });
        } else {
          res.status(201).json(bear.id);
        }
      })
      .catch(err => {
        res.status(500).json(err);
      })
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.put('/api/bears/:id', (req, res) => {
  db('bears')
    .where({ id: req.params.id })
    .update(req.body)
    .then(name => {
      if(!name) {
        res.status(404).json({ message: 'Record doesn\'t exist' });
      } else {
        res.status(200).json({ message: 'Record updated' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });

});

server.delete('/api/bears/:id', (req, res) => {
  db('bears')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if(count > 0) {
        res.status(200).json({ message: `${count} record deleted` });
      } else {
        res.status(404).json({ message: 'Record doesn\'t exist' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
