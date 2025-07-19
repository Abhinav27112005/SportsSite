# 🏸 Sports Club Project Documentation

## A Complete Guide to Our Badminton Club Website

---

## 📋 Table of Contents

1. [What is this project?](#what-is-this-project)
2. [How the project works](#how-the-project-works)
3. [Frontend (What users see)](#frontend-what-users-see)
4. [Backend (The brain behind everything)](#backend-the-brain-behind-everything)
5. [Database (Where we store information)](#database-where-we-store-information)
6. [Important Concepts Explained](#important-concepts-explained)
7. [How to run the project](#how-to-run-the-project)
8. [File Structure](#file-structure)

---

## 🎯 What is this project?

Imagine you have a badminton club with lots of members, events, and activities. This project is like a **digital clubhouse** where:

- **Members** can see upcoming events, check their attendance, and manage their profiles
- **Admins** can manage everything - add events, see who joined, handle money matters
- **Visitors** can learn about the club, see photos, and apply to join

Think of it like a **smart website** that makes running a sports club super easy! 🏸

---

## 🔄 How the project works

Our project has **3 main parts** that work together like a team:

```
🌐 Frontend (React) ←→ 🔧 Backend (Node.js) ←→ 🗄️ Database (PostgreSQL)
     (What you see)         (The logic)           (Where data lives)
```

**Simple explanation:**

- **Frontend** = The beautiful website you see in your browser
- **Backend** = The invisible helper that processes your requests
- **Database** = A giant filing cabinet that stores all information

---

## 🎨 Frontend (What users see)

### What is React? 🤔

React is like **LEGO blocks for websites**. Instead of building everything from scratch, we use pre-made pieces (components) and put them together to make a website.

### Key Technologies Used

#### 1. **React 19** 🚀

- **What it is**: A way to build interactive websites
- **Why we use it**: Makes our website fast and responsive
- **Simple example**: Like having a smart TV remote that instantly changes channels

#### 2. **React Router** 🛣️

- **What it is**: Helps users navigate between different pages
- **Why we use it**: Users can go from "Home" to "Events" to "Profile" smoothly
- **Simple example**: Like having a map that shows you how to get from room to room in a house

#### 3. **Bootstrap** 🎨

- **What it is**: Pre-made beautiful designs and layouts
- **Why we use it**: Makes our website look professional without much work
- **Simple example**: Like having a wardrobe full of matching clothes

#### 4. **Vite** ⚡

- **What it is**: A super-fast tool that helps us build and run our website
- **Why we use it**: Makes development much faster
- **Simple example**: Like having a sports car instead of a bicycle

### Important React Concepts Used

#### 1. **Components** 🧩

```jsx
// Think of components like LEGO pieces
function WelcomeMessage() {
  return <h1>Welcome to our Sports Club!</h1>;
}
```

#### 2. **Hooks** 🎣

```jsx
// Hooks are like special tools that help components work
function UserProfile() {
  const [user, setUser] = useState(null); // Like a sticky note that remembers info
  const [loading, setLoading] = useState(true); // Like a loading sign
  
  useEffect(() => {
    // This runs when the component first appears
    fetchUserData();
  }, []);
}
```

#### 3. **Context** 📦

```jsx
// Context is like a family tree that shares information
const AuthContext = createContext(); // Like a family WhatsApp group

// Any component can access user info
const { user, login, logout } = useAuth(); // Like checking the family group
```

#### 4. **State Management** 🧠

- **What it is**: How we remember and update information
- **Why it's important**: Like remembering what page you're on or if you're logged in
- **Simple example**: Like a brain that remembers your name and preferences

### Frontend Libraries Used

| Library | Purpose | Simple Explanation |
|---------|---------|-------------------|
| `react-router-dom` | Navigation | Like a GPS for your website |
| `bootstrap` | Styling | Like a fashion designer for your website |
| `bootstrap-icons` | Icons | Like emojis for your website |
| `react-bootstrap` | Pre-made components | Like pre-built furniture |
| `swiper` | Image sliders | Like a photo album that slides |
| `react-image-gallery` | Photo galleries | Like Instagram for your website |
| `jwt-decode` | Read security tokens | Like reading a special ID card |

---

## 🔧 Backend (The brain behind everything)

### What is Node.js? 🤔

Node.js is like a **smart waiter** at a restaurant. It takes your order (request), goes to the kitchen (processes it), and brings back your food (response).

### Key Technologies Used

#### 1. **Express.js** 🚂

- **What it is**: A framework that makes building web servers easy
- **Why we use it**: Like having a blueprint for building a house
- **Simple example**: Like having a recipe book for cooking

#### 2. **PostgreSQL** 🗄️

- **What it is**: A powerful database (like a giant Excel spreadsheet)
- **Why we use it**: Stores all our data safely and efficiently
- **Simple example**: Like a super-organized filing cabinet

#### 3. **JWT (JSON Web Tokens)** 🔐

- **What it is**: Digital ID cards for users
- **Why we use it**: Keeps users logged in securely
- **Simple example**: Like a VIP pass at a concert

#### 4. **bcryptjs** 🔒

- **What it is**: A tool that scrambles passwords
- **Why we use it**: Keeps user passwords safe
- **Simple example**: Like putting your password in a secret code

### Backend Architecture

#### 1. **MVC Pattern** 🏗️

```
Model (Data) ←→ Controller (Logic) ←→ View (Response)
```

**Simple explanation:**

- **Model**: Like a librarian who knows where all books are
- **Controller**: Like a manager who tells the librarian what to do
- **View**: Like the final answer you get

#### 2. **Middleware** 🔗

```javascript
// Middleware is like security guards
app.use(express.json()); // Checks if requests are valid
app.use(cors()); // Allows different websites to talk to each other
app.use(verifyToken); // Checks if user is logged in
```

#### 3. **Routes** 🛤️

```javascript
// Routes are like different doors in a building
app.use('/api/auth', authRoutes); // Door for login/signup
app.use('/api/events', eventRoutes); // Door for events
app.use('/api/users', userRoutes); // Door for user stuff
```

### Backend Libraries Used

| Library | Purpose | Simple Explanation |
|---------|---------|-------------------|
| `express` | Web server | Like the foundation of a building |
| `pg` | PostgreSQL connection | Like a translator for the database |
| `bcryptjs` | Password hashing | Like a password scrambler |
| `jsonwebtoken` | JWT tokens | Like creating digital ID cards |
| `multer` | File uploads | Like a file manager |
| `cloudinary` | Image storage | Like a photo album in the cloud |
| `cors` | Cross-origin requests | Like a security guard for websites |
| `dotenv` | Environment variables | Like a secret diary for settings |

---

## 🗄️ Database (Where we store information)

### What is PostgreSQL? 🤔

PostgreSQL is like a **super-smart filing cabinet** that can:

- Store millions of pieces of information
- Find information instantly
- Keep information safe and organized
- Handle multiple people using it at once

### Database Tables (Like different folders)

#### 1. **Users Table** 👥

```sql
-- Stores information about club members
CREATE TABLE signup (
    id SERIAL PRIMARY KEY,    -- Unique ID for each user
    name VARCHAR(255),        -- User's name
    email VARCHAR(255),       -- User's email
    password VARCHAR(255),    -- Encrypted password
    is_admin BOOLEAN          -- Is this user an admin?
);
```

#### 2. **Events Table** 📅

```sql
-- Stores information about club events
CREATE TABLE events (
    id SERIAL PRIMARY KEY,    -- Unique ID for each event
    title VARCHAR(255),       -- Event name
    description TEXT,         -- Event details
    date DATE,               -- When the event happens
    image_url VARCHAR(255)   -- Event photo
);
```

#### 3. **Contacts Table** 📧

```sql
-- Stores messages from visitors
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,    -- Unique ID for each message
    name VARCHAR(255),        -- Sender's name
    email VARCHAR(255),       -- Sender's email
    message TEXT,            -- The message content
    created_at TIMESTAMP     -- When message was sent
);
```

#### 4. **Admissions Table** 📝

```sql
-- Stores applications to join the club
CREATE TABLE admissions (
    id SERIAL PRIMARY KEY,    -- Unique ID for each application
    name VARCHAR(255),        -- Applicant's name
    email VARCHAR(255),       -- Applicant's email
    phone VARCHAR(20),        -- Applicant's phone
    age INTEGER,             -- Applicant's age
    experience TEXT,         -- Badminton experience
    created_at TIMESTAMP     -- When application was submitted
);
```

---

## 🧠 Important Concepts Explained

### 1. **Authentication & Authorization** 🔐

**Authentication** = "Who are you?"

- Like showing your ID at the entrance
- We use JWT tokens (digital ID cards)

**Authorization** = "What can you do?"

- Like having different access levels (member vs admin)
- Admins can see everything, members see limited stuff

### 2. **API (Application Programming Interface)** 🌐

**What it is**: Like a waiter taking your order to the kitchen

- Frontend asks for data → API → Backend processes → Database → Response

**Example**:

```
Frontend: "Show me all events"
API: "Get events from database"
Database: "Here are the events"
API: "Send events to frontend"
Frontend: "Display events to user"
```

### 3. **State Management** 🧠

**What it is**: How we remember and update information

- Like your brain remembering what you're doing

**Types**:

- **Local State**: Information only one component knows
- **Global State**: Information the whole app knows (like user login)

### 4. **CRUD Operations** 📝

**CRUD** = Create, Read, Update, Delete

- **Create**: Add new information (like adding a new event)
- **Read**: Get information (like viewing events)
- **Update**: Change information (like editing event details)
- **Delete**: Remove information (like deleting an event)

### 5. **Environment Variables** 🔧

**What it is**: Secret settings stored outside the code

- Like having a secret diary with important passwords
- Keeps sensitive information safe

**Example**:

```env
DB_HOST=localhost
DB_USER=myuser
DB_PASSWORD=mypassword
JWT_SECRET=mysecretkey
```

---

## 🚀 How to run the project

### Prerequisites (What you need first)

1. **Node.js** (version 16 or higher)
2. **PostgreSQL** database
3. **Git** (to download the project)

### Step 1: Download the project

```bash
git clone [your-project-url]
cd SportsSite
```

### Step 2: Set up the Backend

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=sports_club
DB_PORT=5432
JWT_SECRET=your_secret_key
SERVER_PORT=8081
```

### Step 3: Set up the Database

1. Create a PostgreSQL database named `sports_club`
2. Run the SQL scripts in `test.sql` or `modified_test.sql`

### Step 4: Start the Backend

```bash
npm run dev
```

### Step 5: Set up the Frontend

```bash
cd ../Frontend
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8081/api
```

### Step 6: Start the Frontend

```bash
npm run dev
```

### Step 7: Open your browser

Go to `http://localhost:5173` to see your website!

---

## 📁 File Structure

```
SportsSite/
├── Frontend/                 # What users see
│   ├── src/
│   │   ├── components/       # Reusable pieces
│   │   ├── pages/           # Different pages
│   │   ├── Wrapper/         # Special components
│   │   └── App.jsx          # Main app file
│   ├── public/              # Images and static files
│   └── package.json         # Frontend dependencies
│
└── Backend/                  # The brain
    ├── config/              # Settings and connections
    ├── controllers/         # Business logic
    ├── models/              # Database operations
    ├── routes/              # API endpoints
    ├── middleware/          # Security and helpers
    ├── public/              # Uploaded files
    └── Server.js            # Main server file
```

---

## 🎯 Key Features

### For Members

- ✅ View upcoming events
- ✅ Check attendance history
- ✅ Manage profile information
- ✅ View coaching schedules
- ✅ Check financial records

### For Admins

- ✅ Manage all events
- ✅ View and respond to contact messages
- ✅ Process admission applications
- ✅ Manage user accounts
- ✅ Upload event images

### For Visitors

- ✅ View club information
- ✅ Browse photo gallery
- ✅ Contact the club
- ✅ Apply for membership

---

## 🔧 Development Tools

### Code Quality

- **ESLint**: Like a spell-checker for code
- **Prettier**: Makes code look neat and organized

### Development Server

- **Vite**: Super-fast development server
- **Nodemon**: Automatically restarts server when code changes

### Version Control

- **Git**: Like a time machine for your code
- **GitHub**: Like a cloud storage for your code

---

## 🚨 Common Issues & Solutions

### 1. **Database Connection Error**

**Problem**: Can't connect to PostgreSQL
**Solution**: Check if PostgreSQL is running and credentials are correct

### 2. **Port Already in Use**

**Problem**: Port 8081 or 5173 is already used
**Solution**: Change ports in `.env` files or kill existing processes

### 3. **CORS Error**

**Problem**: Frontend can't talk to backend
**Solution**: Check CORS settings in backend and frontend URLs

### 4. **JWT Token Expired**

**Problem**: User gets logged out frequently
**Solution**: Check token expiration time and refresh logic

---

## 📚 Learning Resources

### React

- [React Official Docs](https://react.dev/)
- [React Router Tutorial](https://reactrouter.com/)

### Node.js

- [Express.js Guide](https://expressjs.com/)
- [Node.js Tutorial](https://nodejs.org/en/learn/)

### Database

- [PostgreSQL Tutorial](https://www.postgresql.org/docs/)
- [SQL Basics](https://www.w3schools.com/sql/)

### General

- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)

---

## 🤝 Contributing

Want to help improve this project? Here's how:

1. **Fork** the project
2. **Create** a new branch for your feature
3. **Make** your changes
4. **Test** everything works
5. **Submit** a pull request

---

## 📞 Support

Having trouble? Here's how to get help:

1. **Check** this documentation first
2. **Look** at the error messages carefully
3. **Search** online for similar problems
4. **Ask** in the project discussions

---

## 🎉 Conclusion

This Sports Club project is a **full-stack web application** that demonstrates modern web development practices. It uses:

- **React** for a beautiful, interactive frontend
- **Node.js/Express** for a powerful, scalable backend
- **PostgreSQL** for reliable data storage
- **JWT** for secure authentication
- **Modern tools** for fast development

The project shows how to build a real-world application that can handle multiple users, different roles, and complex features while maintaining good code organization and security practices.

**Remember**: The best way to learn is by doing! Try modifying features, adding new ones, and experimenting with the code. Happy coding! 🚀

---

*Last updated: December 2024*
*Created with ❤️ for the Sports Club community*
