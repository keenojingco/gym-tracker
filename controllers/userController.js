import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config';
import User from '../models/user';

/**
 * Register new user
 */
export const register = (req, res) => {
    User.findOne({ username: req.body.username }).exec((err, user) => {
        if (err) {
            return res.json({ 'success': false, 'message': err });
        }

        if (user) {
            return res.json({ 'success': true, 'message': 'User already exists' });
        } else {
            const newUser = new User(req.body);

            if (newUser.password) {
                newUser.password = bcrypt.hashSync(newUser.password, config.BCRYPT_SALT_ROUNDS);
            }

            newUser.save((err, user) => {
                if (err) {
                    return res.json({ 'success': false, 'message': 'Some Error' });
                }

                return res.json({ 'success': true, 'message': 'User created', user });
            })
        }
    })
}

/**
 * Get user by username
 */
export const getUser = (req, res) => {
    User.findOne({ username: req.params.username }).exec((err, user) => {
        if (err) {
            return res.json({ 'success': false, 'message': err });
        }

        if (user) {
            return res.json({ 'success': true, 'message': 'User already exists', user });
        }

        return res.json({ 'success': true, 'message': 'User not found', user });
    })
}

/**
 * Login with JWT authentication
 */
export const login = (req, res) => {
    User.findOne({ username: req.body.username }).exec((err, user) => {
        if (err) {
            return res.json({ 'success': false, 'message': err });
        }

        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            return res.json({
                'success': true,
                'message': 'User authenticated',
                'user' : {
                    'name': user.firstName + ' ' + user.lastName,
                    'username': user.username,
                    'email': user.email
                },
                'token': jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: 60*60 })
            });
        }

        return res.status(401).json({
            error: {
                message: 'Wrong username or password!'
            }
        });
    })
}