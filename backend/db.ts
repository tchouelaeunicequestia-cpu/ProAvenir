import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load the credentials from the .env file
dotenv.config();

// Create the database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// A quick check to ensure the connection works when the server starts
pool.getConnection()
    .then((connection) => {
        console.log('✅ Successfully connected to the ProAvenir MySQL database!');
        connection.release(); // Always release the connection back to the pool
    })
    .catch((err) => {
        console.error('❌ Database connection failed:', err.message);
    });

export default pool;