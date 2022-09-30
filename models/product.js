const { DataTypes } = require('sequelize')
const db = require("../db")
const Products = db.define("products", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },

    item: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Must enter an item"
            }
        }
    },

    image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Must enter an image"
            }
        }
    },

    price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Must enter a price"
            }
        }
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Must enter a description"
            }
        }
    },

    quanity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Must enter a quanity"
            }
        }
    },

    size: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    color: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    }

})
module.exports = Products
