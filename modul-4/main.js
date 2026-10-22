// File: main.js
// Interactive Portfolio Tracker
// Modul 4 - Tugas Mandiri: Form Dinamis, Live Search, Toggle Status, Hapus Data

/* =========================================================
   1. STATE & DATA
   ========================================================= */

let projects = [
  {
    id: 1,
    title: "Sistem Inventaris Keuangan",
    category: "Web App",
    budget: 2500000,
    completed: true,
  },
  {
    id: 2,
    title: "Sistem Kasir Digital POS",
    category: "Desktop App",
    budget: 5000000,
    completed: true,
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
    title: "Aplikasi Presensi GPS Mobile",
    category: "Mobile App",
    budget: 4500000,
    completed: false,
  },
];

// State untuk pencarian & filter kategori
let state = {
  searchQuery: "",
  activeCategory: "all",
};

/* =========================================================
   2. HELPER
   ========================================================= */

const formatRupiah = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);

// Mencegah HTML injection saat judul proyek dirender
const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/* =========================================================
   3. RENDER: KARTU STATISTIK
   ========================================================= */

const updateStats = (dataList) => {
  const totalProjects = dataList.length;
  const totalBudget = dataList.reduce((acc, curr) => acc + curr.budget, 0);
  const completedCount = dataList.filter((item) => item.completed).length;

  document.getElementById("stat-total-projects").textContent = totalProjects;
  document.getElementById("stat-total-budget").textContent =
    formatRupiah(totalBudget);
  document.getElementById("stat-completed-projects").textContent =
    completedCount;
};

/* =========================================================
   4. RENDER: DAFTAR PROYEK
   ========================================================= */

const renderProjects = (list) => {
  const container = document.getElementById("project-list");
  if (!container) return;

  if (list.length === 0) {
    const pesan = state.searchQuery
      ? `Tidak ada proyek yang cocok dengan kata kunci "${escapeHtml(
          state.searchQuery,
        )}".`
      : "Belum ada proyek pada kategori ini.";

    container.innerHTML = `<p class="empty-state">${pesan}</p>`;
    return;
  }

  container.innerHTML = list
    .map((proj) => {
      const badgeClass = proj.completed ? "badge-success" : "badge-pending";
      const statusText = proj.completed ? "Selesai" : "Dalam Pengerjaan";
      const toggleText = proj.completed ? "Tandai Proses" : "Tandai Selesai";

      return `
        <div class="project-card" data-id="${proj.id}">
          <div class="project-info">
            <span class="project-category">${escapeHtml(proj.category)}</span>
            <h4>${escapeHtml(proj.title)}</h4>
            <p class="project-budget">${formatRupiah(proj.budget)}</p>
          </div>
          <div class="project-side">
            <span class="badge ${badgeClass}">${statusText}</span>
            <div class="card-actions">
              <button class="btn-action btn-toggle" data-action="toggle" data-id="${proj.id}">
                ${toggleText}
              </button>
              <button class="btn-action btn-delete" data-action="delete" data-id="${proj.id}">
                Hapus
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
};

/* =========================================================
   5. FILTER TERPADU (PENCARIAN + KATEGORI)
   ========================================================= */

const getFilteredProjects = () => {
  const keyword = state.searchQuery.trim().toLowerCase();

  return projects.filter((proj) => {
    const cocokKategori =
      state.activeCategory === "all" ||
      proj.category === state.activeCategory;

    const cocokPencarian =
      keyword === "" || proj.title.toLowerCase().includes(keyword);

    return cocokKategori && cocokPencarian;
  });
};

// Render ulang seluruh tampilan (kartu + statistik)
const refreshUI = () => {
  renderProjects(getFilteredProjects());
  updateStats(projects);
};

/* =========================================================
   6. FITUR 1: FORM INPUT PROYEK (HANDLING & VALIDATION)
   ========================================================= */

const showMessage = (text, type) => {
  const el = document.getElementById("form-message");
  el.textContent = text;
  el.className = `form-message ${type}`;
};

const handleFormSubmit = (e) => {
  e.preventDefault();

  const titleInput = document.getElementById("input-title");
  const categoryInput = document.getElementById("input-category");
  const budgetInput = document.getElementById("input-budget");
  const completedInput = document.getElementById("input-completed");

  const title = titleInput.value.trim();
  const category = categoryInput.value;
  const budget = Number(budgetInput.value);

  // --- Validasi ---
  if (title === "") {
    showMessage("Judul proyek tidak boleh kosong.", "error");
    titleInput.focus();
    return;
  }

  if (budgetInput.value === "" || Number.isNaN(budget) || budget <= 0) {
    showMessage("Estimasi anggaran harus berupa angka lebih besar dari 0.", "error");
    budgetInput.focus();
    return;
  }

  // --- Buat objek proyek baru dengan id unik ---
  const proyekBaru = {
    id: Date.now(),
    title,
    category,
    budget,
    completed: completedInput.checked,
  };

  // --- Masukkan ke array (spread operator) ---
  projects = [...projects, proyekBaru];

  // --- Reset form & render ulang ---
  e.target.reset();
  showMessage(`Proyek "${proyekBaru.title}" berhasil ditambahkan.`, "success");

  // Jika filter aktif menyembunyikan proyek baru, kembalikan ke "Semua"
  if (
    state.activeCategory !== "all" &&
    state.activeCategory !== proyekBaru.category
  ) {
    state.activeCategory = "all";
    document.querySelectorAll(".btn-filter").forEach((btn) => {
      btn.classList.toggle(
        "active",
        btn.getAttribute("data-category") === "all",
      );
    });
  }

  refreshUI();
};

/* =========================================================
   7. FITUR 2: PENCARIAN REAL-TIME
   ========================================================= */

const handleSearch = (e) => {
  state.searchQuery = e.target.value;
  refreshUI();
};

/* =========================================================
   8. FITUR 3: AKSI KARTU (TOGGLE STATUS & HAPUS)
   ========================================================= */

// Event delegation: satu listener untuk semua tombol di dalam daftar
const handleCardAction = (e) => {
  const button = e.target.closest("button[data-action]");
  if (!button) return;

  const action = button.getAttribute("data-action");
  const id = Number(button.getAttribute("data-id"));

  if (action === "toggle") {
    projects = projects.map((proj) =>
      proj.id === id ? { ...proj, completed: !proj.completed } : proj,
    );
  } else if (action === "delete") {
    const proyek = projects.find((proj) => proj.id === id);
    const yakin = window.confirm(
      `Hapus proyek "${proyek ? proyek.title : ""}" dari portofolio?`,
    );
    if (!yakin) return;

    projects = projects.filter((proj) => proj.id !== id);
  }

  refreshUI();
};

/* =========================================================
   9. FILTER KATEGORI
   ========================================================= */

const handleFilterClick = (e) => {
  const button = e.currentTarget;

  document
    .querySelectorAll(".btn-filter")
    .forEach((b) => b.classList.remove("active"));
  button.classList.add("active");

  state.activeCategory = button.getAttribute("data-category");
  refreshUI();
};

/* =========================================================
   10. INISIALISASI
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // Render awal
  refreshUI();

  // Fitur 1: form submit
  document
    .getElementById("project-form")
    .addEventListener("submit", handleFormSubmit);

  // Fitur 2: live search
  document
    .getElementById("search-input")
    .addEventListener("input", handleSearch);

  // Fitur 3: aksi kartu (event delegation)
  document
    .getElementById("project-list")
    .addEventListener("click", handleCardAction);

  // Filter kategori
  document
    .querySelectorAll(".btn-filter")
    .forEach((btn) => btn.addEventListener("click", handleFilterClick));
});
