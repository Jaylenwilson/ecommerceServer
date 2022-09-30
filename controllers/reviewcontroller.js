const router = require('express').Router();
const { models } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const { Op, ValidationError } = require("sequelize");
const validateJWT = require('../middleware/validate-session');
const { check, body, validationResult } = require('express-validator');
const { ROLES, authRole, authUser } = require('../middleware/user-role');

router.post('/create', validateJWT, async (req, res) => {
    const { rating, description, productId } = req.body.reviews
    try {
        const addReview = await models.ReviewModel.create({
            rating: rating,
            description: description,
            productId: productId,
            userId: req.user.id,
            name: req.user.firstName
        })
        console.log("User:", req.user)
        res.status(200).send({
            message: 'review created',
            addReview: addReview
        })
    } catch (err) {
        res.status(500).json({
            message: `Sorry we could not create your review ${err}`
        })
    }
})

router.delete('/delete/:userId/:productId/:id', validateJWT, async (req, res) => {
    const id = req.params.id
    const userId = req.params.userId
    const productId = req.params.productId
    try {
        const deleteReview = await models.ReviewModel.destroy({
            where: {
                id: id,
                userId: userId,
                productId: productId
            }
        })
        res.status(200).send({
            message: `Review deleted succesfully ${deleteReview}`
        })
    } catch (err) {
        res.status(500).json({
            message: `Sorry we could not delete product ${err}`
        })
    }
})

router.put('/edit/:userId/:productId/:id', validateJWT, async (req, res) => {
    const id = req.params.id
    const userId = req.params.userId
    const productId = req.params.productId
    const { rating, description } = req.body.reviews
    try {
        const updateReview = await models.ReviewModel.update({
            rating: rating,
            description: description
        },
            {
                where: {
                    id: id,
                    userId: userId,
                    productId: productId
                }
            }
        )

        res.status(200).send({
            message: "update sucessful",
            updateReview: updateReview
        })
    } catch (err) {
        res.status(500).json({
            message: `Sorry we could not edit this review ${err}`
        })
    }
})

module.exports = router