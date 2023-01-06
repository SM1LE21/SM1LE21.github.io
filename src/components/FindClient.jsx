
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
        Name:
        <input style={{marginLeft:"15px", color:"black", } } type="text" value={name} onChange={handleChange} placeholder="Search by Name"/>
        <button style={{marginLeft:"15px"}} type="submit">Search</button>
      </label>
      

      {clients.length > 0 ? (
        <ul>
          <li style={{marginLeft: "-10px",color: "#5333ed", fontWeight: "bold" }}>
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
