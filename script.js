
document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. PENGATURAN DASAR
    // ==========================================
    const STORAGE_KEY = "raihanCyberMaterials";

    const defaultMaterials = [
        {
            id: "material-1",
            title: "Digital Entrepreneurship",
            category: "Entrepreneurship",
            description: "Pengertian dan konsep dasar kewirausahaan di era digital.",
            content: "Digital Entrepreneurship adalah kegiatan membangun dan menjalankan bisnis dengan memanfaatkan teknologi digital.\n\nTeknologi digital dapat digunakan untuk memasarkan produk, melayani pelanggan, melakukan transaksi, serta mengembangkan model bisnis baru.\n\nContoh: bisnis berbasis website, toko online, dan layanan digital."
        },
        {
            id: "material-2",
            title: "E-Commerce",
            category: "E-Commerce",
            description: "Konsep perdagangan digital dan bagaimana transaksi dilakukan secara online.",
            content: "E-Commerce atau perdagangan elektronik adalah aktivitas jual beli barang dan jasa melalui media elektronik, terutama internet.\n\nProsesnya dapat mencakup pemilihan produk, pemesanan, pembayaran, pengiriman, dan layanan pelanggan.\n\nContoh: toko online dan marketplace."
        },
        {
            id: "material-3",
            title: "Digital Marketing",
            category: "Marketing",
            description: "Strategi pemasaran menggunakan media dan teknologi digital.",
            content: "Digital Marketing adalah kegiatan mempromosikan produk atau layanan melalui media digital.\n\nContoh strategi digital marketing adalah pemasaran melalui media sosial, email marketing, iklan digital, dan optimasi mesin pencari.\n\nTujuannya adalah menjangkau audiens yang sesuai dan membantu mencapai target bisnis."
        },
        {
            id: "material-4",
            title: "Content Marketing",
            category: "Marketing",
            description: "Strategi membuat konten untuk menarik dan membangun hubungan dengan audiens.",
            content: "Content Marketing merupakan strategi pemasaran melalui pembuatan dan distribusi konten yang relevan serta bermanfaat bagi audiens.\n\nBentuk konten dapat berupa artikel, video, infografis, dan unggahan media sosial.\n\nKonten yang baik dapat meningkatkan kepercayaan audiens dan membantu memperkenalkan produk."
        },
        {
            id: "material-5",
            title: "Search Engine",
            category: "Search Engine",
            description: "Mengenal mesin pencari dan perannya dalam menemukan informasi di internet.",
            content: "Search Engine adalah sistem yang membantu pengguna menemukan informasi di internet berdasarkan kata kunci.\n\nContoh mesin pencari adalah Google dan Bing.\n\nDalam bisnis digital, mesin pencari membantu calon pelanggan menemukan informasi produk. Optimasi SEO dapat membantu halaman website lebih mudah ditemukan."
        }
    ];

    let materials = loadMaterials();
    let editingId = null;

    function loadMaterials() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved === null) {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(defaultMaterials)
                );
                return [...defaultMaterials];
            }

            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? parsed : [...defaultMaterials];
        } catch (error) {
            console.error("Gagal membaca materi:", error);
            return [...defaultMaterials];
        }
    }

    function saveMaterials() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
            return true;
        } catch (error) {
            alert("Materi gagal disimpan. Periksa ruang penyimpanan browser.");
            console.error("Gagal menyimpan materi:", error);
            return false;
        }
    }

    // ==========================================
    // 2. FOTO PROFIL
    // ==========================================
    const profileImage = document.querySelector(".profile-img");

    if (profileImage) {
        profileImage.addEventListener("error", () => {
            console.error(
                "Foto tidak ditemukan. Pastikan file ada di assets/profile.jpeg"
            );
        });
    }

    // ==========================================
    // 3. MENU NAVIGASI MOBILE
    // ==========================================
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("open");
            menuToggle.textContent = navLinks.classList.contains("open")
                ? "×"
                : "☰";
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                menuToggle.textContent = "☰";
            });
        });
    }

    // ==========================================
    // 4. MODE TERANG DAN GELAP
    // ==========================================
    const themeToggle = document.getElementById("themeToggle");

    try {
        if (localStorage.getItem("raihanPortfolioTheme") === "dark") {
            document.body.classList.add("dark-theme");
        }
    } catch (error) {
        console.warn("Preferensi tema tidak dapat dibaca.");
    }

    updateThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme");

            try {
                localStorage.setItem(
                    "raihanPortfolioTheme",
                    document.body.classList.contains("dark-theme")
                        ? "dark"
                        : "light"
                );
            } catch (error) {
                console.warn("Preferensi tema tidak dapat disimpan.");
            }

            updateThemeIcon();
        });
    }

    function updateThemeIcon() {
        if (!themeToggle) return;

        themeToggle.textContent =
            document.body.classList.contains("dark-theme") ? "☀" : "☾";

        themeToggle.setAttribute(
            "aria-label",
            document.body.classList.contains("dark-theme")
                ? "Gunakan tema terang"
                : "Gunakan tema gelap"
        );
    }

    // ==========================================
    // 5. TAHUN FOOTER
    // ==========================================
    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // ==========================================
    // 6. ANIMASI SAAT SCROLL
    // ==========================================
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(element => observer.observe(element));
    } else {
        revealElements.forEach(element => element.classList.add("visible"));
    }

    // ==========================================
    // 7. PENANDA MENU AKTIF
    // ==========================================
    const sections = document.querySelectorAll("main section[id]");
    const navItems = document.querySelectorAll(".nav-links a");

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navItems.forEach(link => {
                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") === "#" + entry.target.id
                        );
                    });
                }
            });
        }, { rootMargin: "-25% 0px -60% 0px" });

        sections.forEach(section => sectionObserver.observe(section));
    }

    // ==========================================
    // 8. ELEMEN MATERI
    // ==========================================
    const materialGrid = document.getElementById("materialGrid");
    const materialCount = document.getElementById("materialCount");
    const emptyState = document.getElementById("emptyState");

    const addMaterialBtn = document.getElementById("addMaterialBtn");
    const formModal = document.getElementById("materialFormModal");
    const readModal = document.getElementById("readMaterialModal");

    const materialForm = document.getElementById("materialForm");
    const formModalTitle = document.getElementById("formModalTitle");
    const saveMaterialBtn = document.getElementById("saveMaterialBtn");

    const titleInput = document.getElementById("materialTitle");
    const categoryInput = document.getElementById("materialCategory");
    const descriptionInput = document.getElementById("materialDescription");
    const contentInput = document.getElementById("materialContent");

    const readCategory = document.getElementById("readCategory");
    const readTitle = document.getElementById("readTitle");
    const readContent = document.getElementById("readContent");

    const categoryIcons = {
        "Entrepreneurship": "✦",
        "E-Commerce": "🛒",
        "Marketing": "↗",
        "Search Engine": "⌕",
        "Marketplace": "▦",
        "Lainnya": "✎"
    };

    // ==========================================
    // 9. MENAMPILKAN KARTU MATERI
    // ==========================================
    function renderMaterials() {
        materialGrid.replaceChildren();

        materialCount.textContent = materials.length + " Materi";
        emptyState.classList.toggle("hidden", materials.length !== 0);

        materials.forEach(material => {
            const card = document.createElement("article");
            card.className = "material-card reveal visible";

            const icon = document.createElement("div");
            icon.className = "material-icon";
            icon.textContent = categoryIcons[material.category] || "✦";

            const category = document.createElement("span");
            category.className = "material-category";
            category.textContent = material.category;

            const title = document.createElement("h3");
            title.textContent = material.title;

            const description = document.createElement("p");
            description.textContent = material.description;

            const actions = document.createElement("div");
            actions.className = "material-actions";

            const readButton = createActionButton(
                "Baca Materi ↗",
                "action-btn action-read",
                () => openReadModal(material.id)
            );

            const editButton = createActionButton(
                "✎ Edit",
                "action-btn action-edit",
                () => openEditModal(material.id)
            );

            const deleteButton = createActionButton(
                "✕ Hapus",
                "action-btn action-delete",
                () => deleteMaterial(material.id)
            );

            actions.append(readButton, editButton, deleteButton);
            card.append(icon, category, title, description, actions);
            materialGrid.appendChild(card);
        });
    }

    function createActionButton(label, className, callback) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = className;
        button.textContent = label;
        button.addEventListener("click", callback);
        return button;
    }

    // ==========================================
    // 10. TAMBAH MATERI
    // ==========================================
    addMaterialBtn.addEventListener("click", () => {
        openAddModal();
    });

    function openAddModal() {
        editingId = null;
        materialForm.reset();

        formModalTitle.textContent = "Tambah Materi";
        saveMaterialBtn.textContent = "Simpan Materi";

        formModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
        titleInput.focus();
    }

    // ==========================================
    // 11. EDIT MATERI
    // ==========================================
    function openEditModal(id) {
        const material = materials.find(item => item.id === id);

        if (!material) {
            alert("Materi tidak ditemukan.");
            return;
        }

        editingId = id;

        titleInput.value = material.title;
        categoryInput.value = material.category;
        descriptionInput.value = material.description;
        contentInput.value = material.content;

        formModalTitle.textContent = "Edit Materi";
        saveMaterialBtn.textContent = "Simpan Perubahan";

        formModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
        titleInput.focus();
    }

    // ==========================================
    // 12. SIMPAN MATERI BARU ATAU PERUBAHAN
    // ==========================================
    materialForm.addEventListener("submit", event => {
        event.preventDefault();

        const title = titleInput.value.trim();
        const category = categoryInput.value;
        const description = descriptionInput.value.trim();
        const content = contentInput.value.trim();

        if (!title || !category || !description || !content) {
            alert("Mohon isi semua kolom materi.");
            return;
        }

        if (editingId !== null) {
            const index = materials.findIndex(item => item.id === editingId);

            if (index === -1) {
                alert("Materi yang ingin diedit tidak ditemukan.");
                return;
            }

            const previousMaterial = materials[index];

            materials[index] = {
                ...previousMaterial,
                title,
                category,
                description,
                content
            };
        } else {
            materials.unshift({
                id: createMaterialId(),
                title,
                category,
                description,
                content
            });
        }

        if (!saveMaterials()) {
            materials = loadMaterials();
            renderMaterials();
            return;
        }

        renderMaterials();
        closeFormModal();
    });

    function createMaterialId() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return window.crypto.randomUUID();
        }

        return "material-" + Date.now() + "-" +
            Math.random().toString(36).slice(2, 9);
    }

    // ==========================================
    // 13. HAPUS MATERI
    // ==========================================
    function deleteMaterial(id) {
        const material = materials.find(item => item.id === id);

        if (!material) {
            alert("Materi tidak ditemukan.");
            return;
        }

        const confirmed = window.confirm(
            'Apakah kamu yakin ingin menghapus materi "' +
            material.title + '"?\n\nMateri yang dihapus tidak dapat dipulihkan.'
        );

        if (!confirmed) return;

        const previousMaterials = [...materials];
        materials = materials.filter(item => item.id !== id);

        if (!saveMaterials()) {
            materials = previousMaterials;
            renderMaterials();
            return;
        }

        renderMaterials();
    }

    // ==========================================
    // 14. BACA MATERI
    // ==========================================
    function openReadModal(id) {
        const material = materials.find(item => item.id === id);

        if (!material) {
            alert("Materi tidak ditemukan.");
            return;
        }

        readCategory.textContent = material.category;
        readTitle.textContent = material.title;
        readContent.textContent = material.content;

        readModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    }

    // ==========================================
    // 15. TUTUP MODAL
    // ==========================================
    function closeFormModal() {
        formModal.classList.add("hidden");
        materialForm.reset();
        editingId = null;
        document.body.style.overflow = readModal.classList.contains("hidden")
            ? ""
            : "hidden";
    }

    function closeReadModal() {
        readModal.classList.add("hidden");
        document.body.style.overflow = formModal.classList.contains("hidden")
            ? ""
            : "hidden";
    }

    document.querySelectorAll("[data-close-form]").forEach(button => {
        button.addEventListener("click", closeFormModal);
    });

    document.querySelectorAll("[data-close-read]").forEach(button => {
        button.addEventListener("click", closeReadModal);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            if (!formModal.classList.contains("hidden")) {
                closeFormModal();
            } else if (!readModal.classList.contains("hidden")) {
                closeReadModal();
            }
        }
    });

    // ==========================================
    // 16. TOMBOL KEMBALI KE ATAS
    // ==========================================
    const backToTop = document.querySelector(".back-to-top");

    if (backToTop) {
        backToTop.addEventListener("click", event => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Tampilkan semua materi saat website dibuka.
    renderMaterials();
});
