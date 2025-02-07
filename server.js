// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Management API',
      version: '1.0.0',
      description: 'API for managing books and fetching weather data',
    },
    servers: [{ url: process.env.BASE_URL || 'http://localhost:3000' }],
  },
  apis: ['./server.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define Book Schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
});

const Book = mongoose.model('Book', bookSchema);

app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/books', async (req, res) => {
  try {
    const { title, author, year, genre } = req.body;
    if (!title || !author) {
      return res.status(400).json({ message: 'Title and Author are required' });
    }
    const newBook = new Book({ title, author, year, genre });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/books/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/weather/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const apiKey = process.env.WEATHER_API_KEY;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const { name, main, weather } = response.data;
    res.json({
      city: name,
      temperature: `${main.temp}°C`,
      condition: weather[0].description,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Render Deployment Configuration
const fs = require('fs');
fs.writeFileSync('render.yaml', `
services:
  - type: web
    name: book-api
    env: node
    buildCommand: npm install
    startCommand: node server.js
    plan: free
    envVars:
      - key: MONGO_URI
        sync: false
      - key: WEATHER_API_KEY
        sync: false
`);
