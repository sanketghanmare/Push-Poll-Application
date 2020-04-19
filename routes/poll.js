const express = require('express');
const router = express.Router();

const Pusher = require('pusher');
const mongoose = require('mongoose');

const Vote = require('../models/Vote');

const pusher = new Pusher({
                            appId: '985346',
                            key: '65aeb3a8271d3d04ab6f',
                            secret: '841001aa7a55fb44bd37',
                            cluster: 'us2',
                            encrypted: true
                        });

router.get('/', (req,res) => {
    Vote.find().then(votes => res.json({
        success: true,
        votes: votes
                                       }));
});

router.post('/', (req,res) => {
    const newVote = {
        os: req.body.os,
        points : 1
    };

    new Vote(newVote).save().then(vote => {
        pusher.trigger('os-poll', 'os-vote', {
            points: parseInt(vote.points),
            os: vote.os
        });
    });

    return res.json({success: true, message: 'Thank you for voting'});
});

module.exports = router;