const searchTitle = document.getElementById('searchTitle');
const searchCompany = document.getElementById('searchCompany');
const searchLocation = document.getElementById('searchLocation');
const sortSelect = document.getElementById('sortJobs');
const jobGrid = document.getElementById('jobGrid');
const jobsBadge = document.getElementById('jobsBadge');
const jobs = Array.from(jobGrid.querySelectorAll('.job-card'));

function filterAndSortJobs() {
  const titleVal = searchTitle.value.toLowerCase();
  const companyVal = searchCompany.value.toLowerCase();
  const locationVal = searchLocation.value.toLowerCase();

  let filteredJobs = jobs.filter(job => {
    const title = job.getAttribute('data-title').toLowerCase();
    const company = job.getAttribute('data-company').toLowerCase();
    const location = job.getAttribute('data-location').toLowerCase();
    return title.includes(titleVal) && company.includes(companyVal) && location.includes(locationVal);
  });

  const sortBy = sortSelect.value;
  if(sortBy){
    filteredJobs.sort((a,b) => {
      if(sortBy === 'deadline'){
        return new Date(a.getAttribute('data-deadline')) - new Date(b.getAttribute('data-deadline'));
      } else {
        return a.getAttribute(`data-${sortBy}`).localeCompare(b.getAttribute(`data-${sortBy}`));
      }
    });
  }

  jobGrid.innerHTML = '';
  filteredJobs.forEach(job => jobGrid.appendChild(job));
}

searchTitle.addEventListener('input', filterAndSortJobs);
searchCompany.addEventListener('input', filterAndSortJobs);
searchLocation.addEventListener('input', filterAndSortJobs);
sortSelect.addEventListener('change', filterAndSortJobs);

// New Jobs Badge Simulation
let newJobsCount = 0;
setInterval(() => {
  const randomNewJobs = Math.floor(Math.random() * 3) + 1;
  newJobsCount += randomNewJobs;
  jobsBadge.innerText = newJobsCount;

  const popup = document.createElement('div');
  popup.innerText = `${randomNewJobs} New Job(s) Added!`;
  popup.style.position = 'fixed';
  popup.style.top = '20px';
  popup.style.right = '20px';
  popup.style.background = '#27ae60';
  popup.style.color = '#fff';
  popup.style.padding = '15px 20px';
  popup.style.borderRadius = '8px';
  popup.style.boxShadow = '0 6px 15px rgba(0,0,0,0.2)';
  popup.style.zIndex = 999;
  popup.style.opacity = '1';
  popup.style.transition = 'opacity 1s';
  document.body.appendChild(popup);

  setTimeout(() => { popup.style.opacity = '0'; }, 2500);
  setTimeout(() => { document.body.removeChild(popup); }, 3500);
}, 8000);