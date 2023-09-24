const saved_book = "Saved Book";
const click = "click";
const storage_key = "Bookshelf";
const books = [];

function isStorageExist() {
    if(typeof Storage === undefined){
        window.alert('Browser anda tidak mendukung web storage');
        return false;
    }
    return true;
}

function saveBook(){
    if(isStorageExist){
        const parsed = JSON.stringify(books);
        localStorage.setItem(storage_key, parsed);
    }
}

function moveData(){
    if(isStorageExist){
        const parsed = JSON.stringify(books);
        localStorage.setItem(storage_key, parsed);
    }
}

function deleteData(){
    if(isStorageExist){
        const parsed = JSON.stringify(books);
        localStorage.setItem(storage_key, parsed);
    }
}

function addBook(){
    const inputBookTitle = document.getElementById('inputBookTitle');
    const inputBookAuthor = document.getElementById('inputBookAuthor');
    const inputBookYear = document.getElementById('inputBookYear');
    const inputBookIsComplete = document.getElementById('inputBookIsComplete');
    let bookStatus;

    if(inputBookIsComplete.checked){
        bookStatus = true;
    }
    else {
        bookStatus = false;
    }

    books.push({
        id: +new Date(),
        title: inputBookTitle.value,
        author: inputBookAuthor.value,
        year: Number(inputBookYear.value),
        isComplete: bookStatus
    });

    inputBookTitle.value = null;
    inputBookAuthor.value = null;
    inputBookYear.value = null;
    inputBookIsComplete.checked = false;

    document.dispatchEvent(new Event(saved_book))
    saveBook();
}

function searchData(){
    const bookInput = document.getElementById('searchBookTitle').value.toLowerCase();
    const searchedBook = document.getElementsByClassName('book_item');

    for(let i = 0; i < searchedBook.length; i++){
        const itemTitle = searchedBook[i].querySelector(".book_title");
        if(itemTitle.textContent.toLowerCase().includes(bookInput)){
            searchedBook[i].classList.remove("hidden");
        }
        else {
            searchedBook[i].classList.add("hidden");
        }
    }

}

function findBook(bookId){
    for(const bookItem of books){
        if(bookItem.id === bookId){
            return bookItem;
        }
    }

    return null;
}

function findBookIndex(bookId){
    for(const index in books){
        if(books[index].id === bookId){
            return index;
        }
    }

    return -1;
}

function moveBookToCompleted(bookId){
    const bookTarget = findBook(bookId);
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(saved_book));
    moveData();
}

function moveBookToUncompleted(bookId){
    const bookTarget = findBook(bookId);
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(saved_book));
    moveData();
}

function editBook(bookId){
    const bookTarget = findBook(bookId);

    const bookTitle = document.getElementById('inputBookTitle');
    const bookAuthor = document.getElementById('inputBookAuthor');
    const bookYear = document.getElementById('inputBookYear');
    const bookIsComplete = document.getElementById('inputBookIsComplete');
    const submitBtn = document.getElementById('bookSubmit');
    let status;

    bookTitle.value = bookTarget.title;
    bookAuthor.value = bookTarget.author;
    bookYear.value = bookTarget.year;
    bookIsComplete.checked = bookTarget.isComplete;
    submitBtn.innerText = 'Simpan Perubahan'

    if(bookIsComplete.checked){
        status = true;
    }
    else {
        status = false;
    }

    const editBookForm = document.getElementById('inputBook');
    editBookForm.removeEventListener('submit', addBook);

    editBookForm.addEventListener('submit', function(ev) {
        deleteBook(bookId);
        ev.preventDefault();

        bookTarget.title = bookTitle.value;
        bookTarget.author = bookAuthor.value;
        bookTarget.year = bookYear.value;
        bookTarget.isComplete = status;

        document.dispatchEvent(new Event(saved_book));
        saveBook();

        submitBtn.innerText = 'Simpan';
        
        editBookForm.removeEventListener('submit', editBook);
    })
}

function deleteBook(bookId){
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(saved_book));
    deleteData();
}

function addBookElement(bookObject){
    const newTitle = document.createElement("h3");
    newTitle.setAttribute('class', 'book_title');
    newTitle.innerText = bookObject.title;

    const newAuthor = document.createElement("p");
    newAuthor.setAttribute('class', 'book_author');
    newAuthor.innerText = bookObject.author;

    const newYear = document.createElement("p");
    newYear.setAttribute('class', 'book_year');
    newYear.innerText = bookObject.year

    const newDiv = document.createElement("div");
    newDiv.setAttribute('class', 'action');

    const newArticle = document.createElement("article");
    newArticle.setAttribute('class', 'book_item');
    newArticle.append(newTitle, newAuthor, newYear);

    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute('class', 'red');
    deleteBtn.innerHTML = `<i class='bx bx-trash'></i>`;

    deleteBtn.addEventListener(click, () => {
        deleteBook(bookObject.id);
    })

    const editBtn = document.createElement("button");
    editBtn.setAttribute('class', 'yellow');
    editBtn.innerHTML = `<i class='bx bx-edit'></i>`;

    editBtn.addEventListener(click, () => {
        editBook(bookObject.id);
    })

    if(bookObject.isComplete){
        const uncompletedBtn = document.createElement("button");
        uncompletedBtn.setAttribute('class', 'green');
        uncompletedBtn.innerHTML = `<i class='bx bx-undo'></i>`;

        uncompletedBtn.addEventListener(click, () => {
            moveBookToUncompleted(bookObject.id);
        })

        newDiv.append(uncompletedBtn, editBtn, deleteBtn);
        newArticle.append(newDiv);      
    }
    else {
        const completedBtn = document.createElement("button");
        completedBtn.setAttribute('class', 'green');
        completedBtn.innerHTML = `<i class='bx bx-check'></i>`;

        completedBtn.addEventListener(click, () => {
            moveBookToCompleted(bookObject.id);
        })

        newDiv.append(completedBtn, editBtn, deleteBtn);
        newArticle.append(newDiv);
    }

    return newArticle;
}

function loadData(){
    const load = JSON.parse(localStorage.getItem(storage_key));

    if(load !== null){
        for (const data of load){
            books.push(data);
        }
    }

    document.dispatchEvent(new Event(saved_book))
}


document.addEventListener(saved_book, () => {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = "";

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = "";

    for(const bookItem of books){
        const bookElement = addBookElement(bookItem);
        if(!bookItem.isComplete){
            incompleteBookshelfList.append(bookElement);
        }
        else{
            completeBookshelfList.append(bookElement);
        }
    }
})

document.addEventListener("DOMContentLoaded", () => {
    if(isStorageExist()){
        loadData();
    }

    const inputBook = document.getElementById('inputBook');
    inputBook.addEventListener('submit', function(ev){
        ev.preventDefault();
        addBook();
    })

    const searchBook = document.getElementById('searchBook');
    searchBook.addEventListener('submit', function(ev){
        ev.preventDefault();
        searchData();
    })
})