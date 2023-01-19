
import React, { useState } from 'react';

function FindClient(props) {
  const [name, setName] = useState('');
  const [clients, setClients] = useState([]);

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // get existing clients from local storage
    let allClients = JSON.parse(localStorage.getItem('clients')) || [];
    // search for clients by name
    let foundClients = allClients.filter((client) => client.name.toLowerCase().includes(name.toLowerCase()));
    // set found clients in state
    setClients(foundClients);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <div><input className='search_input' type="text" value={name} onChange={handleChange} placeholder="Search by Name"/></div>
        <button className='button-17' style={{marginLeft:"5px"}} type="submit">&#128269;</button>
      </label>
      

      {clients.length > 0 ? (
        <ul>
          <li className='title_color' style={{marginLeft: "-10px", fontWeight: "bold" }}>
            <p>Name:</p>
            <p>Number:</p>
            <p>Email:</p>
          </li>
          {clients.map((client) => (
            <li key={client.name}>
              <p><button onClick={() => props.selectClient(client.id)}>{client.name}</button></p>
              <p>{client.telephone}</p>
              <p>{client.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{marginTop:"90px"}}>No clients found</p>
      )}
    </form>
  );
}

export default FindClient;
