let currentObject;
let modalTextMap = {}; 

// Функція для обробки події перетягування елемента
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

// Обробник події dragover для контейнера
document.querySelector('.container').addEventListener("dragover", function (ev) {
    ev.preventDefault();
});

// Обробник події drop для контейнера
document.querySelector('.container').addEventListener("drop", function (ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var object = document.getElementById(data);
    var targetColumn = ev.target.closest(".column");

    // Переносимо об'єкт до цільового стовпця
    if (targetColumn && object) {
        targetColumn.appendChild(object);
    }
});

// Функція для створення нового стовпця
function createColumn() {
    const newColumn = document.createElement("div");
    newColumn.className = "column";
    newColumn.id = "column_" + Date.now(); // Генеруємо унікальний ID

    const columnTitle = document.createElement("div");
    columnTitle.className = "column-title";
    columnTitle.contentEditable = true;
    columnTitle.innerText = "Список ";

    newColumn.appendChild(columnTitle);

    // Додаємо кнопку видалення стовпця
    const deleteColumnButton = document.createElement("button");
    deleteColumnButton.innerText = "X";
    deleteColumnButton.className = "delete-col";
    deleteColumnButton.onclick = function () {
        deleteColumn(newColumn.id);
    };

    newColumn.appendChild(deleteColumnButton);

    const container = document.querySelector('.container');
    container.appendChild(newColumn);

    // Додаємо кнопку для створення об'єкта
    const createObjectButton = document.createElement("button");
    createObjectButton.innerText = "Створити завдання";
    createObjectButton.className = "createObj";
    createObjectButton.onclick = function () {
        createObjectInColumn(newColumn);
    };

    newColumn.appendChild(createObjectButton);

    // Вставляємо новий стовпець перед кнопкою створення стовпця
    container.insertBefore(document.querySelector('.createCol'), newColumn.nextSibling);
}

// Функція для створення нового об'єкта в стовпці
function createObjectInColumn(column) {
    const newObject = document.createElement("div");
    newObject.className = "object";
    newObject.id = "object_" + Date.now(); // Генеруємо унікальний ID
    newObject.draggable = true;
    newObject.ondragstart = drag;

    const objectTitle = document.createElement("div");
    objectTitle.className = "object-title";
    objectTitle.innerText = "Task";

    objectTitle.addEventListener("click", function () {
        openEditForm(newObject);
    });

    const deleteButton = document.createElement("span");
    deleteButton.className = "delete-button";
    deleteButton.innerText = "X";
    deleteButton.onclick = function () {
        deleteObject(newObject.id);
    };

    newObject.appendChild(objectTitle);
    newObject.appendChild(deleteButton);

    // Додаємо об'єкт до стовпця
    column.appendChild(newObject);

    // Додаємо об'єкт до словника з пустим текстом
    modalTextMap[newObject.id] = "";
}

// Функція для видалення об'єкта
function deleteObject(objectId) {
    const object = document.getElementById(objectId);
    if (object) {
        object.remove();
        // Видаляємо об'єкт зі словника
        delete modalTextMap[objectId];
    }
}

// Функція для видалення стовпця
function deleteColumn(columnId) {
    const column = document.getElementById(columnId);
    if (column) {
        const objectsInColumn = column.querySelectorAll('.object');
        objectsInColumn.forEach((object) => {
            const objectId = object.id;
            // Видаляємо об'єкти зі словника
            delete modalTextMap[objectId];
        });
        // Видаляємо стовпець зі сторінки
        column.remove();
    } else {
        alert("Список з таких id не знайдено");
    }
}

// Функція для обробки події drop для об'єкта
function deleteObjectOnDrop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var object = document.getElementById(data);
    if (object) {
        var objectId = object.id;
        object.remove();
        // Видаляємо завдання зі словника
        delete modalTextMap[objectId];
    }
}

// Функція для обробки події dragover для об'єкта
function allowDrop(event) {
    event.preventDefault();
}

// Функція для відкриття форми редагування об'єкта
function openEditForm(object) {
    currentObject = object;
    const titleInput = document.getElementById("objectTitleInput");
    const descriptionTextArea = document.getElementById("objectDescriptionTextArea");

    titleInput.value = object.querySelector(".object-title").innerText;
    descriptionTextArea.value = modalTextMap[object.id];

    document.getElementById("myModal").style.display = "block";
}

// Функція для закриття форми редагування об'єкта
function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

// Функція для збереження змін після редагування об'єкта
function saveChanges() {
    const newTitle = document.getElementById("objectTitleInput").value;
    const newDescription = document.getElementById("objectDescriptionTextArea").value;

    if (!currentObject) {
        console.error("currentObject is null or undefined");
        return;
    }

    const titleElement = currentObject.querySelector(".object-title");
    if (!titleElement) {
        console.error("Title element not found in currentObject");
        return;
    }

    modalTextMap[currentObject.id] = newDescription;

    titleElement.innerText = newTitle;

    closeModal();
}
