import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config/config';
import User from '../models/user';
import Role from '../config/roles';

/**
 * Register new user
 */
export const register = (req, res) => {
    User.getUser(req.body.username, function (err, user) {
        if (err) {
            return res.json({ 'success': false, 'message': err });
        }

        if (user) {
            return res.json({ 'success': true, 'message': 'User already exists' });
        } else {
            const newUser = new User(req.body);

            newUser.role = 3;
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
    User.getUser(req.params.username, function (err, user) {
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
                'user': {
                    'name': user.firstName + ' ' + user.lastName,
                    'username': user.username,
                    'email': user.email
                },
                'token': jwt.sign({ user }, config.JWT_SECRET, { expiresIn: 60 * 60 })
            });
        }

        return res.status(401).json({
            error: {
                message: 'Wrong username or password!'
            }
        });
    })
}