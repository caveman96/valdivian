let User = require('../models/user.model');
let Token = require('../models/token.model');
//add auth also to the whitelist
const whitelist = ['/users', '/token']

//Method for reading the request object and verifying token
const doAuth = function (req, res, next) {
    if (whitelist.includes(req.originalUrl)) {
        return next();
    }
    try {
        //token is send as authorization: Bearer <token>
        const token = req.headers.authorization.split(' ')[1];
        //get current date and time in milliseconds
        now = new Date();
        nowinMillis = now.getTime();

        //find one token that matches
        Token.findOne({ "token": token })
            .then(token => {
                //if no entry was found that means the token was not in db
                if (!token) {
                    res.status(403).json({
                        error: {
                            message: 'token invalid'
                        }
                    });
                }
                //if token match, then verify validity and proceed to next
                if (token.expiry > nowinMillis) {
                   return next();
                } else {
                    //if token is expired then delete it and respond with 403
                    User.deleteOne({ "token": token }, function (err) {
                        if (err) res.status(400).json('Error: ' + err);
                    })
                        .then(() => res.status(403).json({
                            error: {
                                message: 'token expired, please create a new one'
                            }
                        }));
                }
            })
            .catch(err => res.status(403).json({
                error: {
                    message: 'Auth Failed db error: ' + err
                }
            }));
    } catch (err) {
        //catch the errors that occur during parsing the authorization header
        res.status(403).json({
            error: {
                message: "authorization invalid"
            }
        });
    }
};

//Method for creating an access token
const createToken = function (req, res) {
    try {
        const authorization = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString().split(':');
        const email = authorization[0]
        const password = authorization[1]

        //find one user that matches the email id
        User.findOne({ "email": email })
            .then(user => {
                //if no entry was found that means the email was not in db
                if (!user) {
                    res.status(403).json({
                        error: {
                            message: 'user not registered'
                        }
                    });
                }
                //if passwords match proceed to the next method, which will call the correct router for the api path
                if (user.password === password) {
                    //get current date and time in milliseconds
                    const now = new Date();
                    const nowinMillis = now.getTime();
                    //create a random string of length 5
                    const randomString = Math.random().toString(36);
                    //base64 encode the random+time string
                    const token = Buffer.from(randomString + nowinMillis.toString()).toString('base64');
                    const expiry = nowinMillis + 60000 //60 seconds
                    //create a new token object with expiry
                    const newToken = new Token({ "token": token, "expiry": expiry });
                    //save new user object
                    newToken.save()
                        .then(() => res.json({
                            "token": token
                        }))
                        .catch((err) => res.status(400).json('error: ' + err));
                } else {
                    //if passwords dont match responsd with 403
                    res.status(403).json({
                        error: {
                            message: 'password incorrect'
                        }
                    });
                }
            })
            .catch(err => res.status(403).json({
                error: {
                    message: 'Auth Failed db error: ' + err
                }
            }));
    } catch (err) {
        //catch the errors that occur during parsing the authorization header
        res.status(403).json({
            error: {
                message: "authorization invalid"
            }
        });
    }
};

//export the two methods so it can be used
module.exports = { doAuth, createToken };