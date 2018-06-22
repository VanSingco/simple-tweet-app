const router = require('express').Router();
const User = require('../models/user');
const Tweet = require('../models/tweet');
const async = require('async');

router.get('/', (req, res, next) => {
    if (req.user) {
        Tweet.find()
        .sort('-created')
        .populate('owner')
        .exec()
        .then((tweets) => {
            console.log(tweets)
             res.render('main/home', {tweets});
        }).catch(err => next(err));
    } else {
        res.render('main/landing');
    }
});

router.get('/user/:id', (req, res, next) => {
   async.waterfall([
       (callback) => {
        Tweet.find({owner: req.params.id})
            .sort('-created')
            .populate('owner')
            .exec((err, tweets) => {
                callback(err, tweets);
            })
       },
       (tweets, callback) => {
        User.findOne({_id: req.params.id})
            .populate('following')
            .populate('followers')
            .exec((err, user) => {
                let follower = user.followers.some(function(friend){
                    return  friend.equals(req.user._id);
                });
                let currentUser;
                if (req.user._id.equals(user._id)) {
                    currentUser = true;
                }else{
                    currentUser = false;
                }
                console.log(currentUser);
                res.render('main/user', {foundUser: user, tweets, currentUser, follower})
            });        
       }
   ]);
});

router.post('/follow/:id', (req, res, next) => {
    async.parallel([
        (callback) => {
            User.update({
                _id: req.user._id,
                following: {$ne: req.params.id}
            },{
                $push:{following: req.params.id}
            }, (err, count) => {
                callback(err, count);
            })
        },
        (callback) => {
            User.update({
                _id: req.params.id,
                followers: {$ne: req.user._id}
            },{
                $push:{followers: req.user._id}
            }, (err, count) => {
                callback(err, count);
            })
        }
    ], (err, result) => {
        if(err) return next(err);
        res.json('Success');
    });
});

router.post('/unfollow/:id', (req, res, next) => {
    async.parallel([
        (callback) => {
            User.update({
                _id: req.user._id
            },{
                $pull:{following: req.params.id}
            }, (err, count) => {
                callback(err, count);
            })
        },
        (callback) => {
            User.update({
                _id: req.params.id
            },{
                $pull:{followers: req.user._id}
            }, (err, count) => {
                callback(err, count);
            })
        }
    ], (err, result) => {
        if(err) return next(err);
        res.json('Success');
    });
});

module.exports = router;

