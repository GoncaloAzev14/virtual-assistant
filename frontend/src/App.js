import logo from './logo.svg';
import './App.css';
import Chat from './Chat';

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}*/

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <Chat />
    </div>
  );
}



export default App;