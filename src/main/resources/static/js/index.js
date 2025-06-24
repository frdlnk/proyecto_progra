let loading = true
let currentCourses = []

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
    form.reset(); // Limpiar el formulario al cerrar
}

// Abrir drawer
openBtn.addEventListener("click", openDrawer);

// Cerrar drawer (ícono X)
closeBtn.addEventListener("click", closeDrawer);

// Cerrar drawer (botón cancelar)
cancelBtn.addEventListener("click", closeDrawer);

// Cerrar si hacen clic fuera (en el fondo oscuro)
overlay.addEventListener("click", closeDrawer);

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("courseTitle").value.trim();
    const description = document.getElementById("courseDescription").value.trim();
    const price = parseFloat(document.getElementById("coursePrice").value);
    const imageUrl = document.getElementById("courseImage").value.trim();

    if (!title || !description || isNaN(price) || !imageUrl) {
        alert("Por favor complete todos los campos correctamente.");
        return;
    }

    const newCourse = {
        id: Date.now(), // ID único por timestamp
        title,
        description,
        price: price.toFixed(2),
        imageUrl,
    };

    currentCourses.unshift(newCourse); // Añadir al inicio
    form.reset();
    closeDrawer();
    renderCourses();
});

function inyectHtml(element, html) {
    const el = document.getElementById(element)
    if (!el) return console.error(`Elemento con id "${element}" no encontrado`)
    el.innerHTML = html
}

function toggleSpinner(show) {
    const spinner = document.getElementById("spinner-container")
    if (spinner) {
        spinner.style.display = show ? "flex" : "none"
    }
}

function checkCurrentCourses() {
    if (currentCourses.length === 0) {
        inyectHtml("course-data", `
            <div class="flex flex-col items-center justify-center text-center mt-20 space-y-4">
                <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="Sin cursos"
                    class="w-40 h-40 opacity-70" />
                <h2 class="text-2xl text-gray-700">No hay cursos disponibles</h2>
                <p class="text-gray-500">Haz clic en “Añadir un curso” para comenzar.</p>
            </div>
        `)
    } else {
        renderCourses()
    }
}

function renderCourses() {
    const html = currentCourses.map(course => `
        <div class="w-[320px] rounded-xl overflow-hidden shadow-xl cursor-pointer transition transform hover:scale-[1.02]">

            <div class="relative h-48 w-full">
    <img src="${course.imageUrl}" alt="Imagen del curso"
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
    `).join("")

    inyectHtml("course-data", `
        <h2 class="text-2xl font-bold text-center">Cursos disponibles </h2>
        <div class="flex flex-wrap justify-center gap-6 mt-10">
            ${html}
        </div>
    `)
    currentCourses.forEach(course => {
        const btn = document.getElementById(`delete-${course.id}`)
        if (btn) {
            btn.addEventListener("click", (e) => {
                e.stopPropagation()
                deleteCourse(course.id)
            })
        }
    })
}

function deleteCourse(id) {
    currentCourses = currentCourses.filter(course => course.id !== id)

    checkCurrentCourses()
}


async function getCourses() {
    try {
        toggleSpinner(true)
        loading = true

        const res = await fetch("https://jsonplaceholder.typicode.com/posts")
        const data = await res.json()

        currentCourses = data.slice(0, 10).map(post => ({
            id: post.id,
            title: post.title,
            description: post.body,
            price: (Math.random() * 100).toFixed(2),
            imageUrl: `https://picsum.photos/300/200?random=${post.id}`
        }))

        loading = false
        toggleSpinner(false)

        checkCurrentCourses()
    } catch (error) {
        console.error("Error al obtener cursos:", error)
        toggleSpinner(false)
    }
}

document.addEventListener("DOMContentLoaded", () => {
    toggleSpinner(true)
    checkCurrentCourses()
    getCourses()
})
