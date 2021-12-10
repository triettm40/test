'use strict'
const product = require('../models/product.model');
const publisherController = require('./publisher.controller');
const authorController = require('./author.controller');
const categoryController = require('./category.controller');

exports.getTotalPage = (req, res) => {
    product.find({}, (err, docs) => {
        if (err) {
            console.log(err);
            res.status(500).json({ msg: err });
            return;
        }
        res.status(200).json({ data: parseInt((docs.length - 1) / 9) + 1 })
    })
}

exports.getAllProduct = async (req, res) => {
    if ((typeof req.body.page === 'undefined')) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    console.log(req.body.page);
    //Khoang gia
    let range = null;
    let objRange = null;
    if (typeof req.body.range !== 'undefined') {
        range = req.body.range;
        //objRange = JSON.parse(range);
        objRange = range;
    }
    //Search Text
    let searchText = "";
    if (typeof req.body.searchtext !== 'undefined') {
        searchText = req.body.searchtext;
    }
    let searchPublisher = null;
    searchPublisher = await publisherController.getIDBySearchText(searchText);
    let searchAuthor = null;
    searchAuthor = await authorController.getIDBySearchText(searchText);
    let searchCategory = null;
    searchCategory = await categoryController.getIDBySearchText(searchText);
    //Sap xep
    let sortType = "release_date";
    let sortOrder = "-1";
    if (typeof req.body.sorttype !== 'undefined') {
        sortType = req.body.sorttype;
    }
    if (typeof req.body.sortorder !== 'undefined') {
        sortOrder = req.body.sortorder;
    }
    if ((sortType !== "price")
        && (sortType !== "release_date")
        && (sortType !== "view_counts")
        && (sortType !== "sales")) {
        res.status(422).json({ msg: 'Invalid sort type' });
        return;
    }
    if ((sortOrder !== "1")
        && (sortOrder !== "-1")) {
        res.status(422).json({ msg: 'Invalid sort order' });
        return;
    }
    //Trang va tong so trang
    let productCount = null;
    try {
        if (range !== null) {
            productCount = await product
                .count({ $or: [{ name: new RegExp(searchText, "i") },  { id_category: { $in: searchCategory } }], price: { $gte: objRange.low, $lte: objRange.high } });
        }
        else {
            productCount = await product.count({ $or: [{ name: new RegExp(searchText, "i") }, { id_category: { $in: searchCategory } }] });
        }
    }
    catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    let totalPage = parseInt(((productCount - 1) / 9) + 1);
    let { page } = req.body;
    if ((parseInt(page) < 1) || (parseInt(page) > totalPage)) {
        res.status(200).json({ data: [], msg: 'Invalid page', totalPage });
        return;
    }
    //De sort
    let sortQuery = {}
    sortQuery[sortType] = sortOrder;
    //Lay du lieu
    if (range !== null) {
        product
            .find({ $or: [{ name: new RegExp(searchText, "i") }, { id_category: { $in: searchCategory } }], price: { $gte: objRange.low, $lte: objRange.high } })
            .skip(9 * (parseInt(page) - 1))
            .limit(9)
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage });
            });
    }
    else {
        product
            .find({ $or: [{ name: new RegExp(searchText, "i") }, { id_category: { $in: searchCategory } }] })
            .skip(9 * (parseInt(page) - 1))
            .limit(9)
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage });
            });
    }
}

