const { DataTypes } = require('sequelize')
const db = require("../db")
const Shoppingcart = db.define('shoppingcart', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    item: {
        type: DataTypes.ARRAY,
        allowNull: false
    }
})
module.exports = Shoppingcart