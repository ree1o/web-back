# Book Management API

## Overview
This project is a **Book Management API** built using **Node.js, Express, and MongoDB**. It allows users to perform CRUD operations on a book collection and fetch weather data using the OpenWeather API.

## Features
- **Book Management**:
  - Fetch all books
  - Add a new book
  - Update book details
  - Delete a book
- **Weather API Integration**:
  - Fetch current weather data for a given city.
- **Swagger Documentation** for API endpoints.
- **Error Handling & Validation** included.
- **Deployment on Render**.

---

## Setup Instructions

### Prerequisites
- Node.js installed (v16+ recommended)
- MongoDB installed and running locally OR a MongoDB Atlas instance.
- An OpenWeather API key (if using weather functionality).

### Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/ree1o/web-back
   cd web-back
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root directory (or just use mine in zip-folder).
   - Add the following variables:
     ```env
     MONGO_URI=mongodb://localhost:27017
     WEATHER_API_KEY=your_api_key_here
     BASE_URL=http://localhost:3000
     ```

### Running the API Locally
1. **Start the MongoDB server** (if using a local database):
   ```sh
   mongod
   ```
2. **Run the API server:**
   ```sh
   npm start
   ```
3. The server should now be running on `http://localhost:3000`.

## API Endpoints

### Book Management
| Method | Endpoint         | Description |
|--------|-----------------|-------------|
| GET    | `/books`        | Fetch all books |
| POST   | `/books`        | Add a new book |
| PUT    | `/books/:id`    | Update book details |
| DELETE | `/books/:id`    | Delete a book |

### Weather API
| Method | Endpoint         | Description |
|--------|-----------------|-------------|
| GET    | `/weather/:city` | Fetch weather data for a city |

---
## Testing the API
Use **Postman** or **cURL** to test endpoints.
Example request:
```sh
curl -X GET http://localhost:3000/books
```
curl -X GET http://localhost:3000/weather/Pavlodar
```
To POST might need to create file books.json
Then paste this:
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "year": 1925,
  "genre": "Fiction"
}
Then run this command:
```sh
curl -X POST "http://localhost:3000/books" -H "Content-Type: application/json" --data "@book.json"
```

Or use Invoke-RestMethod instead:

$body = @{
    title = "The Great Gatsby"
    author = "F. Scott Fitzgerald"
    year = 1925
    genre = "Fiction"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:3000/books" -Method POST -Body $body -ContentType "application/json"

## Notes
- Ensure **MongoDB is running** before starting the API.
- Keep `.env` file values **private** and **do not commit** them to GitHub.
- Follow best practices for **error handling and validation**.

---
