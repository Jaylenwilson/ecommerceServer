const db = require('../db');

const UserModel = require('./user');
const AdminModel = require('./admin');
const ProductModel = require('./product');
const ReviewModel = require('./review');
const { beforeValidate } = require('../db');
const { options } = require('./user');
const Users = require('./user');
const Products = require('./product');
const Admin = require('./admin');


ProductModel.belongsTo(AdminModel)
AdminModel.hasMany(ProductModel)

ReviewModel.belongsTo(UserModel)
UserModel.hasMany(ReviewModel)

ReviewModel.belongsTo(ProductModel)
ProductModel.hasMany(ReviewModel)


module.exports = {
    dbConnection: db,
    models: {
        UserModel,
        AdminModel,
        ProductModel,
        ReviewModel
    }
};