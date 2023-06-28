import noteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props)=>{

    const notesInitial = [
        {
          "_id": "6491a39008ba59a6d62d5f35",
          "user": "648d8ea7bfc9e0a7c612c108",
          "title": "Chhapri",
          "description": "hum hai chhapri hum hai chhapri",
          "tag": "personal",
          "date": "2023-06-20T13:03:12.677Z",
          "__v": 0
        },
        {
          "_id": "6491a39108ba59a6d62d5f37",
          "user": "648d8ea7bfc9e0a7c612c108",
          "title": "Chhapri",
          "description": "hum hai chhapri hum hai chhapri",
          "tag": "personal",
          "date": "2023-06-20T13:03:13.241Z",
          "__v": 0
        },
        {
          "_id": "6491a39008ba59a6d62d5f35",
          "user": "648d8ea7bfc9e0a7c612c108",
          "title": "Chhapri",
          "description": "hum hai chhapri hum hai chhapri",
          "tag": "personal",
          "date": "2023-06-20T13:03:12.677Z",
          "__v": 0
        },
        {
          "_id": "6491a39108ba59a6d62d5f37",
          "user": "648d8ea7bfc9e0a7c612c108",
          "title": "Chhapri",
          "description": "hum hai chhapri hum hai chhapri",
          "tag": "personal",
          "date": "2023-06-20T13:03:13.241Z",
          "__v": 0
        },
        {
          "_id": "6491a39008ba59a6d62d5f35",
          "user": "648d8ea7bfc9e0a7c612c108",
          "title": "Chhapri",
          "description": "hum hai chhapri hum hai chhapri",
          "tag": "personal",
          "date": "2023-06-20T13:03:12.677Z",
          "__v": 0
        },
        {
          "_id": "6491a39108ba59a6d62d5f37",
          "user": "648d8ea7bfc9e0a7c612c108",
          "title": "Chhapri",
          "description": "hum hai chhapri hum hai chhapri",
          "tag": "personal",
          "date": "2023-06-20T13:03:13.241Z",
          "__v": 0
        }
      ]

      const [notes,setnotes] = useState(notesInitial)

      //ADD note
      const addNote = (title, description, tag)=>{
        console.log("adding a new note")
        const note = {"_id": "6491a39108ba59a6d62d5f37",
        "user": "648d8ea7bfc9e0a7c612c108",
        "title": title,
        "description": description,
        "tag": tag,
        "date": "2023-06-20T13:03:13.241Z",
        "__v": 0};
        setnotes(notes.concat(note))
      }

      //EDIT note
      const editNote = ()=>{
      }

      //DELETE note
      const deleteNote = ()=>{
      }
    
    return(
        <noteContext.Provider value = {{notes, addNote, deleteNote, editNote}}>
            {props.children}

        </noteContext.Provider>
    )
}

export default NoteState;