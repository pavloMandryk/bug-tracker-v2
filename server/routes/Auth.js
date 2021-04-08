const router = require("express").Router();
const pool = require("../db");
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");

//Register Route

router.post("/register", validInfo, async (req, res) => {
    try {
        //1. destructure the req.body (name, email, password)

        const { name, email, password} = req.body;
        //2. check if user exists

        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);
        if (user.rows.length !== 0) {
            return res.status(401).json("user already exists")
        }
        //3. bcrypt user password

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);
        //4. enter the new user inside database
        
        const newUser = await pool.query(`INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *`, [name, email, bcryptPassword]);
        //5. generating the jwt token

        const token = jwtGenerator(newUser.rows[0].user_id)
        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).json("server error");
    }
})

//Login Route

router.post("/login",validInfo, async (req, res) => {
    try {
        //1. destructure the rq.body

        const { email, password } = req.body;
        //2. check if user doesn't exist

        const user = await pool.query(`SELECT * FROM users WHERE user_email = $1`, [email]);
        if (user.rows.length === 0 ) {
            return res.status(401).json("incorrect password or email")
        }
        //3. check if incoming password is equal to the db password

        const validPassword = await bcrypt.compare(password, user.rows[0].user_password)
        console.log(validPassword)
        if(!validPassword) {
            res.status(401).json("incorrect password")
        }
        //4. give jwt token

        const token = jwtGenerator(user.rows[0].user_id);

        res.json({ token })

    } catch (err) {
        console.error(err.message)
        res.status(500).json("server error")
    }
})

router.get("/is-verify", authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.messsage)
        res.status(500).json("server error")
    }
})
module.exports = router;