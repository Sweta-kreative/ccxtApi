var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/saveTx', function (req, res) {
    tx.create({
        hash : req.body.hash,
        from : req.body.from,
        to: req.body.to,
        block: req.body.block,
        block: req.body.Number
        }, 
        function (err, tx) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(tx);
        });
});

router.get('/:hash', function (req, res) {
    tx.findByhash(req.params.hash, function (err, tx) {
        res.status(200).send(tx);
    });
});


module.exports = router;