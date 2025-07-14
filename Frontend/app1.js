let currentUser = null;
let students = [
  { id: 1, name: "John Doe", email: "john@example.com", degree: "BSc CS" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", degree: "BSc IT" }
];
let faculty = [
  { id: 1, name: "Dr. Alice", email: "alice@example.com", course: "Mathematics" }
];
let attendanceData = [
  { studentId: 1, present: 18, absent: 2, total: 20, absentDates: ["2025-06-01", "2025-06-02"] },
  { studentId: 2, present: 19, absent: 1, total: 20, absentDates: ["2025-06-03"] }
];
let marksData = [
  { studentId: 1, subject: "Mathematics", examType: "midterm", marks: 85 },
  { studentId: 1, subject: "Physics", examType: "midterm", marks: 78 },
  { studentId: 2, subject: "Mathematics", examType: "midterm", marks: 90 }
];

// Login
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const role = document.getElementById('role').value;
  currentUser = { username, role };
  document.getElementById('loginSection').classList.remove('active-section');
  document.getElementById(`${role}Dashboard`).classList.add('active-section');
  if (role === 'student') {
    showStudentSection('profile');
    loadStudentProfile();
  } else if (role === 'faculty') {
    showFacultySection('profile');
    loadFacultyProfile();
  } else {
    showAdminSection('manageStudents');
    renderStudents();
    renderFaculty();
  }
});

// Logout
function logout() {
  currentUser = null;
  document.querySelectorAll('.dashboard-section').forEach(section => section.classList.remove('active-section'));
  document.getElementById('loginSection').classList.add('active-section');
  document.getElementById('loginForm').reset();
}

// Student Dashboard
function showStudentSection(section) {
  document.querySelectorAll('#studentDashboard .card').forEach(card => card.classList.remove('active-section'));
  document.getElementById(`student${section.charAt(0).toUpperCase() + section.slice(1)}`).classList.add('active-section');
  if (section === 'profile') loadStudentProfile();
  else if (section === 'attendance') loadStudentAttendance();
  else if (section === 'marks') loadStudentMarks();
}

function loadStudentProfile() {
  const student = students[0]; // Assuming first student for demo
  document.getElementById('studentName').textContent = student.name;
  document.getElementById('studentEmail').textContent = student.email;
  document.getElementById('studentDegree').textContent = student.degree;
}

function loadStudentAttendance() {
  const attendance = attendanceData[0]; // Assuming first student for demo
  const percentage = (attendance.present / attendance.total) * 100;
  document.getElementById('attendancePercentage').textContent = percentage.toFixed(2);
  document.getElementById('presentDays').textContent = attendance.present;
  document.getElementById('absentDays').textContent = attendance.absent;
  document.getElementById('totalDays').textContent = attendance.total;
  const absentList = document.getElementById('absentDetails');
  absentList.innerHTML = '';
  attendance.absentDates.forEach(date => {
    const li = document.createElement('li');
    li.textContent = date;
    absentList.appendChild(li);
  });
}

