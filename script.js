// 1. FORM TOGGLE

let addBookSection = document.querySelector(".add-book-section");
let toggleForm = document.getElementById("toggle-form");

toggleForm.addEventListener("click", function () {

    if (addBookSection.style.display === "none") {

        addBookSection.style.display = "block";
        toggleForm.textContent = "Hide Form";

    } else {

        addBookSection.style.display = "none";
        toggleForm.textContent = "Add New Book";

    }

});


// 2. E-BOOK DETAILS SHOW / HIDE

let typeSelect = document.getElementById("type");
let ebookDetails = document.getElementById("ebook-details");

typeSelect.addEventListener("change", function () {

    if (typeSelect.value === "ebook") {

        ebookDetails.style.display = "block";

    } else {

        ebookDetails.style.display = "none";

    }

});


// 3. BOOK CLASS

class Book {

    constructor(title, author) {

        this.title = title;
        this.author = author;
        this.id = Date.now() + Math.random();

        this.type = "physical";

        this.available = true;

        this.borrower = null;

    }


    // Borrow book
    borrow(name) {

        this.borrower = name;
        this.available = false;

    }


    // Return book
    markReturned() {

        this.borrower = null;
        this.available = true;

    }


    // Create Book Card
    getHTML() {

        let card = document.createElement("div");

        card.classList.add("book-card");


        // Available / Borrowed class

        if (this.available) {

            card.classList.add("available");

        } else {

            card.classList.add("borrowed");

        }


        // TITLE

        let title = document.createElement("h3");

        title.classList.add("book-title");

        title.textContent = this.title;


        // AUTHOR

        let author = document.createElement("p");

        author.classList.add("book-meta");

        author.textContent = "Author: " + this.author;


        // TYPE
        let type = document.createElement("p");

        type.classList.add("book-meta");

        if (this.type === "ebook") {
            type.textContent = "Type: E-Book";
        } else {
            type.textContent = "Type: Physical Book";
        }




        // STATUS

        let status = document.createElement("span");

        status.classList.add("status-badge");


        if (this.available) {

            status.classList.add("status-available");

            status.textContent = "Available";

        } else {

            status.classList.add("status-borrowed");

            status.textContent =
                "Borrowed by " + this.borrower;

        }


        // DETAILS

        let details = document.createElement("div");

        details.classList.add("book-details");

        details.appendChild(author);

        details.appendChild(type);

        details.appendChild(status);


        // BUTTON AREA

        let actions = document.createElement("div");

        actions.classList.add("book-actions");


        // BORROW / RETURN BUTTON

        let actionButton = document.createElement("button");

        actionButton.classList.add("btn");

        actionButton.dataset.id = this.id;


        if (this.available) {

            actionButton.classList.add("btn-borrow");

            actionButton.textContent = "Borrow";

            actionButton.dataset.action = "borrow";

        } else {

            actionButton.classList.add("btn-return");

            actionButton.textContent = "Return";

            actionButton.dataset.action = "return";

        }


        // REMOVE BUTTON

        let removeButton = document.createElement("button");

        removeButton.classList.add("btn", "btn-remove");

        removeButton.textContent = "Remove";

        removeButton.dataset.action = "remove";

        removeButton.dataset.id = this.id;


        // Add buttons

        actions.appendChild(actionButton);

        actions.appendChild(removeButton);


        // ADD EVERYTHING TO CARD
        card.appendChild(title);

        card.appendChild(details);

        card.appendChild(actions);


        return card;

    }

}


// 4. EBOOK CLASS
class Ebook extends Book {

    constructor(title, author, fileSize) {

        super(title, author);

        this.type = "ebook";
        this.fileSize = fileSize;

    }


    // E-books remain available after borrowing
    borrow(name) {

        this.borrower = name;

    }


    // Return e-book
    markReturned() {

        this.borrower = null;

    }


