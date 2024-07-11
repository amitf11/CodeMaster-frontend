import { Lobby } from './pages/Lobby'
import { CodeBlock } from './pages/CodeBlock'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/block/:blockId" element={<CodeBlock />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App