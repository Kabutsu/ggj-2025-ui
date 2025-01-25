import './App.css'

import Post from './components/post'

function App() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 10 }).map((_, i) => (
        <Post
          key={i}
          id={i}
          user={{
            id: i,
            name: `User ${i}`,
            username: `user${i}`,
            sentiment: Math.floor(Math.random() * 100),
          }}
          body={`Post ${i}`}
          likes={i}
          dislikes={i}
          comments={Array.from({ length: i }).map((_, j) => ({
            id: j,
            postId: i,
            body: `Comment ${j}`
          }))}
        />
      ))}
    </div>
  )
}

export default App
