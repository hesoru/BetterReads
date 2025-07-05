import express from 'express';
import Users from '../model/users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import {isStrongPassword} from "./utils.js";

const router = express.Router();

//TODO: add pagination?
// GET all users (for admin/testing)
router.get('/', async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users', details: err.message });
    }
});

// retrieve userImageURL by busername// GET /avatarUrl/:username - Retrieve avatar URL by username
router.get('/avatarUrl/:username', async (req, res) => {
  try {
    const user = await Users.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json( user.avatarUrl );
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch avatar URL', details: err.message });
  }
});

// GET /users/:id - get profile
router.get('/:id', async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve user', details: err.message });
    }
});

// GET /users/:id - get profile bu suername
router.get('/get-user/:username', async (req, res) => {
    try {
        const user = await Users.findOne({username: req.params.username});
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve user', details: err.message });
    }
});

// POST /signup - register new user
router.post('/signup', async (req, res) => {
    try {
        const { username, password, avatarUrl, favoriteGenres, wishList } = req.body;
        if (!username || !password || !favoriteGenres ) return res.status(400).json({ error: 'Username and password required' });

        if (!isStrongPassword(password)) {
            return res.status(400).json({
                error: 'Password must be at least 12 characters and include uppercase, lowercase, number, and symbol.'
            });
        }
        const existing = await Users.findOne({ username });
        if (existing) return res.status(409).json({ error: 'Username already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Users({
            username,
            password: hashedPassword,
            avatarUrl,
            favoriteGenres,
            reviews: [],
            wishList: wishList || [],
            join_time: new Date()
        });

        await newUser.save();
        const token = jwt.sign({ id: newUser._id, username }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY
        });
        res.status(201).json({ message: 'User created', userId: newUser._id , token: token});
    } catch (err) {
        res.status(400).json({ error: 'Failed to create user', details: err.message });
    }
});

// POST /login - basic login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

        const user = await Users.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'This username does not exist. Please make sure username is correct and try again.' });
        }
        const match = await bcrypt.compare(password, user.password);

        if (!match ) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY
        });
        res.json({token, user});
        // TODO: Replace with real session or JWT
        //res.json({ message: 'Login successful', userId: user._id });
    } catch (err) {
        res.status(500).json({ error: 'Login failed', details: err.message });
    }
});

// POST /logout //TODO: update w/ redux????
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out' });
});


// PUT /users/:id/genres/add-multiple
router.put('/:id/genres/add-multiple', async (req, res) => {
    try {
        const { genres } = req.body;

        if (!Array.isArray(genres) || genres.length === 0) {
            return res.status(400).json({ error: 'An array of genres is required' });
        }

        const updated = await Users.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { favoriteGenres: { $each: genres } } },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: 'User not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: 'Failed to add genres', details: err.message });
    }
});

// PUT /users/:id - update a total user
router.put('/:id', async (req, res) => {
    try {
        const updated = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'User not found' });

        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update user', details: err.message });
    }
});

// PATCH /users/update-wishlist/:id
router.patch('/update-wishlist/:id', async (req, res) => {
    try {
        const { bookId, operation } = req.body;
        if (!['add', 'remove'].includes(operation)) {
            return res.status(400).json({ error: 'Invalid operation' });
        }

        const user = await Users.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const exists = user.wishList.some(id => id.toString() === bookId.toString());

        if (operation === 'add' && !exists) {
            user.wishList.push(bookId);
        }

        if (operation === 'remove' && exists) {
            user.wishList = user.wishList.filter(id => id.toString() !== bookId.toString());
        }

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update wishlist', details: err.message });
    }
});


// DELETE /users/:id - delete user (optional/admin)
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Users.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'User not found' });

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user', details: err.message });
    }
});

export default router;
