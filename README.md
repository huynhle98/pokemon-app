# pokemon-app

## 1. How to run the backend application

### 1.1. Environment setup

- Node version: v20.17.0
- npm version: 10.8.2
- Nest CLI: 11.0.2
- MongDB: https://www.mongodb.com/try/download/community

### 1.2. Run pokemon-backend application

- Open VSCode or open terminal at pokemon-backend folder(cd pokemon-backend)
- npm install
- npm run start-dev
- Open your browser and navigate to http://localhost:3000/.

## 2. How to run the frontend application

### 2.1. Environment setup

Node version: v20.17.0
npm version: 10.8.2
Angular CLI: 18.2.7

### 2.2. Run pokemon-frontend application

1. Open VSCode or open terminal at pokemon-frontend folder(cd pokemon-frontend)
2. npm install
3. npm run start
4. Open your browser and navigate to http://localhost:4200/.

## 3. Features

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
   - Fetch Pokémon details using Pokémon id.
5. Mark/Unmark Favorite Pokémon
   - Add/remove Pokémon from the user’s favorite list.
6. Fetch User’s Favorite Pokémon List
   - Retrieve all favorited Pokémon of a specific user.

## 4. Demo Images

![signup](https://github.com/huynhle98/pokemon-app/blob/60d0cbc637845510cae7b81838ee1314f10583b3/demo-images/signup.png)
![login](https://github.com/huynhle98/pokemon-app/blob/60d0cbc637845510cae7b81838ee1314f10583b3/demo-images/login.png)
![home](https://github.com/huynhle98/pokemon-app/blob/60d0cbc637845510cae7b81838ee1314f10583b3/demo-images/home.png)
![pokemon list](https://github.com/huynhle98/pokemon-app/blob/60d0cbc637845510cae7b81838ee1314f10583b3/demo-images/pokemon-list.png)
![pokemon detail modal](https://github.com/huynhle98/pokemon-app/blob/60d0cbc637845510cae7b81838ee1314f10583b3/demo-images/pokemon-detail-modal.png)
![mongoDb](https://github.com/huynhle98/pokemon-app/blob/28281a504219eb88e0b1f83fef8bc265c1bd46c4/demo-images/mongoDb.png)
