const router = require('express').Router();
const { models } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const { Op, ValidationError } = require("sequelize");
const validateJWT = require('../middleware/validate-session');
const { check, body, validationResult } = require('express-validator');
const { ROLES, userAuth, authRole } = require('../middleware/user-role');
// ADMIN CREATES PRODUCT
router.post('/productcreate', validateJWT, authRole(ROLES.admin), async (req, res) => {
    const { item, image, price, description, quanity, size, color } = req.body.products

    try {
        await models.ProductModel.create({
            item: item,
            image: image,
            price: price,
            description: description,
            quanity: quanity,
            size: size,
            color: [color],
            adminId: req.admin.id
        })
            .then(
                product => {
                    res.status(200).send({
                        product: product,
                        message: `${product.item} has been added to inventory`
                    })
                }
            )
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: 'Item has already been created and added to inventory'
            })
        }
        else if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                msg: err.errors.map(e => e.message)
            })
        }
        else {
            res.status(500).json({
                message: `Sorry we could not create product ${err}`
            });
        };
    }
})
//// END/////////////////////////////////////////////////////////////////////////////

// ADMIN UPDATES PRODUCT
router.put('/edit/:adminId/:id', validateJWT, authRole(ROLES.admin), async (req, res) => {
    const { item, image, price, description, quanity, size, color } = req.body.products
    const id = req.params.id
    const adminId = req.params.adminId
    try {
        const updatedProduct = await models.ProductModel.update({
            item: item,
            image: image,
            price: price,
            description: description,
            quanity: quanity,
            size: size,
            color: color,
        },
            {
                where: {
                    id: id,
                    adminId: adminId
                }
            }
        )
        console.log(req.params),
            res.status(200).send({
                message: "Product updated",
                updatedproduct: updatedProduct,
            })
    } catch (err) {

        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                msg: err.errors.map(e => e.message)
            })
        }
        else {
            res.status(500).json({
                message: `Sorry post your product ${err}`
            });
        };
    }
})

// ADMIN DELETES PRODUCT
router.delete('/delete/:id', validateJWT, authRole(ROLES.admin), async (req, res) => {
    const id = req.params.id

    try {
        const result = await models.ProductModel.destroy({
            where: {
                id: id,
            }
        });
        res.status(200).send({
            message: `post has been deleted ${result}`
        })
    } catch (err) {
        res.status(500).send({
            message: 'could not delete post'
        })
    }
})
//// END/////////////////////////////////////////////////////
// USERS ADMIN AND VIEWS VIEW PRODUCT
router.get('/all', async (req, res) => {
    try {
        const products = await models.ProductModel.findAll({
            include: [
                {
                    model: models.ReviewModel
                }
            ]
        })
        res.status(200).send({
            message: 'products recieved',
            products: products
        })
    } catch (err) {
        res.status(500).json({
            message: 'could not access products'
        })
    }
})


//// END////////////////////////////////////////////////////////


module.exports = router