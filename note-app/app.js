const notes = require('./notes');

const yargs = require("yargs");

// console.log(getNotes());
yargs.command({
    command: 'add',
    describe: 'add a new note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: 'Note Body',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        notes.addNote(argv.title, argv.body);
    }
    // handler: function(argv){
    //     notes.addNote(argv.title,argv.body);
    // }
})

yargs.command({
    command: 'remove',
    describe: 'remove a note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: 'Note Body',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        notes.removeNote(argv.title, argv.body);
    }
})

yargs.command({
    command: 'list',
    describe: 'list all notes',

    handler() {
        notes.listNotes();
    }
})

yargs.command({
    command: 'read',
    describe: 'to read note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        },
    },
    handler(argv) {
        notes.readNote(argv.title);
    }
})

yargs.parse();