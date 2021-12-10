'use strict'
const article_controller = require('../controllers/article.controller');

module.exports = (app) => {
    app.route('/article/totalpage')
    .get(article_controller.getTotalPage);

    app.route('/article/allarticle')
        .post(article_controller.getAllArticle);
    app.route('/article/:id')
        .get(article_controller.getArticleByID)
}