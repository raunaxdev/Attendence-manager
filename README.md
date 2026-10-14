# 🎓 CIITM Attendance Management System

A web-based **Attendance & Student Management System** designed for **Chhotanagpur Institute of Information Technology and Management (CIITM), Dhanbad**. 

This application allows administrators and faculty members to manage student databases, subject assignments, daily class attendance, class timetables, and generate attendance percentage reports.

---

## 🌟 Key Features

* **🔒 Role-Based Admin Login:** Secure authentication system using local session storage.
* **📊 Dynamic Dashboard:** Displays real-time statistics including total students, registered subjects, and attendance entries.
* **👥 Student Management:** Add new students, search student records instantly, and remove old entries.
* **📚 Subject Management:** Assign subjects along with respective faculty/teachers.
* **📅 Attendance Tracking:** Mark daily student attendance (`Present` / `Absent`) for specific subjects with duplicate entry prevention.
* **🗓️ Time Table Generator:** Manage and schedule weekly time slots for various subjects and teachers.
* **📈 Attendance Reports:** Automatically calculates and displays total classes, present count, and attendance percentage per student.
* **📋 Clipboard Integration:** One-click option to copy attendance reports directly to the clipboard.
* **🌙 Dark Mode Support:** Toggle between Light and Dark visual modes for better accessibility.
* **📱 Fully Responsive UI:** Mobile-first layout with collapsible sidebar navigation and sticky headers.
* **⚡ Progress Bar & Toasts:** Interactive UI notifications and smooth page scrolling indicators.

---

## 🛠️ Tech Stack & Technologies Used

* **Frontend:** HTML5, CSS3, JavaScript (ES6)
* **Styling & Fonts:** Custom Responsive CSS, Google Fonts (*Poppins*)
* **Database & Cloud:** Firebase Firestore (Realtime NoSQL Database)
* **SDK:** Firebase Web SDK v10.12.2 (Compat Mode)

---

## 📁 Project Structure

```text
ciitm-attendance-system/
├── index.html         # Main HTML layout & structure
├── style.css          # Global styles, mobile media queries, and themes
├── script.js         # Firebase logic, DOM manipulation, and app functionality
├── logo.jpg           # Institute logo asset
└── README.md          # Documentation file
