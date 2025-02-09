# pokemon-app

## How to run the backend application

### Environment setup

Node version: v20.17.0
npm version: 10.8.2
Nest CLI: 11.0.2
MongDB: https://www.mongodb.com/try/download/community

### Run pokemon-backend application

1. Open VSCode or open terminal at pokemon-backend folder(cd pokemon-backend)
2. npm install
3. npm run start-dev
4. Open your browser and navigate to http://localhost:3000/.

## How to run the frontend application

### Environment setup

Node version: v20.17.0
npm version: 10.8.2
Angular CLI: 18.2.7

### Run pokemon-frontend application

1. Open VSCode or open terminal at pokemon-frontend folder(cd pokemon-frontend)
2. npm install
3. npm run start
4. Open your browser and navigate to http://localhost:4200/.

## Features

1. Authentication (Signup/Login/Logout)
   - Signup: Create a new user with hashed password.
   - Login: Validate credentials and return a JWT token.
   - Logout: Invalidate the token (handled on frontend).
2. Import Pokémon List via CSV
   - Upload a CSV file containing Pokémon data.
   - Parse the CSV and save Pokémon into the database.
3. Fetch Pokémon List with Pagination & Filtering
   - Pagination support (limit, offset).
   - Filters: name, type, legendary status, speed range.
4. Retrieve Pokémon Details by ID
   - Fetch Pokémon details using MongoDB’s id.
5. Mark/Unmark Favorite Pokémon
   - Add/remove Pokémon from the user’s favorite list.
6. Fetch User’s Favorite Pokémon List
   - Retrieve all favorited Pokémon of a specific user.
