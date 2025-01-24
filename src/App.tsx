import './App.css'

import Post from './components/post'

function App() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 10 }).map((_, i) => (
        <Post key={i} />
      ))}
    </div>
  )
}

export default App
