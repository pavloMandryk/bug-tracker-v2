const jwt = require("jsonwebtoken");
require("dotenv").config();

//Check if the JWT Token is valid.

module.exports = async (req, res, next) => {

    try {
        //1. Destructure the token

        const jwtToken = req.header("token");
        //2. Check if there is a jwt token

        if (!jwtToken) {
            return res.status(403).json("not authorized")
        }
        //3. Check if the jwt token is valid

        const payload = jwt.verify(jwtToken, process.env.jwtSecret);
        //4. Pass the payload to req.user 

        req.user = payload.user;

        next();
    } catch (err) {
        console.error(err.message)
        return res.status(403).json(false)
    }
}