exports.getProductByPublisher = async (req, res) => {
    if ((typeof req.body.page === 'undefined')
        || (typeof req.body.id === 'undefined')) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { id, page } = req.body;
    //Khoang gia
    let range = null;
    let objRange = null;
    if (typeof req.body.range !== 'undefined') {
        range = req.body.range;
        //objRange = JSON.parse(range);
        objRange = range;
    }
    //Search Text
    let searchText = "";
    if (typeof req.body.searchtext !== 'undefined') {
        searchText = req.body.searchtext;
    }
    //Sap xep
    let sortType = "release_date";
    let sortOrder = "-1";
    if (typeof req.body.sorttype !== 'undefined') {
        sortType = req.body.sorttype;
    }
    if (typeof req.body.sortorder !== 'undefined') {
        sortOrder = req.body.sortorder;
    }
    if ((sortType !== "price")
        && (sortType !== "release_date")
        && (sortType !== "view_counts")
        && (sortType !== "sales")) {
        res.status(422).json({ msg: 'Invalid sort type' });
        return;
    }
    if ((sortOrder !== "1")
        && (sortOrder !== "-1")) {
        res.status(422).json({ msg: 'Invalid sort order' });
        return;
    }
    //Trang va tong so trang
    let productCount = null;
    try {
        if (range !== null) {
            productCount = await product
                .count({ name: new RegExp(searchText, "i"), id_nsx: id, price: { $gte: objRange.low, $lte: objRange.high } });
        }
        else {
            productCount = await product.count({ name: new RegExp(searchText, "i"), id_nsx: id });
        }
    }
    catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    let totalPage = parseInt(((productCount - 1) / 9) + 1);
    if ((parseInt(page) < 1) || (parseInt(page) > totalPage)) {
        res.status(200).json({ data: [], msg: 'Invalid page', totalPage });
        return;
    }
    //De sort
    let sortQuery = {}
    sortQuery[sortType] = sortOrder;
    //Lay du lieu
    if (range !== null) {
        product
            .find({ name: new RegExp(searchText, "i"), id_nsx: id, price: { $gte: objRange.low, $lte: objRange.high } })
            .skip(9 * (parseInt(page) - 1))
            .limit(9)
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage });
            });
    }
    else {
        product
            .find({ name: new RegExp(searchText, "i"), id_nsx: id })
            .skip(9 * (parseInt(page) - 1))
            .limit(9)
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage });
            });
    }
}

exports.getProductByCategory = async (req, res) => {
    if (typeof req.body.id === 'undefined'
        || typeof req.body.page === 'undefined'
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { id, page } = req.body;
    //Khoang gia
    let range = null;
    let objRange = null;
    console.log(req.body.range)
    if (typeof req.body.range !== 'undefined') {
        range = req.body.range;
        objRange = range;
    }
    //Kiem tra text
    let searchText = "";
    if (typeof req.body.searchtext !== 'undefined') {
        searchText = req.body.searchtext;
    }
    //Sap xep
    let sortType = "release_date";
    let sortOrder = "-1";
    if (typeof req.body.sorttype !== 'undefined') {
        sortType = req.body.sorttype;
    }
    if (typeof req.body.sortorder !== 'undefined') {
        sortOrder = req.body.sortorder;
    }
    if ((sortType !== "price")
        && (sortType !== "release_date")
        && (sortType !== "view_counts")
        && (sortType !== "sales")) {
        res.status(422).json({ msg: 'Invalid sort type' });
        return;
    }
    if ((sortOrder !== "1")
        && (sortOrder !== "-1")) {
        res.status(422).json({ msg: 'Invalid sort order' });
        return;
    }
    //Tinh tong so trang
    let productCount, productFind;
    try {
        if (range === null) {
            productFind = await product.find({ id_category: id, name: new RegExp(searchText, "i") });
        } else {
            productFind = await product.find({ id_category: id, name: new RegExp(searchText, "i"), price: { $gte: objRange.low, $lte: objRange.high } });
        }
    }
    catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    productCount = productFind.length;
    let totalPage = parseInt(((productCount - 1) / 9) + 1);
    if (parseInt(page) < 1 || parseInt(page) > totalPage) {
        res.status(200).json({ data: [], msg: 'Invalid page', totalPage: totalPage });
        return;
    }
    //De sort
    let sortQuery = {}
    sortQuery[sortType] = sortOrder;
    //Lay du lieu
    if (range === null) {
        product.find({ id_category: id, name: new RegExp(searchText, "i") })
            .limit(9)
            .skip(9 * (page - 1))
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage: totalPage });
            })
    } else {
        product.find({ id_category: id, name: new RegExp(searchText, "i"), price: { $gte: objRange.low, $lte: objRange.high } })
            .limit(9)
            .skip(9 * (page - 1))
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage: totalPage });
            })
    }
}

