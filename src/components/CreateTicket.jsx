import React, { useState } from 'react';
import { v4 as uuid } from 'uuid'; // for generating unique IDs for notes

const CreateTicket = ({ clientId = '' , handleButtonPress} = {}) => {
  // useState hook for managing state in functional components
  const [title, setTitle] = useState(''); // for storing the title of the note
  const [body, setBody] = useState(''); // for storing the body of the note
  const client = clientId ? JSON.parse(localStorage.getItem('clients')).find((client) => client.id === clientId) : undefined;

  // function for creating a new note
  const createNote = () => {
    if (client) {
      // generate a new ID for the note
      const id = uuid();

      // create the note object
      const newNote = {
        id,
        lastModified: Date.now(),
        title,
        body
      };

      // get the existing notes for the current client from local storage
      const clientId = client.id;
      let notes = JSON.parse(localStorage.getItem(clientId));

      // if there are no existing notes, create an empty array
      if (!notes) {
        notes = [];
      }

      // add the new note to the array of notes
      notes.push(newNote);

      // save the updated array of notes to local storage
      localStorage.setItem(clientId, JSON.stringify(notes));

      // reset the form fields
      setTitle('');
      setBody('');
      }
    };
      
        return (
          <div>
            {client ? (
              <h2 className='title_color'>Create a new note for {client.name}</h2>
            ) : (
              <h2 className='title_color'>Please select a client to create a note for</h2>
            )}
            <form>
              <div style={{paddingBottom: "10px"}}>
                <label htmlFor="title" style={{marginRight:"20px"}}>Title:</label>
                <input
                  style={{maxWidth: '300px', marginLeft: '-5px'}}
                  className='search_input'
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <br />
              <label htmlFor="body">Body:</label>
              <textarea
              style={{borderRadius: '12px'}}
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <br />
              <button className='button-17' type="button" style={{marginBottom: "10px"}} onClick={() => {createNote(); handleButtonPress();}} disabled={!client}>
                Create Note
              </button>
            </form>
          </div>
        );
      };
      
      export default CreateTicket;
      