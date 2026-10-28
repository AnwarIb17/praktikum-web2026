// File: script.js
document.addEventListener("DOMContentLoaded", () => {
  // 1. Ambil elemen DOM
  const todoForm = document.querySelector("#todoForm");
  const taskInput = document.querySelector("#taskInput");
  const inputError = document.querySelector("#inputError");
  const todoList = document.querySelector("#todoList");
  const taskCounter = document.querySelector("#taskCounter");
  const clearCompletedBtn = document.querySelector("#clearCompleted");

  // 2. Fungsi membaca dan menyimpan ke LocalStorage
  const getTasks = () => JSON.parse(localStorage.getItem("todo_tasks")) || [];
  const saveTasks = (tasks) =>
    localStorage.setItem("todo_tasks", JSON.stringify(tasks));

  // 3. Fungsi memperbarui ringkasan jumlah tugas
  const updateCounter = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const remaining = total - completed;

    taskCounter.textContent = `Total: ${total} Tugas | Selesai: ${completed} | Belum Selesai: ${remaining}`;
    clearCompletedBtn.disabled = completed === 0;
  };

  // 4. Fungsi menampilkan daftar tugas ke layar
  const renderTasks = () => {
    const tasks = getTasks();
    todoList.innerHTML = "";
    updateCounter(tasks);

    if (tasks.length === 0) {
      todoList.innerHTML =
        "<p style='text-align:center; color: #64748b; font-size: 13px; padding:10px;'>Belum ada tugas tersimpan.</p>";
      return;
    }

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `todo-item ${task.completed ? "completed" : ""}`;
      li.innerHTML = `
                <span class="todo-text">${task.text}</span>
                <div class="todo-actions">
                    <button class="action-btn complete-btn" data-index="${index}">
                        ${task.completed ? "Batal" : "Selesai"}
                    </button>
                    <button class="action-btn delete-btn" data-index="${index}">Hapus</button>
                </div>
            `;
      todoList.appendChild(li);
    });
  };

  // 5. Tambah tugas saat formulir dikirim
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();

    // Validasi input sederhana (kurang dari 3 karakter)
    if (taskText.length < 3) {
      taskInput.classList.add("error");
      inputError.style.display = "block";
      return; // Hentikan fungsi jika error
    }

    const cek = todoList.querySelectorAll("li");
    if (cek.length >= 5) {
      taskInput.classList.add("error");
      document.querySelector("#lebih5").style.display = "block";
      return;
    } else {
      document.querySelector("#lebih5").style.display = "none";
    }

    // Jika valid, hilangkan pesan error
    taskInput.classList.remove("error");
    inputError.style.display = "none";
    document.querySelector("#lebih5").style.display = "none";

    // Simpan tugas baru ke array LocalStorage
    const tasks = getTasks();
    tasks.push({ text: taskText, completed: false });
    saveTasks(tasks);

    taskInput.value = "";
    renderTasks();
  });

  // 6. Tangani klik tombol Selesai dan Hapus menggunakan Event Listener pada todoList
  todoList.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (index === undefined) return;

    const tasks = getTasks();

    if (e.target.classList.contains("complete-btn")) {
      tasks[index].completed = !tasks[index].completed;
      saveTasks(tasks);
      renderTasks();
    } else if (e.target.classList.contains("delete-btn")) {
      // Konfirmasi sebelum menghapus tugas
      const yakin = confirm("Apakah Anda yakin ingin menghapus tugas ini?");
      if (!yakin) return;

      tasks.splice(index, 1);
      saveTasks(tasks);
      renderTasks();
    }
  });

  // 7. Bersihkan hanya tugas yang sudah selesai
  clearCompletedBtn.addEventListener("click", () => {
    const tasks = getTasks();
    const sisaTugas = tasks.filter((task) => !task.completed);

    // Tidak ada tugas selesai, tidak perlu menyimpan ulang
    if (sisaTugas.length === tasks.length) return;

    saveTasks(sisaTugas);
    renderTasks();
  });

  // Render pertama kali saat halaman selesai dimuat
  renderTasks();
});
