# Student Management System (SSIP)

A full-stack web application for managing students and their fee records, including Aadhaar uploads, fee installments, and Excel exports.

## Features

- **Student Management:** Add, update, view, and export student records.
- **Fee Management:** Assign fee codes, record installments, update deposited amounts, and export fee data.
- **Aadhaar Upload:** Securely upload and manage student Aadhaar documents.
- **Excel Export:** Download student and fee data as Excel files.
- **Authentication:** Protected routes, JsonWebTokens and login for managers.
- **Modern UI:** Responsive dashboard, navigation, and interactive cards.
- **Result Management:** Enter, update, and view student results subject-wise or practical-wise. Prefill marks from previous entries, validate input ranges, and export results as needed.

## Tech Stack

- **Frontend:** React, Tailwind CSS, React Router, Axios, React Toastify
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT
- **File Storage:** Cloudinary (for Aadhaar uploads)
- **Excel Export:** ExcelJS

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- Cloudinary account (for Aadhaar uploads)

### Setup

#### 1. Clone the repository

```bash
git clone https://github.com/adeebkhans/StudentManagement.git
cd StudentManagement
```

#### 2. Backend

```bash
cd Backend
npm install
# Create a .env file with your MongoDB and Cloudinary credentials
npm start
```

#### 3. Frontend

```bash
cd ../Frontend
npm install
# Create a .env file with VITE_API_BASE_URL pointing to your backend (e.g., http://localhost:3009/api/v1)
npm run dev
```

### Environment Variables

**Backend (.env):**
```
MONGODB_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
```

**Frontend (.env):**
```
VITE_API_BASE_URL=http://localhost:3009/api/v1
```

## Usage

- Visit `http://localhost:5173` (or the port shown in your terminal).
- Login with your manager credentials.
- Use the dashboard to navigate to Students or Fees.
- Export data using the provided buttons.
- Manage fee installments and Aadhaar uploads as needed.

## Folder Structure

```
Backend/
  Controllers/
  Routes/
  Schemas/
  Utils/
Frontend/
  src/
    api/
    components/
    pages/
    App.jsx
    ...
```

## API Endpoints

- `POST /api/v1/auth/login` - Login
- `GET /api/v1/students` - List students
- `GET /api/v1/fees` - List fees
- `POST /api/v1/fees` - Create fee
- `PUT /api/v1/fees/:id` - Update fee (installment)
- `GET /api/v1/fees/export/excel` - Export fees as Excel
- ...and more (see collection)

## License

MIT

---

**Made with ❤️ for SSIP**
