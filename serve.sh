#!/bin/bash
# Local development server script to fix YouTube embed CORS / Origin issues
echo "Starting local Python HTTP server on port 8000..."
echo "Please open http://localhost:8000 in your browser to view the site without YouTube Error 153."
python3 -m http.server 8000
