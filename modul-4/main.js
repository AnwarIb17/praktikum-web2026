// File : main.js
// Integrasi Logika Data dan Render ke Element DOM

const projects = [
  {
    id: 1,
    title: "Sistem inventasi keuangan",
    category: "Web App",
    budget: 25000000,
    completed: true,
  },
  {
    id: 2,
    title: "Sistem Kasir Digital POS",
    category: "Desktop App",
    budget: 50000000,
    completed: false,
  },
  {
    id: 3,
    title: "Landing Page Profil Perusahaan",
    category: "Web App",
    budget: 1500000,
    completed: false,
  },
  {
    id: 4,
    title: "aplikasi Presensi GPS Mobile",
    category: "Mobile App",
    budget: 4500000,
    completed: false,
  },
];

const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
};

const updateStats = (dataList) => {
  const totalProjects = dataList.length;
  const totalBudget = dataList.reduce((acc, curr) => acc + curr.budget, 0);
  const completedProjects = dataList.filter((item) => item.completed).length;

  document.getElementById("stat-total-projects").textContent = totalProjects;
  document.getElementById("stat-total-budget").textContent =
    formatRupiah(totalBudget);
  document.getElementById("stat-completed-projects").textContent =
    completedProjects;
};

// Nama fungsi disamakan menjadi renderProjects (dengan s)
const renderProjects = (filteredList) => {
  const container = document.getElementById("project-list");
  if (!container) return;

  if (filteredList.length === 0) {
    container.innerHTML =
      "<p style='text-align: center; color: #64748b; padding: 20px;'>Tidak ada proyek pada kategori ini.</p>";
    return;
  }

  const htmlString = filteredList
    .map((proj) => {
      const badgeClass = proj.completed ? "badge-success" : "badge-pending";
      const statusText = proj.completed ? "Selesai" : "Proses";
      return `
        <div class="project-card">
          <div class="project-info">
            <span class="project-category">${proj.category}</span>
            <h4>${proj.title}</h4>
            <p class="project-budget">${formatRupiah(proj.budget)}</p>
          </div>
          <div>
            <span class="badge ${badgeClass}">${statusText}</span>
          </div>
        </div>
      `;
    })
    .join("");

  container.innerHTML = htmlString;
};

document.addEventListener("DOMContentLoaded", () => {
  renderProjects(projects);
  updateStats(projects);

  const filterButtons = document.querySelectorAll(".btn-filter");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // 1. Hapus kelas active dari semua tombol
      filterButtons.forEach((b) => b.classList.remove("active"));

      // 2. Gunakan currentTarget agar selalu merujuk ke elemen .btn-filter
      const currentButton = e.currentTarget;
      currentButton.classList.add("active");

      // 3. Ambil data-category dengan aman
      const selectedCategory = currentButton.getAttribute("data-category");

      // 4. Filter data
      if (selectedCategory === "Semua") {
        renderProjects(projects);
      } else {
        const filtered = projects.filter(
          (p) => p.category === selectedCategory,
        );
        renderProjects(filtered);
      }
    });
  });
});
