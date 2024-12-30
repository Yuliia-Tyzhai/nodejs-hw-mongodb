import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

export const setupServer = () => {
const app = express();

app.use(cors());
app.use(express.json());
// app.use(pino({
//     transport: {
//         target: "pino-pretty"
//     }
// }));

app.get("/", (req, res) => {
    res.json({
        message: "Start work"
    });
});

app.use((req, res) => {
    res.status(404).json({
        message: "Not found"
    });
});

app.use((error, res, req, next) => {
res.status(500).json({
    message: "Server error",
    error: error.message,
});
});

app.listen(3000, () => console.log("Server running on 3000 port"));
};