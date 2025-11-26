# CampusConnect Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Student APIs

### 1. Get All Students
```http
GET /api/students
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "branch": "Computer Science",
    "batch": "2024",
    "isPlaced": false,
    "image": "https://i.ibb.co/TqK1XTQm/image-5.jpg",
    "pronouns": "He/Him",
    "location": "Delhi, India",
    "headline": "Full Stack Developer",
    "skills": {
      "dsa": ["Arrays", "Trees"],
      "development": ["React", "Node.js"]
    },
    "socialLinks": {
      "github": "https://github.com/johndoe",
      "linkedin": "https://linkedin.com/in/johndoe"
    },
    "resumeLink": "https://resume.com/john",
    "dsaProblems": 200,
    "rollNumber": "CS2024001",
    "email": "john@example.com"
  }
]
```

### 2. Get Student by ID
```http
GET /api/students/:id
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  ...
}
```

**Response (404 Not Found):**
```json
{
  "message": "Student not found"
}
```

### 3. Create Student
```http
POST /api/students
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 101,
  "name": "Rahul Sharma",
  "branch": "Computer Science",
  "batch": "2024",
  "pronouns": "He/Him",
  "location": "Delhi, India",
  "headline": "Full Stack Developer | MERN Stack",
  "image": "https://i.ibb.co/TqK1XTQm/image-5.jpg",
  "skills": {
    "dsa": ["Arrays", "Dynamic Programming"],
    "development": ["React", "Node.js"]
  },
  "socialLinks": {
    "github": "https://github.com/rahul",
    "linkedin": "https://linkedin.com/in/rahul"
  },
  "resumeLink": "https://resume.com/rahul",
  "dsaProblems": 250,
  "rollNumber": "CS2024101",
  "email": "rahul@example.com"
}
```

**Response (201 Created):**
```json
{
  "id": 101,
  "name": "Rahul Sharma",
  ...
}
```

**Response (400 Bad Request):**
```json
{
  "errors": [
    {
      "msg": "Name is required",
      "param": "name"
    }
  ]
}
```

### 4. Update Student
```http
PUT /api/students/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 101,
  "name": "Rahul Sharma Updated",
  "branch": "Computer Science",
  "batch": "2024",
  "pronouns": "He/Him",
  "location": "Mumbai, India",
  "headline": "Senior Full Stack Developer",
  "isPlaced": true
}
```

**Response (200 OK):**
```json
{
  "id": 101,
  "name": "Rahul Sharma Updated",
  ...
}
```

### 5. Delete Student
```http
DELETE /api/students/:id
```

**Response (200 OK):**
```json
{
  "message": "Student deleted successfully"
}
```

---

## Alumni APIs

### 1. Get All Alumni
```http
GET /api/alumni
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Priya Gupta",
    "branch": "Information Technology",
    "batch": "2020",
    "pronouns": "She/Her",
    "location": "Bangalore, India",
    "headline": "Senior Engineer at Google",
    "image": "https://i.ibb.co/TqK1XTQm/image-5.jpg",
    "company": "Google",
    "techStack": ["Python", "Go", "Kubernetes"],
    "socialLinks": {
      "github": "https://github.com/priya",
      "linkedin": "https://linkedin.com/in/priya"
    },
    "resumeLink": "https://resume.com/priya",
    "email": "priya@example.com"
  }
]
```

### 2. Get Alumni by ID
```http
GET /api/alumni/:id
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Priya Gupta",
  ...
}
```

### 3. Create Alumni
```http
POST /api/alumni
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 201,
  "name": "Priya Gupta",
  "branch": "Information Technology",
  "batch": "2020",
  "pronouns": "She/Her",
  "location": "Bangalore, India",
  "headline": "Senior Software Engineer at Google",
  "image": "https://i.ibb.co/TqK1XTQm/image-5.jpg",
  "company": "Google",
  "techStack": ["Python", "Go", "Kubernetes"],
  "socialLinks": {
    "github": "https://github.com/priya",
    "linkedin": "https://linkedin.com/in/priya"
  },
  "resumeLink": "https://resume.com/priya",
  "email": "priya@example.com"
}
```

**Response (201 Created):**
```json
{
  "id": 201,
  "name": "Priya Gupta",
  ...
}
```

### 4. Update Alumni
```http
PUT /api/alumni/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 201,
  "name": "Priya Gupta",
  "branch": "Information Technology",
  "batch": "2020",
  "pronouns": "She/Her",
  "location": "Bangalore, India",
  "headline": "Staff Engineer at Google",
  "company": "Google"
}
```

**Response (200 OK):**
```json
{
  "id": 201,
  "name": "Priya Gupta",
  ...
}
```

### 5. Delete Alumni
```http
DELETE /api/alumni/:id
```

**Response (200 OK):**
```json
{
  "message": "Alumni deleted successfully"
}
```

---

## Validation Rules

### Student Validation
- `id`: Required, must be a number
- `name`: Required, must be a string
- `branch`: Required, must be a string
- `batch`: Required, must be a string
- `email`: Optional, must be valid email format

### Alumni Validation
- `id`: Required, must be a number
- `name`: Required, must be a string
- `branch`: Required, must be a string
- `batch`: Required, must be a string
- `company`: Required, must be a string
- `email`: Optional, must be valid email format

---

## Error Responses

### 400 Bad Request
```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name"
    }
  ]
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Something went wrong!"
}
```

---

## Running the Backend

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start MongoDB (make sure MongoDB is running on localhost:27017)

3. Start the server:
```bash
npm start
```

4. Run tests:
```bash
node test-apis.js
```

Or use the REST client with `test-api.rest` file in VS Code with REST Client extension.
