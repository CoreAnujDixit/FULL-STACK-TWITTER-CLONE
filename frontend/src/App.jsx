import Home from '../pages/Home'
import Profile from '../pages/Profile'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'

function AppHeader() {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
      <h1 
        onClick={() => navigate("/")}
        className="text-2xl font-bold text-blue-500 cursor-pointer hover:text-blue-600 transition-colors"
      >
        Twitter Clone
      </h1>
      <UserButton />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Show when="signed-out">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-8 text-blue-500">Twitter Clone</h1>
            <div className="space-x-4">
              <SignInButton />
              <SignUpButton />
            </div>
          </div>
        </div>
      </Show>
      <Show when="signed-in">
        <AppHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Show>
    </Router>
  )
}

export default App