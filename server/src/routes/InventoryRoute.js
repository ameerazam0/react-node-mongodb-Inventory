import { Router } from "express";
import { createInventory, approveInventory, removeInventory } from "./../services/InventoryService";
import { validateCreateInventory } from "./../validators/InventoryValidator"
import { verifyAuthMiddleware } from "./../utils/AuthUtil";

const router = Router();

router.post('/', verifyAuthMiddleware, function (req, res, next) {
    validateCreateInventory(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const userSession = req.session;
            const { productId, productName, mrp, batch, quantity } = req.body;
            const data = { productId, productName: { en: productName }, mrp, batch, quantity, userSession };
            createInventory(data, function (err, inventory) {
                if (err) {
                    if (err.message === "Not Enough Permission to create Inventory") {
                        res.status(400).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(201).send(inventory);
                }
            });
        }
    });
});

router.delete('/:id', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        const userSession = req.session;
        const data = { id, userSession };
        removeInventory(data, function (err, inventory) {
            if (err) {
                if (err.message === "Not Enough Permission to remove Inventory") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "An Operation is Pending on the Inventory") {
                    res.status(400).send(err.message);
                }
                else {
                    console.log(err);
                    res.status(500).send(err);
                }
            }
            else {
                res.status(200).send();
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

router.get('/:id/approve', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        const userSession = req.session;
        const data = { id, userSession };
        approveInventory(data, function (err, inventory) {
            if (err) {
                if (err.message === "Only Pending Inventories can be approved") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "Not Enough Permission to approve Inventory") {
                    res.status(400).send(err.message);
                }
                else {
                    console.log(err);
                    res.status(500).send(err);
                }
            }
            else {
                res.status(200).send();
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

export default router;