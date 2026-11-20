# DEV-GAMING

A community-focused gaming storefront with game discovery, seller listings, saved games, and a cart preview.

## Project structure

- `frontend/` - Static website, styles, assets, and browser-side interactions.
- `backend/` - Express API for the local development setup.

## Run locally

1. Install Node.js.
2. In `backend/`, run `npm install` and then `npm start`.
3. Serve the `frontend/` folder with a local static web server (for example, VS Code Live Server).

The frontend currently connects to the API at `http://localhost:5000/api`.

## Current scope

This repository contains the current development version. Authentication data is held in server memory, seller listings and cart behavior are local/demo features, and checkout is not connected to a payment provider. Configure persistent storage, production secrets, and payment processing before using it as a live marketplace.
