📚 School Management System
A full-stack web application to manage students, teachers, subjects, class lectures, and enrollments, built with Angular (frontend) and ASP.NET Core Web API (backend).

📂 Project Structure
OakStreet/
├── school-management-system/   # Angular frontend
└── SchoolAPI/                  # ASP.NET Core backend

🚀 Features
📋 Students Module – Create, read, update, delete student records

👩‍🏫 Teachers Module – Manage teacher data

📘 Subjects Module – Link subjects to teachers

🏫 Class Lectures – Schedule and assign subjects/teachers

🧑‍🎓 Enrollments – Enroll students in class lectures

✅ Reactive Forms with validation

🌐 REST API integration

📦 Modular and clean architecture

🛠️ Technologies Used
Frontend:
Angular 17+
RxJS
TypeScript
Reactive Forms
Angular Routing & Standalone Components

Backend:
ASP.NET Core Web API (.NET 8)
Entity Framework Core
MySQL 
RESTful endpoints

⚙️ Getting Started
📦 Clone the repository:
git clone https://github.com/Alishba-Sajid/School-Management-System.git
cd School-Management-System

🔧 Run Backend (ASP.NET Core)
Open SchoolAPI in Visual Studio.
Update your appsettings.json with your database connection string.
Run migrations (if needed):
dotnet ef database update

Start the API using:
dotnet run

🌐 Run Frontend (Angular)
Open terminal in school-management-system folder.
Install dependencies:
npm install

Run the app:
ng serve
Visit: http://localhost:4200/
