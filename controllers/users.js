const User = require('../models/user');

let createUser = (name, email, password) => {
    return User.findOne({ email: email })
        .then((result) => {
            if (result) {
                console.log("Error: user already exists", result);
                return true;
            } else {
                let user = new User({ name, email, password });
                console.log("Name", name)
                return user.save();
            }
        })
        .then((isExists) => {
            if (isExists) {
                return {
                    status: false,
                    message: "user already exists"
                };
            }
            return {
                status: true,
                message: "user saved successfully"
            };
        })
        .catch(err => {
            console.log(err);
            return err;
        })
};

let login = (email, password) => {
    return User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                return {
                    status: false,
                    message: "User not found"
                };
            } else {
                return new Promise((resolve, reject) => {
                    user.comparePassword(password, function(err, isMatch) {
                        if (err) {
                            console.error(err);
                            return resolve({
                                status: false,
                                message: "Something went wrong"
                            });
                        }
                        if (isMatch) {
                            return resolve({
                                status: true,
                                message: "verified",
                                match: true,
                                userId: user.id,
                                name: user.name,
                                email: user.email
                            })
                        }
                        resolve({
                            status: false,
                            message: "password mismatch",
                            match: false,
                            userId: user.id
                        });
                    });
                });
            }
        })
        .catch(err => {
            console.log(err);
            return err;
        })
};


let getUser = (userId) => {
    return User.findOne({ id: userId })
        .then((result) => {
            if (!result) {
                return {
                    status: false,
                    message: "user not found"
                };
            }
            return {
                status: true,
                message: "user found",
                data: result
            };
        })
        .catch(err => {
            console.log("Error in fetching user::", userId);
            return err;
        })
};

module.exports = {
    getUser,
    createUser,
    login
};