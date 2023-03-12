const { Post, User, Comment } = require('../models');
const router = require('express').Router();
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');

// posts to be displayed by logged in users
router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
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
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('dashboard', { posts, loggedIn: true });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// render the edit page
router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
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
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    module: User,
                    attributes: ['username']
                }
            }
        ]
    })
    .then(dbPostData => {
        const post = dbPostData.get({ plain: true });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// render the newpost page
router.get('/newpost', (req, res) => {
    res.render('new-posts');
});

module.exports = router;