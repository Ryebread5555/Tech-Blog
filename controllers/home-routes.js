const { Post, User, Comment } = require('../models');
const router = require('express').Router();
const sequelize = require('../config/connection');

// render all posts to the homepage
router.get('/', async (req, res) => {
    console.log(req.session);

    try {
        const dbPostData = await Post.findAll({
            attributes: [
                'id',
                'title',
                'created_at',
                'post_text'
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('homepage', { posts, loggedIn: req.session.loggedIn });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// redirect user to homepage after log in
router.get('/login', (req, res) => {
    if(req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

// render sign up page
router.get('/signup', (req, res) => {
    res.render('signup');
});

//will render 1 post to the single-post
router.get('/post/:id', async (req, res) => {
    try {
        const dbPostData = await Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'created_at',
                'post_text'
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']    
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        if (!dbPostData) {
            res.status(404).json({ message: 'No post was found matching this id' });
            return;
        }

        const post = dbPostData.get({ plain: true });

        res.render('single-post', { post, loggedIn: req.session.loggedIn});
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;
