// Sample Job Database (can be expanded or fetched from backend)
const jobDatabase = [
  { title: "Software Engineer", company: "Google", skills: ["Java", "C++", "Python"], field: "Software Development" },
  { title: "Data Scientist", company: "IBM", skills: ["Python", "R", "Data Analysis"], field: "Data Science" },
  { title: "Frontend Developer", company: "Microsoft", skills: ["HTML", "CSS", "JavaScript"], field: "Web Development" },
  { title: "Machine Learning Engineer", company: "OpenAI", skills: ["Python", "TensorFlow", "AI"], field: "AI/ML" },
  { title: "Cybersecurity Analyst", company: "Cisco", skills: ["Networking", "Security", "Python"], field: "Cybersecurity" },
  { title: "Cloud Engineer", company: "Amazon AWS", skills: ["AWS", "DevOps", "Linux"], field: "Cloud Computing" }
];

// Handle form submission
document.getElementById("jobForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const skillsInput = document.getElementById("skills").value.toLowerCase().split(",");
  const interest = document.getElementById("interest").value;

  const recommendationsDiv = document.getElementById("recommendations");
  recommendationsDiv.innerHTML = "";

  // Filter jobs based on interest & skills
  const matchedJobs = jobDatabase.filter(job => {
    const skillMatch = job.skills.some(skill => 
      skillsInput.some(userSkill => userSkill.trim() && skill.toLowerCase().includes(userSkill.trim()))
    );
    return job.field === interest && skillMatch;
  });

  if (matchedJobs.length > 0) {
    matchedJobs.forEach(job => {
      const card = document.createElement("div");
      card.className = "job-card";
      card.innerHTML = `
        <h3>${job.title}</h3>
        <p><strong>Company:</strong> ${job.company}</p>
        <p><strong>Required Skills:</strong> ${job.skills.join(", ")}</p>
        <p><strong>Field:</strong> ${job.field}</p>
      `;
      recommendationsDiv.appendChild(card);
    });
  } else {
    recommendationsDiv.innerHTML = `<p>No matching jobs found. Try different skills!</p>`;
  }
});
