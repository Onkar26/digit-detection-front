import DrawableCanvas from './components/DrawableCanvas';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Draw a digit you want to detect</h1>
      <DrawableCanvas width={400} height={300}/>
    </div>
  );
}

export default App;
