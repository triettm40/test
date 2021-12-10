'use strict'
const article = require('../models/article.model');

exports.getTotalPage = (req, res) => {
    article.find({}, (err, docs) => {
        if (err) {
            console.log(err);
            res.status(500).json({ msg: err });
            return;
        }
        res.status(200).json({ data: parseInt((docs.length - 1) / 9) + 1 })
    })
}

exports.getAllArticle = async (req, res) => {
    if(typeof req.body.page === 'undefined') {
        res.status(402).json({msg: 'Data invalid'});
        return;
    }
    let count = null;
    try { 
        count = await article.count({});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({msg: err});
        return;
    }
    let totalPage = parseInt(((count - 1) / 9) + 1);
    let { page } = req.params;
    if ((parseInt(page) < 1) || (parseInt(page) > totalPage)) {
        res.status(200).json({ data: [], msg: 'Invalid page', totalPage });
        return;
    }
    article.find({})
    .skip(9 * (parseInt(page) - 1))
    .limit(9)
    .exec((err, docs) => {
        if(err) {
            console.log(err);
                    res.status(500).json({ msg: err });
                    return;
        }
        res.status(200).json({ data: docs, totalPage });
    })
  
}

exports.getArticleByID = async (req, res) => {
    if (req.params.id === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let result
    try {
        result = await article.findById(req.params.id);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: err })
        return;
    }
    if (result === null) {
        res.status(404).json({ msg: "not found" })
        return;
    }
    result.save((err, docs) => {
        if (err) {
            console.log(err);
        }
    });
    res.status(200).json({ data: result })
}
