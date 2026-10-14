const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";

window.onload = function() {
    if (localStorage.getItem("loggedIn") === "true") {
        showApp();
    }
    
    // Dynamic Copyright Year
    document.getElementById("copyYear").innerText = new Date().getFullYear();

    loadStudents();
    loadSubjects();
    loadTimetable();
    updateDashboard();
};

/* Scroll Indicator & Back To Top */
window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";

    let btn = document.getElementById("backToTop");
    if (winScroll > 200) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Dark Mode Toggle */
function toggleDarkMode() {
    document.body.classList.toggle("dark-theme");
    showToast("Theme switched successfully");
}

/* Mobile Sidebar Toggle */
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("open");
}

/* Toast Messages */
function showToast(message, isError = false) {
    let container = document.getElementById("toastContainer");
    let toast = document.createElement("div");
    toast.className = `toast ${isError ? 'error' : ''}`;
    toast.innerText = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/* LOGIN */
function login() {
    let u = document.getElementById("username").value;
    let p = document.getElementById("password").value;

    if (u === ADMIN_USERNAME && p === ADMIN_PASSWORD) {
        localStorage.setItem("loggedIn", "true");
        showApp();
        showToast("Login Successful");
    } else {
        showToast("Invalid Credentials", true);
    }
}

function logout() {
    localStorage.removeItem("loggedIn");
    location.reload();
}

function showApp() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("app").style.display = "block";
}

function showSection(id) {
    document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
    if(window.innerWidth <= 768) {
        document.getElementById("sidebar").classList.remove("open");
    }
}

/* STUDENTS */
function addStudent() {
    let input = document.getElementById("studentName");
    let name = input.value.trim();
    if (name === "") return;

    db.collection("students").add({ name: name }).then(() => {
        input.value = "";
        loadStudents();
        showToast("Student Added!");
    });
}

function loadStudents() {
    let table = document.querySelector("#studentTable tbody");
    let reportSelect = document.getElementById("studentReportSelect");
    if (!table) return;

    table.innerHTML = "";
    reportSelect.innerHTML = "";

    db.collection("students").get().then(snapshot => {
        snapshot.forEach(doc => {
            let s = doc.data();
            table.innerHTML += `<tr><td>${s.name}</td><td><button onclick="deleteStudent('${doc.id}')">Delete</button></td></tr>`;
            reportSelect.innerHTML += `<option value="${s.name}">${s.name}</option>`;
        });
        updateDashboard();
    });
}

function deleteStudent(id) {
    if (confirm("Delete student?")) {
        db.collection("students").doc(id).delete().then(() => {
            loadStudents();
            showToast("Student Removed");
        });
    }
}

function searchStudent() {
    let input = document.getElementById("searchStudent").value.toLowerCase();
    let rows = document.querySelectorAll("#studentTable tbody tr");

    rows.forEach(row => {
        let name = row.children[0].innerText.toLowerCase();
        row.style.display = name.includes(input) ? "" : "none";
    });
}

/* SUBJECTS */
function addSubject() {
    let sub = document.getElementById("subjectName").value.trim();
    let teacher = document.getElementById("teacherName").value.trim();

    if (sub === "" || teacher === "") return;

    db.collection("subjects").add({ subject: sub, teacher: teacher }).then(() => {
        document.getElementById("subjectName").value = "";
        document.getElementById("teacherName").value = "";
        loadSubjects();
        showToast("Subject Added");
    });
}

function loadSubjects() {
    let subjectSelect = document.getElementById("subjectSelect");
    let subjectTable = document.querySelector("#subjectTable tbody");
    if (subjectSelect) subjectSelect.innerHTML = "";
    if (subjectTable) subjectTable.innerHTML = "";

    db.collection("subjects").get().then(snapshot => {
        snapshot.forEach(doc => {
            let s = doc.data();
            if (subjectSelect) subjectSelect.innerHTML += `<option value="${s.subject}">${s.subject} (${s.teacher})</option>`;
            if (subjectTable) subjectTable.innerHTML += `<tr><td>${s.subject}</td><td>${s.teacher}</td><td><button onclick="deleteSubject('${doc.id}')">Delete</button></td></tr>`;
        });
        updateDashboard();
    });
}

