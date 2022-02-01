const fs = require('fs');

const addNote = (title, body) => {
    const notes = loadNotes()
    const duplicateNotes = notes.find((note) => { note.title === title })
    // const duplicateNotes = notes.filter(function (note) {
    //     return note.title === title
    // })

    if (!duplicateNotes) {
        notes.push({
            title: title,
            body: body
        })
        saveNotes(notes)
        console.log('New note added!')
    } else {
        console.log('Note title taken!')
    }
}

const removeNote = (title) => {
    const notes = loadNotes()
    const toKeepNotes = notes.filter((note) => { return note.title !== title })
    // const toKeepNotes = notes.filter(function (note) {
    //     return note.title !== title
    // })

    if (notes.length > toKeepNotes.length) {
        saveNotes(toKeepNotes)
        console.log('New note removed! title: ', title)
    } else {
        console.log('Note title not found!')
    }
}

const saveNotes = (notes) => {
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync('notes.json', dataJSON)
}

const listNotes = () => {
    const notes = loadNotes()

    console.log('Your notes..')
    console.log()

    notes.forEach(note => {
        console.log('Title:', note.title)
        console.log('Body:', note.body)
        console.log()
    });
}

const readNote = (title) => {
    const notes = loadNotes()
    const note = notes.find((note) => note.title === title)
    if (note) {
        console.log(note.title)
        console.log(note.body)
    }
    else {
        console.log('Note not found')
    }
}

const loadNotes = () => {
    try {
        const dataBuffer = fs.readFileSync('notes.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    }
    catch (err) {
        console.log("Error: ", err);
        return []
    }
}

module.exports = {
    addNote: addNote,
    removeNote: removeNote,
    listNotes: listNotes,
    readNote: readNote
}