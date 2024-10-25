// Tüm elementleri seçme:
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners() { // Tüm event listenerları atamak için
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodoToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}
function clearAllTodos(e) {
    //Arayüzden kaldırma
    if (confirm("Silmek istediğinize emin misiniz?")) {
        while(todoList.firstElementChild != null){
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }
}
function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1) { // Bulamadı

            listItem.setAttribute("style", "display : none !important");

        }
        else {
            listItem.setAttribute("style", "display : block");
        }
    })

}
function deleteTodo(e) {
    if (e.target.className === "fa fa-remove") {

        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success", "Başarıyla Silindi.");

    }
}
function deleteTodoFromStorage(deletetodo) {

    let todos = getTodosFromStorage();
    todos.forEach(function (todo, index) {
        if (todo === deletetodo) {
            todos.splice(index, 1); // Arrayden değer silme
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));

}
function loadAllTodoToUI() {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo) {
        if (!Array.from(todoList.children).some(item => item.textContent === todo)) {
            addTodoToUI(todo);
        }
    }


    );
}
function addTodo(e) {
    const newTodo = todoInput.value.trim();

    if (newTodo === "") {
        /* <div class="alert alert-danger" role="alert">
           This is a danger alert—check it out!
           </div> */
        showAlert("danger", "Lütfen bir Todo giriniz.");
    }
    else {
        let todos = getTodosFromStorage();
        if (!todos.includes(newTodo)) {
            addTodoToUI(newTodo);
            addTodoToStorage(newTodo);
            showAlert("success","Başarıyla Eklendi.");
        }
        else {
            showAlert("danger", "Bu Todo zaten var.");
        }

    }
    

    e.preventDefault();
}
function getTodosFromStorage() { //Storege dan tüm todoları alır.
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];

    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}
function addTodoToStorage(newTodo) {
    let todos = getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}
function showAlert(type, message) {

    const alert = document.createElement("div");

    alert.className = `alert alert-${type}`;

    alert.textContent = message;

    firstCardBody.appendChild(alert);

    // setTimeout
    setTimeout(function () {
        alert.remove();
    }, 1000);


}
function addTodoToUI(newTodo) { //String değerini list item olarak arayüze ekleyecek.

    /* <!-- <li class="list-group-item d-flex justify-content-between">
    Todo 1
    <a href = "#" class ="delete-item">
        <i class = "fa fa-remove"></i>
    </a>
     --> */

    // List item oluşturma
    const listItem = document.createElement("li");
    // Link oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    listItem.className = "list-group-item d-flex justify-content-between";
    //Text Node ekleme

    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    //Todo Liste list item'ı ekleme
    todoList.appendChild(listItem);
    todoInput.value = "";
}
