const { validationResult } = require("express-validator")
const { DataTypes } = require("sequelize")
const db = require('../db')
const bcrypt = require('bcryptjs');

const Users = db.define("users", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    /** 
    * * * Validate Property 
    * Allows access to sequelizes validate functions
    */
    firstName: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Must enter your first name"
            }
        }
    },

    lastName: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Must enter your last name"
            }
        }
    },

    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: {
                msg: "Email is invalid:(example@email.com)"
            },
            notNull: {
                msg: "Must enter your email"
            }
        }
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,

        validate: {
            is: {
                args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/,
                msg: "Password must be at least 8 characters at least one upper case letter 1 lower case and one symbol"
            },
            notNull: {
                msg: "Must create a password"
            }
        }
    },

    address1: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false
    },

    address2: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true
    },

    city: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false
    },

    state: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false
    },

    zipcode: {
        type: DataTypes.INTEGER,
        unique: false,
        allowNull: false,
    },

    role: {
        type: DataTypes.ENUM('basic'),
        allowNull: false
    }

}, {
    /**
     * * * Sequelize Hook
     * allows access to sequelize hooks
     * these are life cycle methods in this example the value a user inputs for password is encrypted AFTER VALIDATION
     */
    hooks: {
        afterValidate: function (user) {
            user.password = bcrypt.hashSync(user.password, 10)
        },
    }
});


// });

module.exports = Users