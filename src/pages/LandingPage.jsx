import React, { useContext, useState } from 'react'
import { APP_FEATURES } from '../utils/data'
import { LuSparkles } from 'react-icons/lu'
import hero from '../assets/hero.jpg'
import icon1 from '../assets/icon1.jpg'
import icon2 from '../assets/icon2.jpg'
import icon3 from '../assets/icon3.jpeg'
import icon4 from '../assets/icon4.png'
import Modal from '../components/Modal'
import LogIn from './Auth/LogIn'
import SignUp from './Auth/SignUp'
import Navbar from '../components/Layouts/Navbar' // Import the reusable Navbar

import { useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import Features from './InterviewPrep/components/Feature'

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  
  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate('/dashboard');
    }
  }

  return (
    <>
      <div className='w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
        {/* Background decorative elements */}
        <div className="w-[600px] h-[600px] bg-blue-200/30 blur-[80px] absolute top-0 left-0"></div>
        <div className="w-[400px] h-[400px] bg-indigo-300/20 blur-[60px] absolute top-20 right-0"></div>
        <div className="w-[300px] h-[300px] bg-cyan-200/25 blur-[70px] absolute top-96 left-1/2 transform -translate-x-1/2"></div>
        
        {/* Use the reusable Navbar component */}
        <Navbar showAuthButton={true} onAuthClick={() => setOpenAuthModal(true)} />
        
        <div className="container mx-auto px-4 pb-[200px] relative z-10">
          <div className="flex flex-col items-center justify-center px-4 text-center">
            <div className="w-full max-w-3xl mb-8">
              <div className="flex items-center justify-center mb-2">
                <div className="flex items-center gap-2 text-[13px] text-blue-700 font-semibold bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                  <LuSparkles /> AI Powered
                </div>
              </div>
              <h1 className="text-5xl text-slate-800 font-medium mb-2 leading-tight">
                Ace Interview with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 font-semibold">
                  AI powered
                </span>{" "}
                Learning
              </h1>
            </div>
            <div className="w-full max-w-xl">
              {/* User Testimonial Section */}
              <div className="flex items-center justify-center mb-2">
                <div className="flex items-center gap-3 text-slate-700 px-6 py-2">
                  {/* User Icons */}
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                      <img 
                        src={icon1} 
                        alt="User" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                      <img 
                        src={icon2}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                      <img 
                        src={icon3}
                        alt="User" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                      <img 
                        src={icon4}
                        alt="User" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Text */}
                  <span className="text-sm font-medium">
                    Join <span className="font-bold text-blue-700">15,725 +</span> other loving customers
                  </span>
                </div>
              </div>

              <p className="text-[17px] text-slate-700 mb-6">
                Get interview questions and model answers based on your role, experience, and specific focus areas — no filler, just what matters.
              </p>
              <button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={handleCTA}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
        
        {/* Hero Image Section - Moved here, right below Get Started button */}
        <section className='flex items-center justify-center -mt-36'>
          <div className="relative">
            <img src={hero} alt="" className='w-[80vw] rounded-xl shadow-2xl border border-blue-100' />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent rounded-xl"></div>
          </div>
        </section>
      </div>

     <Features/>

      <Modal isOpen={openAuthModal} onClose={() => {
        setOpenAuthModal(false);
        setCurrentPage("login");
      }} hideHeader>
        <div>
          {currentPage === "login" && <LogIn setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
        </div>
      </Modal>
    </>
  )
}

export default LandingPage