const API_URL = "http://127.0.0.1:8000/api";

let modules = [];
let selectedIds = [];


async function fetchModules() {
    try {
        const response = await fetch(`${API_URL}/modules/`);
        const data = await response.json();

        modules = data;
        renderModules();

        if (!response.ok) {
            throw new Error("Failed to load modules.");
        }
    }
    catch (error) {
        console.error(error)
    }
}

function renderModules() {
    const container =document.getElementById("modules-container");

    container.innerHTML = "";

    modules.forEach(module => {
        container.innerHTML += `

            <div class="card module-card border-0 rounded-4 mb-3">
                <div class="card-body p-4">
                    <span class="badge rounded-pill bg-light text-dark mb-3">${module.tier}</span>

                    <h2 class="h5 fw-semibold mb-2">${module.title}</h2>

                    <p class="text-secondary small mb-0">
                        ${module.description}
                    </p>

                    <div class="d-flex justify-content-between align-items-center mt-4">
                        <span class="text-secondary small">
                            ${module.prerequisite ? "Prerequisite required" : "Foundation module"}
                        </span>

                        <button
                            class="btn btn-primary btn-sm rounded-3 px-3 add-button"
                            data-module-id="${module.id}"
                        >
                            Add to Plan
                        </button>
                    </div>
                </div>
            </div>`;
    });
    setupButtons();
}

function setupButtons() {
    const buttons = document.querySelectorAll(".add-button");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const moduleId = Number(button.dataset.moduleId);
            const module = modules.find(module => module.id === moduleId);

            // checking prerequisite
            if (module.prerequisite && !selectedIds.includes(module.prerequisite)) {
                const prerequisiteModule = modules.find(
                    item => item.id === module.prerequisite);

                showAlert(`${module.title} requires ${prerequisiteModule.title} to be completed first.`, "danger");
                return;
            }

            if (!selectedIds.includes(moduleId)) {
                selectedIds.push(moduleId);
                renderSelectedModules();
            }
        });
    });
}

function renderSelectedModules() {
    const container = document.getElementById("selected-items");
    const emptyMessage = document.getElementById("empty-message");
    container.innerHTML = "";

    if (selectedIds.length === 0) {
        emptyMessage.classList.remove("d-none");
        return;
    }
    emptyMessage.classList.add("d-none");

    selectedIds.forEach(moduleId => {
        const module = modules.find(
            module => module.id === moduleId
        );

        container.innerHTML += `

            <div class="d-flex align-items-center justify-content-between
                        border rounded-3 p-3 mb-2">
                <div>
                    <span class="fw-semibold small">
                        ${module.title}
                    </span>

                    <div class="text-secondary small">
                        ${module.tier}
                    </div>
                </div>
                <button
                    class="btn btn-outline-secondary btn-sm remove-button"
                    data-module-id="${module.id}">Remove
                </button>
            </div>`;
    });
    setupRemoveButtons();
}

function setupRemoveButtons() {
    const buttons = document.querySelectorAll(".remove-button");

    buttons.forEach(button => {

        button.addEventListener("click", function () {
            const moduleId = Number(button.dataset.moduleId);

            selectedIds = selectedIds.filter(
                id => id !== moduleId
            );
            renderSelectedModules();
        });
    });
}


function showAlert(message, type) {
    const alertContainer = document.getElementById("alert-container");

    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close">
            </button>
        </div>`;

    setTimeout(() => {
        const alert = alertContainer.querySelector(".alert");
        if (alert) {
            alert.remove();
        }

    }, 3000);
}

async function saveLearningPath() {
    const response = await fetch(`${API_URL}/save-path/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            selected_ids: selectedIds
        })
    });
    const data = await response.json();

    // console.log("Status:", response.status);
    // console.log("Response:", data);

    // Backend rejected the request
    if (!response.ok) {
        showAlert(data.error, "danger");
        return;
    }
    // Backend accepted the request
    showAlert(data.message, "success");

}

function setupSaveButton() {
    const saveButton = document.getElementById("save-path");

    saveButton.addEventListener("click", function () {
        saveLearningPath()
    });
}


fetchModules();
setupSaveButton();