function loadStudentMarks() {
  const tableBody = document.getElementById('marksTable');
  tableBody.innerHTML = '';
  const studentMarks = marksData.filter(mark => mark.studentId === 1); // Assuming first student
  studentMarks.forEach(mark => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${mark.subject}</td>
      <td>${mark.examType}</td>
      <td>${mark.marks}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Faculty Dashboard
function showFacultySection(section) {
  document.querySelectorAll('#facultyDashboard .card').forEach(card => card.classList.remove('active-section'));
  document.getElementById(`faculty${section.charAt(0).toUpperCase() + section.slice(1)}`).classList.add('active-section');
  if (section === 'profile') loadFacultyProfile();
  else if (section === 'markAttendance') loadStudentsForAttendance();
}

function loadFacultyProfile() {
  const facultyMember = faculty[0]; // Assuming first faculty for demo
  document.getElementById('facultyName').textContent = facultyMember.name;
  document.getElementById('facultyEmail').textContent = facultyMember.email;
  document.getElementById('facultyCourse').textContent = facultyMember.course;
}

function loadStudentsForAttendance() {
  const section = document.getElementById('section').value;
  const tableBody = document.getElementById('attendanceTable');
  tableBody.innerHTML = '';
  students.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.name}</td>
      <td>
        <select class="form-control" id="attendance_${student.id}">
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function submitAttendance() {
  const section = document.getElementById('section').value;
  students.forEach(student => {
    const status = document.getElementById(`attendance_${student.id}`).value;
    const attendance = attendanceData.find(a => a.studentId === student.id);
    if (status === 'present') {
      attendance.present += 1;
    } else {
      attendance.absent += 1;
      attendance.absentDates.push(new Date().toISOString().split('T')[0]);
    }
    attendance.total += 1;
  });
  alert('Attendance submitted!');
}

document.getElementById('uploadMarksForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const examType = document.getElementById('examType').value;
  const subject = document.getElementById('subject').value;
  const studentMarks = JSON.parse(document.getElementById('studentMarks').value);
  studentMarks.forEach(mark => {
    marksData.push({ studentId: mark.studentId, subject, examType, marks: mark.marks });
  });
  alert('Marks uploaded!');
  document.getElementById('uploadMarksForm').reset();
});

// Admin Dashboard
function showAdminSection(section) {
  document.querySelectorAll('#adminDashboard .card').forEach(card => card.classList.remove('active-section'));
  document.getElementById(section).classList.add('active-section');
  if (section === 'manageStudents') renderStudents();
  else renderFaculty();
}

function renderStudents() {
  const tableBody = document.getElementById('studentTable');
  tableBody.innerHTML = '';
  students.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.email}</td>
      <td>${student.degree}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editStudent(${student.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function renderFaculty() {
  const tableBody = document.getElementById('facultyTable');
  tableBody.innerHTML = '';
  faculty.forEach(fac => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${fac.name}</td>
      <td>${fac.email}</td>
      <td>${fac.course}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editFaculty(${fac.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteFaculty(${fac.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

document.getElementById('studentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const id = document.getElementById('studentId').value;
  const name = document.getElementById('studentNameInput').value;
  const email = document.getElementById('studentEmailInput').value;
  const degree = document.getElementById('studentDegreeInput').value;
  if (id) {
    students = students.map(student => 
      student.id === parseInt(id) ? { id: parseInt(id), name, email, degree } : student
    );
    document.getElementById('studentSubmitBtn').textContent = 'Add Student';
  } else {
    students.push({ id: Date.now(), name, email, degree });
    attendanceData.push({ studentId: Date.now(), present: 0, absent: 0, total: 0, absentDates: [] });
  }
  document.getElementById('studentForm').reset();
  document.getElementById('studentId').value = '';
  renderStudents();
});

document.getElementById('facultyForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const id = document.getElementById('facultyId').value;
  const name = document.getElementById('facultyNameInput').value;
  const email = document.getElementById('facultyEmailInput').value;
  const course = document.getElementById('facultyCourseInput').value;
  if (id) {
    faculty = faculty.map(fac => 
      fac.id === parseInt(id) ? { id: parseInt(id), name, email, course } : fac
    );
    document.getElementById('facultySubmitBtn').textContent = 'Add Faculty';
  } else {
    faculty.push({ id: Date.now(), name, email, course });
  }
  document.getElementById('facultyForm').reset();
  document.getElementById('facultyId').value = '';
  renderFaculty();
});

function editStudent(id) {
  const student = students.find(s => s.id === id);
  document.getElementById('studentId').value = student.id;
  document.getElementById('studentNameInput').value = student.name;
  document.getElementById('studentEmailInput').value = student.email;
  document.getElementById('studentDegreeInput').value = student.degree;
  document.getElementById('studentSubmitBtn').textContent = 'Update Student';
}

function deleteStudent(id) {
  students = students.filter(s => s.id !== id);
  attendanceData = attendanceData.filter(a => a.studentId !== id);
  marksData = marksData.filter(m => m.studentId !== id);
  renderStudents();
}

function editFaculty(id) {
  const fac = faculty.find(f => f.id === id);
  document.getElementById('facultyId').value = fac.id;
  document.getElementById('facultyNameInput').value = fac.name;
  document.getElementById('facultyEmailInput').value = fac.email;
  document.getElementById('facultyCourseInput').value = fac.course;
  document.getElementById('facultySubmitBtn').textContent = 'Update Faculty';
}

function deleteFaculty(id) {
  faculty = faculty.filter(f => f.id !== id);
  renderFaculty();
}