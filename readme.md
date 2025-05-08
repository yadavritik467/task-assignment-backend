# Task Assignment Backend (Node.js with TypeScript)

This is the backend part of a Task Management System designed to help small teams effectively manage tasks. It includes functionality for user authentication, task management, team collaboration, and notifications.

## Features:
- **User Authentication**: 
  - User registration and login
  - Admin login
  - JWT-based authentication
- **Task Management**:
  - Create, Read, Update, Delete (CRUD) operations for tasks
  - Tasks have attributes such as title, description, priority, status, due date, and assigned user
- **Team Collaboration**:
  - Assign tasks to other users
  - Notification system when tasks are assigned
- **Search and Filtering**:
  - Filter tasks by status, priority, due date, and more
- **Notifications**:
  - Get notified when a task is assigned or updated

---

## Tech Stack

- **Node.js (with TypeScript)** - Backend framework
- **MongoDB** - Database
- **Express.js** - Web framework
- **JWT (JSON Web Token)** - Authentication
- **Bcrypt.js** - Password hashing
- **Socket.IO** - Real-time notifications
- **Mongoose** - MongoDB Object Data Modeling (ODM)

---

## Prerequisites

1. **Node.js** installed on your system.
2. **MongoDB Atlas** account for the cloud database (or any other MongoDB instance).
3. Basic understanding of TypeScript and Node.js.

---

## Installation & Setup

Follow the steps below to get the backend application up and running.

### 1. Clone the repository

```bash
git clone https://github.com/yadavritik467/task-assignment-backend
cd task-assignment-backend
