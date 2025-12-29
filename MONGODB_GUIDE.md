# How MongoDB Connection Works - Simple Explanation

## The Complete Flow

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │  ────>  │  Backend     │  ────>  │  MongoDB    │
│  (React)    │  HTTP   │  (Express)   │  DB     │  Database   │
└─────────────┘         └──────────────┘         └─────────────┘
```

## Step-by-Step: What Happens When You Register

### 1. **User fills out form** (Frontend - Profile.tsx)
   - User types: First Name, Last Name, Email, Password
   - Clicks "Create Account" button

### 2. **Frontend sends data** (AuthContext.tsx)
   ```javascript
   fetch('http://localhost:3001/api/auth/register', {
     method: 'POST',
     body: JSON.stringify({ firstName, lastName, email, password })
   })
   ```

### 3. **Backend receives request** (backend/routes/auth.js)
   - Express server receives the POST request at `/api/auth/register`
   - Extracts the data from `req.body`

### 4. **Backend connects to MongoDB** (backend/server.js)
   - Uses `mongoose.connect()` with your connection string
   - Connection string: `mongodb://localhost:27017/raintop`
     - `localhost:27017` = Your MongoDB server location
     - `raintop` = Database name (MongoDB creates it if it doesn't exist)

### 5. **Backend saves to MongoDB** (backend/routes/auth.js)
   ```javascript
   const user = new User({ firstName, lastName, email, password });
   await user.save();  // <-- THIS SAVES TO MONGODB!
   ```

### 6. **MongoDB stores the data**
   - Creates a collection called "users" (plural of "User" model)
   - Stores the user document with hashed password
   - Returns success to backend

### 7. **Backend sends response** (backend/routes/auth.js)
   ```javascript
   res.json({ success: true, user: {...} })
   ```

### 8. **Frontend receives response** (AuthContext.tsx)
   - Updates user state
   - Opens Dashboard window

## Connection String Explained

```
mongodb://localhost:27017/raintop
│        │          │      │
│        │          │      └─ Database name
│        │          └──────── Port (MongoDB default)
│        └─────────────────── Server location
└──────────────────────────── Protocol
```

## Important Files

1. **`.env`** - Contains your MongoDB connection string
2. **`backend/server.js`** - Connects to MongoDB when server starts
3. **`backend/models/User.js`** - Defines what a User document looks like
4. **`backend/routes/auth.js`** - Handles saving/reading users from MongoDB

## Testing the Connection

When you run `npm run server:dev`, you should see:
```
Connected to MongoDB
Server running on port 3001
```

If you see an error, MongoDB might not be running!

