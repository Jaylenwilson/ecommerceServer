// Decide how I want the client to access admin page
// OPTIONS
//* 1. Create seperate URL 
//** This will take the admin user to a page that asks for a admin code instead of the normal users home page for shopping */

//* 2. Create Enum datatype  
//**  This will allow me to set up a entry that only allows one value*/
const { DataTypes } = require("sequelize");
const db = require('../db');
const bcrypt = require('bcryptjs');
const Admin = db.define("admin", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin'),
        allowNull: false,
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
        unique: true,
        allowNull: false,
        validate: {
            is: {
                args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/,
                msg: "Password must be at least 8 characters at least one upper case letter 1 lower case and one symbol"
            },
            notNull: {
                msg: "Must create a password"
            }
        }
    }


}, {
    /**
     * * * Sequelize Hook
     * allows access to sequelize hooks
     * these are life cycle methods in this example the value a user inputs for password is encrypted AFTER VALIDATION
     */
    hooks: {
        afterValidate: function (admin) {
            admin.password = bcrypt.hashSync(admin.password, 10)
        },
    }
});

// teaching someone git

module.exports = Admin