function deleteSubject(id) {
    if (confirm("Delete subject?")) {
        db.collection("subjects").doc(id).delete().then(() => {
            loadSubjects();
            showToast("Subject Removed");
        });
    }
}

/* ATTENDANCE */
function markAttendance() {
    let date = document.getElementById("attendanceDate").value;
    let subject = document.getElementById("subjectSelect").value;
    let container = document.getElementById("attendanceSection");

    if (!date || !subject) {
        showToast("Select date & subject", true);
        return;
    }

    container.innerHTML = "Loading...";

    db.collection("students").get().then(snapshot => {
        container.innerHTML = "";
        snapshot.forEach(doc => {
            let s = doc.data();
            container.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; background:white; padding:10px; margin:5px 0; border-radius:5px;">
                    <span><b>${s.name}</b></span>
                    <div>
                        <button style="background:#2ecc71" onclick="saveAttendance('${s.name}','${subject}','${date}','Present')">Present</button>
                        <button style="background:#e74c3c" onclick="saveAttendance('${s.name}','${subject}','${date}','Absent')">Absent</button>
                    </div>
                </div>`;
        });
    });
}

function saveAttendance(student, subject, date, status) {
    let docId = `${student.replace(/\s+/g, '_')}_${subject.replace(/\s+/g, '_')}_${date}`;

    db.collection("attendance").doc(docId).set({
        student: student,
        subject: subject,
        date: date,
        status: status
    }).then(() => {
        showToast(`Marked ${status} for ${student}`);
        updateDashboard();
    });
}

/* TIMETABLE */
function addTimetable() {
    let day = document.getElementById("daySelect").value;
    let sub = document.getElementById("ttSubject").value;
    let teacher = document.getElementById("ttTeacher").value;
    let time = document.getElementById("ttTime").value;

    if (!day || !sub || !teacher || !time) {
        showToast("Fill all fields", true);
        return;
    }

    db.collection("timetable").add({ day, subject: sub, teacher, time }).then(() => {
        loadTimetable();
        showToast("Slot Added");
    });
}

function loadTimetable() {
    let tbody = document.querySelector("#ttTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    db.collection("timetable").get().then(snapshot => {
        snapshot.forEach(doc => {
            let t = doc.data();
            tbody.innerHTML += `<tr><td>${t.day}</td><td>${t.subject}</td><td>${t.teacher}</td><td>${t.time}</td><td><button onclick="deleteTimetable('${doc.id}')">Delete</button></td></tr>`;
        });
    });
}

function deleteTimetable(id) {
    if (confirm("Delete slot?")) {
        db.collection("timetable").doc(id).delete().then(() => {
            loadTimetable();
            showToast("Slot Deleted");
        });
    }
}

/* REPORT & COPY BUTTON */
function viewStudentReport() {
    let student = document.getElementById("studentReportSelect").value;
    let res = document.getElementById("studentReportResult");

    if (!student) return;

    db.collection("attendance").where("student", "==", student).get().then(snapshot => {
        let present = 0, total = 0;
        snapshot.forEach(doc => {
            total++;
            if (doc.data().status === "Present") present++;
        });

        let percent = total === 0 ? 0 : ((present / total) * 100).toFixed(1);
        res.innerHTML = `<h3>Report for ${student}</h3><p>Present: ${present} / Total: ${total}</p><p>Percentage: ${percent}%</p>`;
    });
}

function copyReportToClipboard() {
    let text = document.getElementById("studentReportResult").innerText;
    if (!text) {
        showToast("No report to copy!", true);
        return;
    }
    navigator.clipboard.writeText(text);
    showToast("Report Copied to Clipboard!");
}

/* DASHBOARD */
function updateDashboard() {
    db.collection("students").get().then(s => document.getElementById("totalStudents").innerText = s.size);
    db.collection("subjects").get().then(s => document.getElementById("totalSubjects").innerText = s.size);
    db.collection("attendance").get().then(s => document.getElementById("totalAttendance").innerText = s.size);
}