let loading = true
let currentCourses = []

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

            <div class="relative h-48">
                <img src="${course.imageUrl}" alt="Imagen del curso"
                    class="w-full h-full object-cover" />
                
                <div class="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                    <h3 class="text-white text-xl font-bold truncate">${course.title}</h3>
                    <p class="text-white text-sm line-clamp-2">${course.description}</p>
                </div>
            </div>

            <div class="bg-white p-4 space-y-2">
                <p class="text-blue-600 font-bold text-lg">$${course.price}</p>
                <div class="flex justify-between mt-2">
                    <button id="edit-${course.id}" class="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-white text-sm">Modificar</button>
                    <button id="delete-${course.id}" class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm">Eliminar</button>
                </div>
            </div>
        </div>
    `).join("")

    inyectHtml("course-data", `
        <div class="flex flex-wrap justify-center gap-6 mt-10">
            ${html}
        </div>
    `)
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
