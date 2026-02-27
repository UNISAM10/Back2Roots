// Function to create Alumni Card
function createAlumniCard(alumni) {
  return `
    <div class="profile-card">
      <div class="profile-header">
        <img src="profile.png" alt="Alumni" class="profile-pic" />
        <h3>${alumni.Name}</h3>
        <p>${alumni.Designation}</p>
      </div>
      <div class="profile-body">
        <p><strong>Skills:</strong> ${alumni.Skills}</p>
        <p><strong>Batch:</strong> ${alumni.Batch}</p>
        <p><strong>Department:</strong> ${alumni.Department}</p>
        <p><strong>Email:</strong> ${alumni.Email}</p>
      </div>
      <div class="profile-footer">
        🏢 ${alumni.Company}
      </div>
    </div>
  `;
}

// Function to create Student Card
function createStudentCard(student) {
  return `
    <div class="profile-card">
      <div class="profile-header">
        <img src="student.png" alt="Student" class="profile-pic" />
        <h3>${student.Name}</h3>
        <p>🎓 ${student.Degree}</p>
      </div>
      <div class="profile-body">
        <p><strong>Skills:</strong> ${student.Skills}</p>
        <p><strong>Batch:</strong> ${student.Batch}</p>
        <p><strong>Graduation Year:</strong> ${student.GraduationYear}</p>
        <p><strong>Email:</strong> ${student.Email}</p>
        <p><strong>Academic Score:</strong> ${student.Score}</p>
      </div>
      <div class="profile-footer">
        ${student.Degree} - ${student.Department}
      </div>
    </div>
  `;
}

// Load Alumni CSV
Papa.parse("alumni.csv", {
  download: true,
  header: true,
  complete: function(results) {
    const alumniContainer = document.getElementById("alumni-container");
    results.data.forEach(alumni => {
      if (alumni.Name) {
        alumniContainer.innerHTML += createAlumniCard(alumni);
      }
    });
  }
});

// Load Students CSV
Papa.parse("students.csv", {
  download: true,
  header: true,
  complete: function(results) {
    const studentContainer = document.getElementById("student-container");
    results.data.forEach(student => {
      if (student.Name) {
        studentContainer.innerHTML += createStudentCard(student);
      }
    });
  }
});
