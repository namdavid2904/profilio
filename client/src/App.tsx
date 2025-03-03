import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CustomCursor from './components/Cursor'

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))
const Contact = lazy(() => import('./pages/Contact'))
const Experience = lazy(() => import('./pages/Experience'))

const App = () => {
  return (
    <BrowserRouter>
      <CustomCursor/>
      <Navbar/>
      <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/experience" element={<Experience/>}/>
          <Route path="/projects" element={<Projects/>}/>
          <Route path="/contact" element={<Contact/>}/>
        </Routes>
      </Suspense>
      <Footer/>
    </BrowserRouter>
  )
}

export default App