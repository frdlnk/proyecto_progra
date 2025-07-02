let loading = true;
let currentCourses = [];

const form = document.getElementById("courseForm");
const saveBtn = document.getElementById("saveCourse");

const drawer = document.getElementById("drawer");
const overlay = document.getElementById("drawer-overlay");
const openBtn = document.getElementById("generateNewProduct");
const closeBtn = document.getElementById("closeDrawer");
const cancelBtn = document.getElementById("cancelDrawer");

function openDrawer() {
    drawer.classList.remove("translate-x-full");
    overlay.classList.remove("hidden");
}

function closeDrawer() {
    drawer.classList.add("translate-x-full");
    overlay.classList.add("hidden");
    form.reset();
    document.getElementById("editCourseId").value = "";
}

function openEditDrawer(course) {
    openDrawer();
    document.getElementById("courseTitle").value = course.title;
    document.getElementById("courseDescription").value = course.description;
    document.getElementById("coursePrice").value = course.price;
    document.getElementById("courseImage").value = course.imageUrl;
    document.getElementById("editCourseId").value = course.id;
}

openBtn.addEventListener("click", openDrawer);
closeBtn.addEventListener("click", closeDrawer);
cancelBtn.addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("courseTitle").value.trim();
    const description = document.getElementById("courseDescription").value.trim();
    const price = parseFloat(document.getElementById("coursePrice").value);
    const imageUrl = document.getElementById("courseImage").value.trim();
    const courseId = document.getElementById("editCourseId").value;

    if (!title || !description || isNaN(price) || !imageUrl) {
        alert("Por favor complete todos los campos correctamente.");
        return;
    }

    const payload = {
        name: title,
        description,
        price,
        imageUrl
    };

    try {
        if (courseId) {
            // PUT - Actualizar producto
            const res = await fetch("/products", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: parseInt(courseId), ...payload })
            });

            if (!res.ok) throw new Error("No se pudo actualizar el producto");
        } else {
            // POST - Crear producto
            const res = await fetch("/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("No se pudo guardar el producto");
        }

        await getCourses();
        closeDrawer();
    } catch (err) {
        console.error("Error al guardar producto:", err);
    }
});

function inyectHtml(element, html) {
    const el = document.getElementById(element);
    if (!el) return console.error(`Elemento con id "${element}" no encontrado`);
    el.innerHTML = html;
}

function toggleSpinner(show) {
    const spinner = document.getElementById("spinner-container");
    if (spinner) {
        spinner.style.display = show ? "flex" : "none";
    }
}

function checkCurrentCourses() {
    if (currentCourses.length === 0) {
        inyectHtml("course-data", `
            <div class="flex flex-col items-center justify-center text-center mt-20 space-y-4">
                <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="Sin cursos"
                    class="w-40 h-40 opacity-70" />
                <h2 class="text-2xl text-gray-700">No hay productos disponibles</h2>
                <p class="text-gray-500">Haz clic en “Añadir un producto para comenzar.</p>
            </div>
        `);
    } else {
        renderCourses();
    }
}

function renderCourses() {
    const html = currentCourses.map(course => `
        <div class="w-[320px] rounded-xl overflow-hidden shadow-xl cursor-pointer transition transform hover:scale-[1.02]"
         onclick="openModal(${JSON.stringify(course).replace(/"/g, '&quot;')})">

            <div class="relative h-48 w-full">
                <img src="${course.imageUrl}" alt="Imagen del producto"
                    class="absolute inset-0 w-full h-full object-cover rounded-t-xl" />
                <div class="absolute inset-0 bg-opacity-50 rounded-t-xl flex flex-col justify-end p-4">
                    <h3 class="text-white text-xl font-bold truncate">${course.title}</h3>
                    <p class="text-white text-sm line-clamp-2">${course.description}</p>
                </div>
            </div>

            <div class="bg-white p-4 space-y-2" onclick="event.stopPropagation()">
                <p class="text-blue-600 font-bold text-lg">$${course.price}</p>
                <div class="flex justify-between mt-2">
                    <button id="edit-${course.id}" class="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-white text-sm">Modificar</button>
                    <button id="delete-${course.id}" class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm">Eliminar</button>
                </div>
            </div>
        </div>
    `).join("");

    inyectHtml("course-data", `
        <h2 class="text-2xl font-bold text-center">Productos disponibles</h2>
        <div class="flex flex-wrap justify-center gap-6 mt-10">
            ${html}
        </div>
    `);

    currentCourses.forEach(course => {
        const deleteBtn = document.getElementById(`delete-${course.id}`);
        const editBtn = document.getElementById(`edit-${course.id}`);

        if (deleteBtn) {
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                deleteCourse(course.id);
            });
        }

        if (editBtn) {
            editBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                openEditDrawer(course);
            });
        }
    });
}

async function deleteCourse(id) {
    try {
        const res = await fetch(`/products/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) throw new Error("No se pudo eliminar el producto");

        await getCourses();
    } catch (err) {
        console.error("Error al eliminar producto:", err);
    }
}

async function getCourses() {
    try {
        toggleSpinner(true);
        loading = true;

        const res = await fetch("/products");
        const data = await res.json();

        currentCourses = data.map(product => ({
            id: product.id,
            title: product.name,
            description: product.description,
            price: product.price,
            imageUrl: `${product.imageUrl}`
        }));

        loading = false;
        toggleSpinner(false);

        checkCurrentCourses();
    } catch (error) {
        console.error("Error al obtener productos:", error);
        toggleSpinner(false);
    }
}

const modal = document.getElementById("modal-overlay");
const closeModalBtn = document.getElementById("closeModalBtn");

function openModal(course) {
    document.getElementById("modalImage").src = course.imageUrl;
    document.getElementById("modalTitle").textContent = course.title;
    document.getElementById("modalId").textContent = `ID: ${course.id}`;
    document.getElementById("modalDescription").textContent = course.description;
    document.getElementById("modalPrice").textContent = `$${course.price}`;
    modal.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
}

closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener("DOMContentLoaded", () => {
    toggleSpinner(true);
    checkCurrentCourses();
    getCourses();
});
