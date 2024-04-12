const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");
const { Pool } = require("pg");



const pinpostController = {
    Get: {
        singlePinpost(req, res) { console.log("singlePinpost GET")
            const { id } = req.params;
            const query = `SELECT * FROM pinpost WHERE pinpost_id = $1 AND deleted = false;`;
            db.query(query, [id], (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: "Internal Server Error",
                    });
                }
                if (result.rows.length === 0) {
                    return res.status(404).json({
                        message: "Pinpost not found",
                    });
                }
                res.status(200).json(result.rows); 
            });
        },
        singleUserPinpost(req, res) { console.log("singleUserPinpost GET")
            const { id } = req.params;
            const query = `SELECT * FROM pinpost WHERE student_id = $1;`;
            db.query(query, [id], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Internal Server Error",
                    });
                }
                res.status(200).json(result.rows);
            });
        },
        multiplePinpost(req, res) { console.log("multiplePinpost GET")
            const query = `SELECT * FROM pinpost WHERE deleted = false;`;
            db.query(query, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: "Internal Server Error",
                    });
                }
                if (result.rows.length === 0) {
                    return res.status(404).json({
                        message: "Pinpost not found",
                    });
                }
                res.status(200).json(result.rows);
            });
        },
    },
    Put: {
        async singlePinpost(req, res) { console.log("singlePinpost PUT")
            const { id } = req.params;
            const { student_id, rating_id, deleted } = req.body;
            const query = `UPDATE pinpost SET student_id = $1, rating_id = $2, deleted = $3 WHERE pinpost_id = $4;`;
            db.query(query, [student_id, rating_id, deleted, id], (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: "Internal Server Error",
                    });
                }
                res.status(200).json({
                    message: "Pinpost updated successfully",
                });
            });
        },
    },
    Post: {
        async singlePinpost(req, res) { console.log("singlePinpost POST")
            const { student_id, rating_id } = req.body;
            const query = `INSERT INTO pinpost (student_id, rating_id) VALUES ($1, $2);`;
            db.query(query, [student_id, rating_id], (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: "Internal Server Error",
                    });
                }
                res.status(201).json({
                    message: "Pinpost created successfully",
                });
            });
        },
    },
    Delete: {
        async singlePinpost(req, res) {  console.log("singlePinpost DELETE")
            const { rating_id, student_id } = req.params;
            const query = `DELETE FROM pinpost WHERE rating_id = $1 AND student_id = $2;`;
            db.query(query, [rating_id, student_id], (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: "Internal Server Error",
                    });
                }
                res.status(200).json({
                    message: "Pinpost deleted successfully",
                });
            });
        },
    },
};

module.exports = pinpostController;
