'use strict'
const product_controller = require('../controllers/product.controller');
module.exports = (app) => {
    app.route('/product/totalpage')
        .get(product_controller.getTotalPage);

    app.route('/product/allproduct')
        .post(product_controller.getAllProduct);

    app.route('/product/publisher')
        .post(product_controller.getProductByPublisher);

    app.route('/product/category')
        .post(product_controller.getProductByCategory);

    app.route('/product/author')
        .post(product_controller.getProductByAuthor);

    app.route('/product/:id')
        .get(product_controller.getProductByID)

    app.route('/product/related/:productId')
        .get(product_controller.getRelatedProduct)
}