
//Check if the user info is valid.

module.exports = (req, res, next) => {

    //Destructure the req.body.

    const { email, name, password } = req.body;
    //Verify that email is valid

    validEmail = (userEmail) => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
    //Conditional statements

    if (req.path === "/register") {
        if (![email, name, password].every(Boolean)) {
            return res.status(401).json("Please fill all fields.");
        } else if (!validEmail(email)) {
            return res.status(401).json("Invalid email");
        }
    } else if (req.path ==="/login") {
        if (![email, password].every(Boolean)) {
            return res.status(401).json("Please, fill all the fields.")
        } else if (!validEmail(email)) {
            return res.status(401).json("Invalid email")
        }
    }

    next();
}
