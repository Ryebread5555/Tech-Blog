const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// route to get api/users
router.get('/', async (req, res) => {
    try {
        const dbUserData = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// route to get single user by id
router.get('/:id', async (req, res) => {
    try {
        const dbUserData = await User.findOne({
            attributes: { exclude: ['password'] },
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Post,
                    attributes: ['id', 'title', 'post_text', 'created_at']
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'created_at'],
                    include: {  
                        model: Post,
                        attributes: ['title']
                    }
                }
            ]
        });
        if (!dbUserData) {
            res.status(404).json({ message: 'No user was found with this id' });
            return;
        }
        res.json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Create a user
router.post('/', async (req, res) => {
    try {
        const dbUserData = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData);
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// login route
router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({ where: { email: req.body.email } });

    if (!dbUserData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.logged_in = true;

      res.redirect('/dashboard');
    });

  } catch (err) {
    res.status(400).json(err);
  }
});


// Logout route
router.post("/logout", (req, res) => {
    try {
      if (req.session.loggedIn) {
        req.session.destroy(() => {
          res.status(204).end();
        });
      } else {
        res.status(404).end();
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });

  // Homepage route
router.get('/', (req, res) => {
  try {
      if (req.session.loggedIn) {
          res.render("homepage", {loggedIn: true});
      } else {
          res.render("homepage", {loggedIn: false});
      }
  } catch (err) {
      console.error(err);
      res.status(500).json(err);
  }
});
  
  // update route for user
  router.put('/:id', withAuth, async (req, res) => {
    try {
      const [dbUserData] = await User.update(req.body, {
        individualHooks: true,
        where: {
          id: req.params.id,
        },
      });
      if (!dbUserData) {
        res.status(404).json({ message: 'No user was found with this id' });
      } else {
        res.json(dbUserData);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  // DELETE route for user
  router.delete('/:id', withAuth, async (req, res) => {
    try {
      const dbUserData = await User.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (!dbUserData) {
        res.status(404).json({ message: 'No user was found with this id' });
      } else {
        res.json(dbUserData);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  module.exports = router;
  