import express from 'express';
import axios from 'axios';
import { URLSearchParams } from 'url';
const router = express.Router();

import dotenv from 'dotenv';
dotenv.config();

const PYTHON_API_URL = process.env.PYTHON_API_NLPTEXTSEARCH_URL;

router.get('/search', async (req, res) => {
    try {
        const { q, genre, min_year, max_year } = req.query;

        const params = new URLSearchParams();
        if (q) params.append("q", q);
        if (genre) {
            (Array.isArray(genre) ? genre : [genre]).forEach(g => params.append("genre", g));
        }
        if (min_year) params.append("min_year", min_year);
        if (max_year) params.append("max_year", max_year);

        const response = await axios.get(`${PYTHON_API_URL}?${params.toString()}`);
        res.json(response.data);
    } catch (err) {
        console.error("Search failed:", err.message);
        res.status(500).json({ error: 'Search failed', details: err.message });
    }
});

export default router;