exports.getProductByAuthor = async (req, res) => {
    if (typeof req.body.id === 'undefined'
        || typeof req.body.page === 'undefined'
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { id, page } = req.body;
    //Khoang gia
    let range = null;
    let objRange = null;
    if (typeof req.body.range !== 'undefined') {
        range = req.body.range;
        objRange = range;
    }
    //Kiem tra text
    let searchText = "";
    if (typeof req.body.searchtext !== 'undefined') {
        searchText = req.body.searchtext;
    }
    //Sap xep
    let sortType = "release_date";
    let sortOrder = "-1";
    if (typeof req.body.sorttype !== 'undefined') {
        sortType = req.body.sorttype;
    }
    if (typeof req.body.sortorder !== 'undefined') {
        sortOrder = req.body.sortorder;
    }
    if ((sortType !== "price")
        && (sortType !== "release_date")
        && (sortType !== "view_counts")
        && (sortType !== "sales")) {
        res.status(422).json({ msg: 'Invalid sort type' });
        return;
    }
    if ((sortOrder !== "1")
        && (sortOrder !== "-1")) {
        res.status(422).json({ msg: 'Invalid sort order' });
        return;
    }
    //De sort
    let sortQuery = {}
    sortQuery[sortType] = sortOrder;
    //Tinh tong so trang
    let productCount, productFind;
    try {
        if (range === null) {
            productFind = await product.find({ id_author: id, name: new RegExp(searchText, "i") });
        } else {
            productFind = await product.find({ id_author: id, name: new RegExp(searchText, "i"), price: { $gte: objRange.low, $lte: objRange.high } });
        }
    }
    catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    productCount = productFind.length;
    let totalPage = parseInt(((productCount - 1) / 9) + 1);
    if (parseInt(page) < 1 || parseInt(page) > totalPage) {
        res.status(200).json({ data: [], msg: 'Invalid page', totalPage: totalPage });
        return;
    }
    //Lay du lieu
    if (typeof req.body.range === 'undefined') {
        product.find({ id_author: id, name: new RegExp(searchText, "i") })
            .limit(9)
            .skip(9 * (page - 1))
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage: totalPage });
            })
    } else {
        product.find({ id_author: id, name: new RegExp(searchText, "i"), price: { $gte: objRange.low, $lte: objRange.high } })
            .limit(9)
            .skip(9 * (page - 1))
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage: totalPage });
            });
    }
}

exports.getProductByID = async (req, res) => {
    if (req.params.id === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let result
    try {
        result = await product.findById(req.params.id);
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
    result.view_counts = result.view_counts + 1;
    result.save((err, docs) => {
        if (err) {
            console.log(err);
        }
    });
    res.status(200).json({ data: result })
}

exports.getRelatedProduct = async (req, res) => {
    if (typeof req.params.productId === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { productId } = req.params;
    let productObj = null;
    try {
        productObj = await product.findById(productId);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: err })
        return;
    }
    if (productObj === null) {
        res.status(200).json({ data: [], msg: 'Invalid productId' });
        return;
    }
    product
        .find({ $or: [{ $and: [{ id_category: productObj.id_category }, { _id: { $nin: [productId] } }] }, ] })
        .limit(5)
        .sort({ release_date: -1 })
        .exec((err, docs) => {
            if (err) {
                console.log(err);
                res.status(500).json({ msg: err });
                return;
            }
            res.status(200).json({ data: docs });
        });
}