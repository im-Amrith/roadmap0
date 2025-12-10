import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Lmao from './Components/Lmao'
import Chatbot from './Components/Chatbot'
import ResumeProcessor from './Components/ResumeGenerator'
import InterviewPrep from './Components/Interview'
import { Menu, X, Sun, Moon, Sparkles } from 'lucide-react'

const App = () => {
  const [activeComponent, setActiveComponent] = useState('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    document.documentElement.classList.toggle('dark')
  }

  const menuItems = [
    { id: 'home', name: 'Home', component: <Lmao />, icon: '🏠' },
    { id: 'chatbot', name: 'AI Assistant', component: <Chatbot />, icon: '🤖' },
    { id: 'resume', name: 'Resume Builder', component: <ResumeProcessor />, icon: '📝' },
    { id: 'interview', name: 'Interview Prep', component: <InterviewPrep />, icon: '💼' },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-black' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-white'
    } text-gray-900 dark:text-white relative overflow-hidden`}>
      <Toaster position="top-right" />
      
      {/* Mouse follower gradient */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, ${
            theme === 'dark' ? 'rgba(124, 58, 237, 0.15)' : 'rgba(124, 58, 237, 0.1)'
          }, transparent 80%)`
        }}
      />

      {/* Theme Toggle and Mobile Menu Button */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 lg:hidden"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Sidebar Navigation */}
      <motion.nav
        initial={{ x: -300 }}
        animate={{ x: isMenuOpen ? 0 : -300 }}
        className="fixed top-0 left-0 h-full w-72 bg-white/10 backdrop-blur-md border-r border-white/20 p-6 z-40 lg:translate-x-0"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-8"
        >
          <Sparkles className="text-purple-500" size={24} />
          <h1 className="text-xl font-bold">AI Roadmap</h1>
        </motion.div>
        <div className="space-y-4">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveComponent(item.id)
                setIsMenuOpen(false)
              }}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all duration-200 flex items-center gap-3 ${
                activeComponent === item.id
                  ? 'bg-purple-600 bg-opacity-90 text-white shadow-lg shadow-purple-500/20'
                  : 'hover:bg-white/10'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
              {activeComponent === item.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="w-1.5 h-1.5 rounded-full bg-white ml-auto"
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="min-h-screen p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeComponent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto pt-16"
          >
            <motion.div
              className="card backdrop-blur-sm bg-white/10 border border-white/20"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              {menuItems.find(item => item.id === activeComponent)?.component}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </div>
  )
}

export default App