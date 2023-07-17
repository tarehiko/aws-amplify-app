import './App.css';
import { MyForm } from './ui-components'

function App() {
  return <MyForm
    onSubmit={fields => console.log(fields)}
  />
}

export default App;
