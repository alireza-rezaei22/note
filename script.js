let $ = document

const addNewNoteBtn = $.querySelector(".add-new-note-btn")
const removeChoisenNoteBtn = $.querySelector(".delete-notes-btn")

const addNewNotePopUp = $.querySelector(".add-new-note")
const closeNewNoteBtn = $.querySelector(".add-new-note-header .close-btn")
const saveNoteBtn = $.querySelector(".add-new-note-header .save-btn")
const inputNewNote = $.querySelector(".add-new-note #user-note")

const container = $.querySelector(".container")
const notesContainer = $.querySelector(".notes")

const openNotePopUp = $.querySelector(".open-note")
const closeBtnOpenNote = $.querySelector(".open-note-header .close-btn")
const saveChangeBtn = $.querySelector(".open-note-header .save-btn")

const search = $.querySelector(".search")

let notesArray = []
let now
let year
let month
let day
let hour
let minutes
// let holdElemTimeout
// let removeNoteBtn
// let holdedNote
let colors = [
    "rgba(255, 102, 102, 0.5);", "rgb(255, 183, 92, 0.5);",
    "rgba(244, 255, 91, 0.5);", "rgba(127, 255, 103, 0.5);",
    "rgba(89, 255, 233, 0.5);", "rgba(96, 165, 255, 0.5);",
    "rgba(111, 97, 255, 0.5);",
]
let randomColor
let checkColor = 10
let searchedValue

const searchNote = () => {
    if (search.value == "") {
        insertToDom(notesArray)
    }
    else {
        notesContainer.innerHTML = ""
        notesArray.filter(function (note) {
            searchedValue = note.content.includes(`${search.value}`)
            if (searchedValue) {
                notesContainer.innerHTML += `
            <div class="note note${note.id}" onclick="openNote(${note.id})" style="background-color:${note.color}">
            <p>${note.content}</p>
                    <h6>${note.date[0] + "/" + note.date[1] + "/" +
                    note.date[2] + "   " + note.date[3] + ":" +
                    note.date[4]}
                        </h6>
            </div>`
            }
        })
        if (!searchedValue && !notesContainer.innerHTML) {
            notesContainer.innerHTML += `<div class="no-found-container">
                <div class="no-found">
                    <p>No Note Found :(</p>
                </div>
            </div>`
        }
    }
}

const startNewNote = () => {
    addNewNotePopUp.style = "display:block"
    container.style.filter = "blur(1.5px)"
    inputNewNote.focus()
}

const SaveNote = () => {
    if (!inputNewNote.value) {
        alert("input your note")
        return
    }
    now = new Date()
    year = now.getFullYear()
    month = now.getMonth()+1
    day = now.getDate()
    hour = now.getHours()
    minutes = now.getMinutes()

    randomColor = Math.floor(Math.random() * 7)
    console.log("randon color: " + randomColor)
    console.log("check color: " + checkColor)
    while (randomColor == checkColor) {
        console.log("check color loop run")
        randomColor = Math.floor(Math.random() * 7)
        console.log("randon color: " + randomColor)
        console.log("check color: " + checkColor)
    }
    let j = notesArray.length
    let newNote = {
        id: j++,
        content: inputNewNote.value,
        date: [year, month, day, hour, minutes],
        color: colors[randomColor]
    }
    checkColor = randomColor
    console.log("check color: " + checkColor)
    notesArray.unshift(newNote)
    insertToDom(notesArray)
    setToLocalStorage(notesArray)
    inputNewNote.value = ""
    closeNewNotePopUp()

}

const insertToDom = notesArray => {
    notesContainer.innerHTML = ""
    notesArray.forEach(function (note) {
        notesContainer.innerHTML += `
            <div class="note note${note.id}" onclick="openNote(${note.id})" style="background-color:${note.color}">
            <p>${note.content}</p>
                    <h6>${note.date[0] + "/" + note.date[1] + "/" +
            note.date[2] + "   " + note.date[3] + ":" +
            note.date[4]}
                        </h6>
            </div>`
    })
}

const closeNewNotePopUp = () => {
    addNewNotePopUp.style = "display:none"
    container.style.filter = "blur(0px)"
    inputNewNote.value = ""
}


const openNote = noteId => {
    notesArray.find(function (note) {
        if (note.id == noteId) {
            openNotePopUp.style = "display:block"
            container.style.filter = "blur(1.5px)"
            openNotePopUp.innerHTML = `
                <div class="open-note-header">
                <span class="save-btn" onclick="saveChange(${note.id})" "><span></span></span>
                <span>
                    <span onclick="removeNote(${note.id})">-</span>
                    <span class="close-btn" onclick="closeOpenNotePopUp()">X</span>
                </span>
                </div>
                <textarea type="text" id="user-note" placeholder="type here...">${note.content}</textarea>
                `
        }
    })
    const inputOpenNote = $.querySelector(".open-note #user-note")
}

const removeNote = (noteId) => {
    console.log("salam")
    let selectedNote = notesArray.findIndex(function (note) {
        return note.id == noteId
    })
    notesArray.splice(selectedNote, 1)
    setToLocalStorage(notesArray)
    insertToDom(notesArray)
    closeOpenNotePopUp()
}

const closeOpenNotePopUp = () => {
    openNotePopUp.style = "display:none"
    container.style.filter = "blur(0px)"
}

const saveChange = (noteId) => {
    now = new Date()
    year = now.getFullYear()
    month = now.getMonth()+1
    day = now.getDate()
    hour = now.getHours()
    minutes = now.getMinutes()

    notesArray.find(function (note) {
        if (note.id == noteId) {
            const inputOpenNote = $.querySelector(".open-note #user-note")
            note.content = inputOpenNote.value
            note.date = [year, month , day, hour, minutes]

            setToLocalStorage(notesArray)
            insertToDom(notesArray)
            openNotePopUp.style = "display:none"
            container.style.filter = "blur(0px)"
        }
    })
}

const setToLocalStorage = notesArray => {
    localStorage.setItem("notes", JSON.stringify(notesArray))
}

const getLocalStorage = () => {
    let getNotes = JSON.parse(localStorage.getItem("notes"))
    if (getNotes) {
        notesArray = getNotes
        insertToDom(notesArray)
    }
    else {
        notesArray = []
    }
}

const clickRemoveChoisen = () => {
    localStorage.removeItem("notes")
    notesArray = []
    insertToDom(notesArray)
}

search.addEventListener("keyup", searchNote)
addNewNoteBtn.addEventListener("click", startNewNote)

window.addEventListener("load", getLocalStorage)
closeNewNoteBtn.addEventListener("click", closeNewNotePopUp)
saveNoteBtn.addEventListener("click", SaveNote)
removeChoisenNoteBtn.addEventListener("click", clickRemoveChoisen)