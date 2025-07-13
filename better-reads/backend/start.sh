#!/bin/sh

# Run FastAPI (NLP) in background
python3 ./nlpsearch/main.py &

# Run Node server in foreground
npm start
