import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const port = 3001;


app.use(cors());
app.use(bodyParser.json());


const dbConfig = {
    host: 'localhost',
    user: 'root', 
    password: 'root', 
    database: 'bank', 
    port: 3306 
};


function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}


app.post('/users', async (req, res) => {
    const { username, password } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password]
        );
        const userId = result.insertId;
        await connection.execute(
            'INSERT INTO accounts (userId, amount) VALUES (?, ?)',
            [userId, 0]
        );
        await connection.end();
        res.status(201).json({ message: "Användare skapad" });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});


app.post('/sessions', async (req, res) => {
    const { username, password } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [users] = await connection.execute(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password]
        );
        if (users.length > 0) {
            const user = users[0];
            const otp = generateOTP();
            await connection.execute(
                'INSERT INTO sessions (userId, token) VALUES (?, ?)',
                [user.id, otp]
            );
            await connection.end();
            res.status(200).json({ otp });
        } else {
            res.status(401).json({ message: 'Fel användarnamn eller lösenord' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});


app.post('/me/accounts', async (req, res) => {
    const { token } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [sessions] = await connection.execute(
            'SELECT * FROM sessions WHERE token = ?',
            [token]
        );
        if (sessions.length > 0) {
            const session = sessions[0];
            const [accounts] = await connection.execute(
                'SELECT * FROM accounts WHERE userId = ?',
                [session.userId]
            );
            await connection.end();
            res.status(200).json({ accounts });
        } else {
            res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        console.error('Error fetching account balance:', error);
        res.status(500).json({ message: 'Error fetching account balance' });
    }
});


app.post('/me/accounts/transactions', async (req, res) => {
    const { token, amount } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [sessions] = await connection.execute(
            'SELECT * FROM sessions WHERE token = ?',
            [token]
        );
        if (sessions.length > 0) {
            const session = sessions[0];
            await connection.execute(
                'UPDATE accounts SET amount = amount + ? WHERE userId = ?',
                [amount, session.userId]
            );
            const [accounts] = await connection.execute(
                'SELECT * FROM accounts WHERE userId = ?',
                [session.userId]
            );
            await connection.end();
            res.status(200).json({ message: "Deposit successful", accounts });
        } else {
            res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        console.error('Error depositing money:', error);
        res.status(500).json({ message: 'Error depositing money' });
    }
});


app.listen(port, () => {
    console.log(`Bankens backend körs på http://localhost:${port}`);
});
