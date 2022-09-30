const router = require('express').Router();
const { models } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const { Op, ValidationError } = require("sequelize");
const validateJWT = require('../middleware/validate-session');
const { check, body, validationResult } = require('express-validator');
const { ROLES } = require("../middleware/user-role")

router.post('/register', async (req, res) => {
    const
        {
            firstName,
            lastName,
            email,
            password,
            address1,
            address2,
            city,
            state,
            zipcode,
            role
        } = req.body.users


    try {
        await models.UserModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            address1: address1,
            address2: address2,
            city: city,
            state: state,
            zipcode: zipcode,
            role: ROLES.basic
        })
            .then(

                user => {

                    console.log(user)
                    let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

                    res.status(201).json({
                        user: user,
                        message: "user created",
                        sessionToken: `Bearer ${token}`
                    })
                }
            )

    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: 'Username already in use'
            })
        } else if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                msg: err.errors.map(e => e.message)
            })
        } else {
            res.status(500).json({
                error: `Sorry we could not create your account ${err}`
            });
        };

    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body.users;
    try {
        await models.UserModel.findOne({
            where: {
                email: email,
            }
        })
            .then(
                user => {
                    if (user) {
                        console.log(password)
                        console.log(user.password)
                        bcrypt.compare(password, user.password, (err, matches) => {
                            if (matches) {
                                let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
                                res.status(200).json({
                                    user: user,
                                    message: 'logged in sucessfully',
                                    sessionToken: `Bearer ${token}`
                                })
                            } else {
                                res.status(500).json({
                                    error: 'incorrect credentials'
                                })
                            }
                        })
                    } else {
                        res.status(502).json({
                            error: 'user does not exist'
                        })
                    }
                }
            )
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                msg: err.errors.map(e => e.message)
            })
        } else if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: 'Username already in use'
            })
        } else {
            res.status(500).send({
                message: "sorry could create account"
            })
        }



    }
})

module.exports = router