    // Create Ebook Card
   getHTML() {

    let card = super.getHTML();

    card.classList.add("ebook");

    let details = card.querySelector(".book-details");

    // File Size
    let fileSize = document.createElement("p");

    fileSize.classList.add("book-meta");

    fileSize.textContent =
        "File Size: " + this.fileSize + " MB";

    details.appendChild(fileSize);


    // Existing Book action button
    let actionButton =
        card.querySelector(".book-actions button");


    // Remove Borrow/Return behavior
    actionButton.classList.remove("btn-borrow");
    actionButton.classList.add("btn-download");

    if (this.borrower) {

        actionButton.textContent = "Return";
        actionButton.dataset.action = "return";

    } else {

        actionButton.textContent = "Download";
        actionButton.dataset.action = "download";

    }

    return card;
}
}

// 5. BOOK ARRAY

let books = [];


// 6. LOCAL STORAGE - SAVE

function saveBooks() {

    localStorage.setItem(
        "booksArray",
        JSON.stringify(books)
    );

}


// 7. LOCAL STORAGE - LOAD

function loadBooks() {

    let savedBooks =
        localStorage.getItem("booksArray");


    if (!savedBooks) {

        return;

    }


    let parsedBooks = JSON.parse(savedBooks);


    books = [];


    parsedBooks.forEach(function (bookData) {

        let book;


        if (bookData.type === "ebook") {

            book = new Ebook(
                bookData.title,
                bookData.author,
                bookData.fileSize
            );

        } else {

            book = new Book(
                bookData.title,
                bookData.author
            );

        }


        // Restore original data

        book.id = bookData.id;

        book.available = bookData.available;

        book.borrower = bookData.borrower;


        books.push(book);

    });

}


// 8. ADD BOOK FORM
let bookForm = document.getElementById("book-form");


bookForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        let title =
            document.getElementById("title").value.trim();


        let author = document.getElementById("author").value.trim();


        let type = typeSelect.value;


        let newBook;


        // EBOOK

        if (type === "ebook") {

            let fileSize = document.getElementById("file-size").value;


            newBook =
                new Ebook(
                    title,
                    author,
                    fileSize
                );

        }

        // PHYSICAL BOOK

        else {

            newBook =
                new Book(title, author);

        }


        // Add book to array

        books.push(newBook);


        // Save to localStorage

        saveBooks();


        // Reset form

        bookForm.reset();


        ebookDetails.style.display = "none";


        // Update screen

        displayBooks();

    }
);


// 9. DISPLAY BOOKS

let bookList =
    document.getElementById("book-list");


function displayBooks() {

    // Clear old cards

    bookList.innerHTML = "";


    // If no books

    if (books.length === 0) {

        let message =
            document.createElement("p");

        message.textContent =
            "No books added yet.";


        bookList.appendChild(message);

        return;

    }


    // Create cards

    books.forEach(function (book) {

        let card =
            book.getHTML();


        bookList.appendChild(card);

    });

}


// 10. EVENT DELEGATION

bookList.addEventListener(
    "click",
    function (event) {

        // Check button

        if (event.target.tagName !== "BUTTON") {

            return;

        }


        // Get action

        let action =
            event.target.dataset.action;


        // Get ID

        let id =
            Number(event.target.dataset.id);


        // Find book

        let book =
            books.find(function (book) {

                return book.id === id;

            });


        if (!book) {

            return;

        }


        // BORROW
        if (action === "borrow") {

            let name =
                prompt(
                    "Enter borrower name:"
                );


            if (
                name &&
                name.trim() !== ""
            ) {

                book.borrow(
                    name.trim()
                );

            }

        }

        // DOWNLOAD
        if (action === "download") {

            alert("Downloading " + book.title);

        }
        
        // RETURN

        if (action === "return") {

            book.markReturned();

        }


        // REMOVE
        if (action === "remove") {

            let confirmRemove =
                confirm(
                    "Are you sure you want to remove this book?"
                );


            if (confirmRemove) {

                books =
                    books.filter(
                        function (item) {

                            return item.id !== id;

                        }
                    );
            }
        }
        // Save updated data

        saveBooks();

        // Update screen

        displayBooks();

    }
);

// 11. LOAD SAVED BOOKS WHEN PAGE OPENS
loadBooks();

displayBooks();