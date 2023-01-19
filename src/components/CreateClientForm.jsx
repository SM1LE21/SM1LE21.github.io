import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import "react-toastify/dist/ReactToastify.css";

function CreateClientForm() {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    telephone: '',
    email: ''
  });

  // create a boolean value that indicates whether the form is valid or not
  const formIsValid = formData.name !== '' && formData.telephone !== '' && formData.email !== '';

  const handleSubmit = (event) => {
    event.preventDefault();
    // get existing clients from local storage, or create an empty array if none exist
    let clients = JSON.parse(localStorage.getItem('clients')) || [];
    let clientExists = clients.some((client) => client.id === formData.id);
    if (!clientExists) {
        // add new client to array
        clients.push(formData);
        // save updated array to local storage
        localStorage.setItem('clients', JSON.stringify(clients));
        // send notification to user
        toast.success('Client created successfully', {
            position: "bottom-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
    } else if (clientExists) {
        toast.error('Client already exists', {
            position: "bottom-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
    }
    
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            style={{maxWidth: '300px', marginLeft: '-5px'}}
            className='search_input'
            type='text'
            id='name'
            value={formData.name}
            onChange={(event) => setFormData({ ...formData, id: uuid(), name: event.target.value })}
          />
        </div>

        <div>
          <label htmlFor="telephone">Telephone:</label>
          <input
            style={{maxWidth: '300px', marginLeft: '-5px'}}
            className='search_input'
            type="text"
            id="telephone"
            value={formData.telephone}
            onChange={(event) => setFormData({ ...formData, id: uuid(), telephone: event.target.value })}
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            style={{maxWidth: '300px', marginLeft: '-5px'}}
            className='search_input'
            type="email"
            id="email"
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, id: uuid(), email: event.target.value })}
          />
        </div>
      </div>

      <br />
      {/* bind the disabled prop to the formIsValid value */}
      <button className='button-17' style={{marginBottom: "15px"}} type="submit" disabled={!formIsValid}>
        Create Client
      </button>
    </form>
  );
}

export default CreateClientForm;