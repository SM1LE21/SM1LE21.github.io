import React, { useState, useEffect } from 'react';

const Client = ({ clientId = '', buttonPressed, resetButton} = {}) => {
  const [client, setClient] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // get client from local storage
    let allClients = JSON.parse(localStorage.getItem('clients')) || [];
    let foundClient = allClients.find((client) => client.id === clientId);
    setClient(foundClient);
    // get notes from local storage
    let clientNotes = JSON.parse(localStorage.getItem(`${clientId}`)) || [];
    setNotes(clientNotes);
  }, [clientId]); // this array tells the useEffect hook to run when the clientId changes
  
  useEffect(() => {
    // get client from local storage
    let allClients = JSON.parse(localStorage.getItem('clients')) || [];
    let foundClient = allClients.find((client) => client.id === clientId);
    setClient(foundClient);
    // get notes from local storage
    let clientNotes = JSON.parse(localStorage.getItem(`${clientId}`)) || [];
    setNotes(clientNotes);
    resetButton();
  }, [buttonPressed]);

  //return this if no client is chose:
  if (!client) {
    return <p>No client selected</p>;
  }
  
  function displayDate(date){
    const date_element = new Date(date);
    const year = date_element.getFullYear();
    const month = date_element.getMonth() + 1; // months are zero-indexed
    const day = date_element.getDate();
    const formattedTime = date_element.toLocaleTimeString();

    return `${month}/${day}/${year} ${formattedTime}`;

  }
  return (
    <div>
      <h2 className='title_color'>Client: {client.name}</h2>
      <div className='clientContainer'>
        <p>Telephone:</p>
        <p>{client.telephone}</p>
        <p>Email:</p>
        <p>{client.email}</p>
      </div>

      <h3>Notes</h3>
      {notes.length > 0 ? (
        <ul>
          {[...notes].reverse().map((note) => (
            <li key={note.id}>
              <div className="title">
                {note.title}
                <div className='date'>
                  {displayDate(note.lastModified)}
                  </div>
              </div>
              <div className="divider"></div>
              <div className='body'>{note.body}</div>
            </li>

          ))}
        </ul>
      ) : (
        <p style={{marginLeft: "30px"}}>No notes</p>
      )}
      
    </div>
  );
};

export default Client;
