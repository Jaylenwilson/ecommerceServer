const router = require('express').Router();
const { models } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const { Op, ValidationError } = require("sequelize");
const validateJWT = require('../middleware/validate-session');
const { check, body, validationResult } = require('express-validator');
const { ROLES } = require("../middleware/user-role");

router.post('/register', async (req, res) => {
    const
        { email, password, role } = req.body.admin


    try {
        await models.AdminModel.create({
            email: email,
            password: password,
            role: ROLES.admin
        })
            .then(

                admin => {

                    console.log(admin)
                    let token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

                    res.status(201).json({
                        admin: admin,
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
    const { email, password } = req.body.admin;
    try {
        await models.AdminModel.findOne({
            where: {
                email: email,
            }
        })
            .then(
                admin => {
                    if (admin) {

                        bcrypt.compare(password, admin.password, (err, matches) => {
                            if (matches) {
                                let token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
                                res.status(200).json({
                                    admin: admin,
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
        res.status(501).send({
            error: 'server does not support'
        })
    }
})

module.exports = router
