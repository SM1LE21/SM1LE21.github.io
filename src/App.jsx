
import "./App.css";
import CreateClientForm from "./components/CreateClientForm";
import FindClient from "./components/FindClient";
import Client from "./components/Client";
import CreateTicket from "./components/CreateTicket";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";


function App() {
  const [clientId, setClientId] = useState(null);

  const selectClient = (id) => {
    console.log("hays");
    setClientId(id);
  }

  const [showCreateClientForm, setShowCreateClientForm] = useState(false);
  const handleToggleCreateClientForm = () => {
    setShowCreateClientForm(!showCreateClientForm);
  }

  const [showFindClientForm, setShowFindClientForm] = useState(false);
  const handleToggleFindClientForm = () => {
    setShowFindClientForm(!showFindClientForm);
  }

  //rerender Client component when button is pressed
  const [buttonPressed, setButtonPressed] = useState(false);

  function resetButton(){
    setButtonPressed(false)
    console.log("button reset")
  }
  const handleButtonPress = () => {
    setButtonPressed(true);
    console.log("pressed");
  }

  useEffect(() => {
  console.log(`clientId has been updated to ${clientId}`);
}, [clientId]);


  return (
    <div className="App">
      <div className="header" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto auto" }}>
        <div className="findClient" >
          <div className="findClientText" >
            { showFindClientForm ? <FindClient selectClient={selectClient} /> : null }
            <button className="button-17" style={{marginBottom: '10px'}} onClick={handleToggleFindClientForm}>
              { showFindClientForm ? 'Cancel' : 'Find Client' }
            </button>
          </div>
        </div>
        <div className="createClientForm">
          { showCreateClientForm ? <CreateClientForm /> : null }
          <button className="button-17" style={{marginBottom: '10px'}} onClick={handleToggleCreateClientForm}>
            { showCreateClientForm ? 'Cancel' : 'Add client' }
          </button>
        </div>
        <div className="client">
          <Client clientId={clientId} buttonPressed={buttonPressed} resetButton={resetButton}/>
        </div>
        <div className="createTicket">
          <CreateTicket clientId={clientId} handleButtonPress={handleButtonPress}/>
        </div>
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      /> 
    </div>
  );
}

export default App;
