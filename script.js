
document.addEventListener("DOMContentLoaded", async () => {
    // ==========================================
    // 1. KONFIGURASI SUPABASE
    // ==========================================
    const SUPABASE_URL = "https://yzahgejlidacilvubuze.supabase.co";
    const SUPABASE_KEY = "sb_publishable_41qJQKakvSQMwTjzecoMWA_BtdtbdoW";

    if (!window.supabase) {
        alert("Supabase belum berhasil dimuat. Periksa script Supabase di index.html.");
        return;
    }

    const db = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    const STORAGE_KEY = "raihanCyberMaterials";

    // ==========================================
    // 2. MATERI DEFAULT
    // ==========================================
    const defaultMaterials = [
        {
            title: "Digital Entrepreneurship",
            category: "Entrepreneurship",
            description: "Pengertian dan konsep dasar kewirausahaan di era digital.",
            content: "Digital Entrepreneurship adalah kegiatan membangun dan menjalankan bisnis dengan memanfaatkan teknologi digital.\n\nTeknologi digital dapat digunakan untuk memasarkan produk, melayani pelanggan, melakukan transaksi, serta mengembangkan model bisnis baru.\n\nContoh: bisnis berbasis website, toko online, dan layanan digital."
        },
        {
            title: "E-Commerce",
            category: "E-Commerce",
            description: "Konsep perdagangan digital dan bagaimana transaksi dilakukan secara online.",
            content: "E-Commerce atau perdagangan elektronik adalah aktivitas jual beli barang dan jasa melalui media elektronik, terutama internet.\n\nProsesnya dapat mencakup pemilihan produk, pemesanan, pembayaran, pengiriman, dan layanan pelanggan.\n\nContoh: toko online dan marketplace."
        },
        {
            title: "Digital Marketing",
            category: "Marketing",
            description: "Strategi pemasaran menggunakan media dan teknologi digital.",
            content: "Digital Marketing adalah kegiatan mempromosikan produk atau layanan melalui media digital.\n\nContoh strategi digital marketing adalah pemasaran melalui media sosial, email marketing, iklan digital, dan optimasi mesin pencari.\n\nTujuannya adalah menjangkau audiens yang sesuai dan membantu mencapai target bisnis."
        },
        {
            title: "Content Marketing",
            category: "Marketing",
            description: "Strategi membuat konten untuk menarik dan membangun hubungan dengan audiens.",
            content: "Content Marketing merupakan strategi pemasaran melalui pembuatan dan distribusi konten yang relevan serta bermanfaat bagi audiens.\n\nBentuk konten dapat berupa artikel, video, infografis, dan unggahan media sosial.\n\nKonten yang baik dapat meningkatkan kepercayaan audiens dan membantu memperkenalkan produk."
        },
        {
            title: "Search Engine",
            category: "Search Engine",
            description: "Mengenal mesin pencari dan perannya dalam menemukan informasi di internet.",
            content: "Search Engine adalah sistem yang membantu pengguna menemukan informasi di internet berdasarkan kata kunci.\n\nContoh mesin pencari adalah Google dan Bing.\n\nDalam bisnis digital, mesin pencari membantu calon pelanggan menemukan informasi produk. Optimasi SEO dapat membantu halaman website lebih mudah ditemukan."
        }
    ];

    let materials = [...defaultMaterials];
    let editingId = null;
    let currentSession = null;
    let loginInProgress = false;

    // ==========================================
    // 3. LOGIN ADMIN SUPABASE
    // ==========================================
    function loginAdmin() {
        return new Promise(resolve => {
            if (loginInProgress) {
                resolve(false);
                return;
            }

            loginInProgress = true;

            const overlay = document.createElement("div");
            overlay.style.cssText = `
                position:fixed; inset:0; z-index:99999;
                background:rgba(0,0,0,.7);
                display:flex; align-items:center;
                justify-content:center; padding:20px;
            `;

            overlay.innerHTML = `
                <form id="adminLoginForm" style="
                    background:white; color:#222;
                    width:100%; max-width:380px;
                    padding:28px; border-radius:16px;
                    box-sizing:border-box;
                ">
                    <h2 style="margin:0 0 8px;">Login Admin</h2>
                    <p style="font-size:14px;color:#666;margin-bottom:20px;">
                        Masuk untuk mengelola materi Cyberpreneurship.
                    </p>

                    <label style="display:block;margin-bottom:6px;">
                        Email Admin
                    </label>
                    <input id="adminEmail" type="email" required
                        autocomplete="username"
                        style="width:100%;padding:12px;margin-bottom:15px;
                        box-sizing:border-box;border:1px solid #ccc;
                        border-radius:8px;">

                    <label style="display:block;margin-bottom:6px;">
                        Password
                    </label>
                    <input id="adminPassword" type="password" required
                        autocomplete="current-password"
                        style="width:100%;padding:12px;margin-bottom:12px;
                        box-sizing:border-box;border:1px solid #ccc;
                        border-radius:8px;">

                    <p id="loginError" style="
                        color:#d33;font-size:13px;min-height:18px;
                    "></p>

                    <div style="display:flex;gap:10px;">
                        <button type="button" id="cancelLogin"
                            style="flex:1;padding:11px;border:1px solid #ccc;
                            border-radius:8px;background:white;cursor:pointer;">
                            Batal
                        </button>
                        <button type="submit" id="submitLogin"
                            style="flex:1;padding:11px;border:0;
                            border-radius:8px;background:#7546c8;
                            color:white;cursor:pointer;">
                            Masuk
                        </button>
                    </div>
                </form>
            `;

            document.body.appendChild(overlay);

            const form = overlay.querySelector("#adminLoginForm");
            const emailInput = overlay.querySelector("#adminEmail");
            const passwordInput = overlay.querySelector("#adminPassword");
            const errorText = overlay.querySelector("#loginError");
            const submitButton = overlay.querySelector("#submitLogin");

            function finish(result) {
                overlay.remove();
                loginInProgress = false;
                resolve(result);
            }

            overlay.querySelector("#cancelLogin").addEventListener(
                "click", () => finish(false)
            );

            form.addEventListener("submit", async event => {
                event.preventDefault();

                submitButton.disabled = true;
                submitButton.textContent = "Memproses...";
                errorText.textContent = "";

                const { data, error } = await db.auth.signInWithPassword({
                    email: emailInput.value.trim(),
                    password: passwordInput.value
                });

                if (error) {
                    errorText.textContent =
                        "Login gagal. Periksa email dan password.";
                    submitButton.disabled = false;
                    submitButton.textContent = "Masuk";
                    passwordInput.value = "";
                    return;
                }

                currentSession = data.session;
                finish(true);
            });

            emailInput.focus();
        });
    }

    async function requireAdmin() {
        const { data } = await db.auth.getSession();
        currentSession = data.session;

        if (!currentSession) {
            const success = await loginAdmin();
            if (!success) return false;
        }

        await seedMaterialsIfEmpty();
        await loadMaterialsFromDatabase();

        return true;
    }

    db.auth.onAuthStateChange((_event, session) => {
        currentSession = session;
    });

    // ==========================================
    // 4. MEMINDAHKAN MATERI LAMA KE SUPABASE
    // ==========================================
    async function seedMaterialsIfEmpty() {
        const { data, error } = await db
            .from("materials")
            .select("id")
            .limit(1);

        if (error) {
            console.error("Gagal memeriksa database:", error);
            alert("Tidak dapat mengakses database. Periksa pengaturan Supabase.");
            return false;
        }

        if (data && data.length > 0) {
            return true;
        }

        let initialMaterials = [...defaultMaterials];

        // Mengambil materi lama dari localStorage jika tersedia.
        try {
            const oldData = localStorage.getItem(STORAGE_KEY);

            if (oldData) {
                const parsed = JSON.parse(oldData);

                if (Array.isArray(parsed) && parsed.length > 0) {
                    initialMaterials = parsed;
                }
            }
        } catch (error) {
            console.warn("Materi lama tidak dapat dibaca:", error);
        }

        const cleanMaterials = initialMaterials.map(item => ({
            title: item.title,
            category: item.category || "Lainnya",
            description: item.description || "",
            content: item.content || ""
        }));

        const { error: insertError } = await db
            .from("materials")
            .insert(cleanMaterials);

        if (insertError) {
            console.error("Gagal memindahkan materi:", insertError);
            alert("Materi awal gagal dimasukkan ke Supabase.");
            return false;
        }

        return true;
    }

    // ==========================================
    // 5. MEMBACA MATERI DARI DATABASE
    // ==========================================
    async function loadMaterialsFromDatabase() {
        const { data, error } = await db
            .from("materials")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Gagal mengambil materi:", error);
            alert("Materi gagal dimuat dari database.");
            return false;
        }

        if (data && data.length > 0) {
            materials = data.map(item => ({
                id: String(item.id),
                title: item.title,
                category: item.category,
                description: item.description,
                content: item.content
            }));
        } else {
            materials = [];
        }

        renderMaterials();
        return true;
    }

    // ==========================================
    // 6. FOTO PROFIL
    // ==========================================
    const profileImage = document.querySelector(".profile-img");

    if (profileImage) {
        profileImage.addEventListener("error", () => {
            console.error("Pastikan foto ada di assets/profile.jpeg");
        });
    }

    // ==========================================
    // 7. MENU NAVIGASI MOBILE
    // ==========================================
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("open");
            menuToggle.textContent =
                navLinks.classList.contains("open") ? "×" : "☰";
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                menuToggle.textContent = "☰";
            });
        });
    }

    // ==========================================
    // 8. MODE TERANG DAN GELAP
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
    // 9. TAHUN FOOTER
    // ==========================================
    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // ==========================================
    // 10. ANIMASI SAAT SCROLL
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
    // 11. PENANDA MENU AKTIF
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
    // 12. ELEMEN MATERI
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
    // 13. MENAMPILKAN KARTU MATERI
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
                async () => {
                    if (!await requireAdmin()) return;

                    const latest = materials.find(
                        item => item.title === material.title
                    );

                    if (latest) openEditModal(latest.id);
                }
            );

            const deleteButton = createActionButton(
                "✕ Hapus",
                "action-btn action-delete",
                async () => {
                    if (!await requireAdmin()) return;

                    const latest = materials.find(
                        item => item.title === material.title
                    );

                    if (latest) await deleteMaterial(latest.id);
                }
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
    // 14. TAMBAH MATERI
    // ==========================================
    addMaterialBtn.addEventListener("click", async () => {
        if (!await requireAdmin()) return;
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
    // 15. EDIT MATERI
    // ==========================================
    function openEditModal(id) {
        const material = materials.find(
            item => String(item.id) === String(id)
        );

        if (!material) {
            alert("Materi tidak ditemukan.");
            return;
        }

        editingId = material.id;

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
    // 16. SIMPAN MATERI KE SUPABASE
    // ==========================================
    materialForm.addEventListener("submit", async event => {
        event.preventDefault();

        if (!await requireAdmin()) return;

        const title = titleInput.value.trim();
        const category = categoryInput.value;
        const description = descriptionInput.value.trim();
        const content = contentInput.value.trim();

        if (!title || !category || !description || !content) {
            alert("Mohon isi semua kolom materi.");
            return;
        }

        saveMaterialBtn.disabled = true;
        saveMaterialBtn.textContent = "Menyimpan...";

        const materialData = {
            title,
            category,
            description,
            content,
            updated_at: new Date().toISOString()
        };

        let result;

        if (editingId !== null) {
            result = await db
                .from("materials")
                .update(materialData)
                .eq("id", Number(editingId));
        } else {
            result = await db
                .from("materials")
                .insert([materialData]);
        }

        saveMaterialBtn.disabled = false;
        saveMaterialBtn.textContent =
            editingId !== null ? "Simpan Perubahan" : "Simpan Materi";

        if (result.error) {
            console.error("Gagal menyimpan materi:", result.error);
            alert("Materi gagal disimpan. Periksa login dan izin database.");
            return;
        }

        await loadMaterialsFromDatabase();
        closeFormModal();
        alert("Materi berhasil disimpan!");
    });

    // ==========================================
    // 17. HAPUS MATERI DARI SUPABASE
    // ==========================================
    async function deleteMaterial(id) {
        const material = materials.find(
            item => String(item.id) === String(id)
        );

        if (!material) {
            alert("Materi tidak ditemukan.");
            return;
        }

        const confirmed = window.confirm(
            'Apakah kamu yakin ingin menghapus materi "' +
            material.title + '"?\n\nMateri yang dihapus tidak dapat dipulihkan.'
        );

        if (!confirmed) return;

        const { error } = await db
            .from("materials")
            .delete()
            .eq("id", Number(id));

        if (error) {
            console.error("Gagal menghapus materi:", error);
            alert("Materi gagal dihapus. Periksa izin database.");
            return;
        }

        await loadMaterialsFromDatabase();
        alert("Materi berhasil dihapus.");
    }

    // ==========================================
    // 18. BACA MATERI
    // ==========================================
    function openReadModal(id) {
        const material = materials.find(
            item => String(item.id) === String(id)
        );

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
    // 19. TUTUP MODAL
    // ==========================================
    function closeFormModal() {
        formModal.classList.add("hidden");
        materialForm.reset();
        editingId = null;

        document.body.style.overflow =
            readModal.classList.contains("hidden") ? "" : "hidden";
    }

    function closeReadModal() {
        readModal.classList.add("hidden");

        document.body.style.overflow =
            formModal.classList.contains("hidden") ? "" : "hidden";
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
    // 20. TOMBOL KEMBALI KE ATAS
    // ==========================================
    const backToTop = document.querySelector(".back-to-top");

    if (backToTop) {
        backToTop.addEventListener("click", event => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ==========================================
    // 21. MEMUAT MATERI SAAT WEBSITE DIBUKA
    // ==========================================
    const { data: sessionData } = await db.auth.getSession();
    currentSession = sessionData.session;

    await loadMaterialsFromDatabase();

    // Jika admin sudah login dan database masih kosong,
    // pindahkan materi lama/default ke database.
    if (currentSession) {
        const seeded = await seedMaterialsIfEmpty();

        if (seeded) {
            await loadMaterialsFromDatabase();
        }
    }
});
