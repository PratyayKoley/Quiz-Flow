import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';

dotenv.config();
const app: Application = express();
const port = process.env.PORT || 5000;
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
})

app.get('/api', async (_req: Request, res: Response): Promise<void> => {
    try {
        const response = await axios.get('https://api.jsonserve.com/Uw5CrX');
        console.log(response.data);
        res.json(response.data);  
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})