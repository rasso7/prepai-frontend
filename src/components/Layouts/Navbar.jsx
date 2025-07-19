import React, { useContext } from 'react'
import ProfileInfoCard from '../Cards/ProfileInfoCard'
import { Link } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'

const Navbar = ({ onAuthClick, showAuthButton = false }) => {
  const { user } = useContext(UserContext);

  return (
    <div className='w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 sticky top-0 z-30 border-b border-blue-100/50'>
      <div className="container mx-auto px-4 pt-6 pb-6">
        <header className="lg:mx-12 flex items-center justify-between">
          <Link to="/dashboard">
            <div className="text-2xl text-slate-800 font-bold hover:text-blue-700 transition-colors">
              PrepAi
            </div>
          </Link>
          
          {user ? (
            <ProfileInfoCard />
          ) : showAuthButton ? (
            <button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:from-blue-700 hover:to-indigo-700 border border-blue-200 hover:border-blue-300 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105" 
              onClick={onAuthClick}
            >
              Login/Signup
            </button>
          ) : (
            <ProfileInfoCard />
          )}
        </header>
      </div>
    </div>
  )
}

export default Navbar