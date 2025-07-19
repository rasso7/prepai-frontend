import React from 'react'
import { APP_FEATURES } from '../../../utils/data'
import LogoCloud from './LogoCloud'

const Features = () => {
  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-8">
      {/* Enhanced Background Blur Effects */}
      <div className="w-[800px] h-[800px] bg-blue-200/20 blur-[120px] absolute -top-40 -left-40 animate-pulse"></div>
      <div className="w-[600px] h-[600px] bg-indigo-300/15 blur-[100px] absolute -top-20 -right-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="w-[400px] h-[400px] bg-cyan-200/20 blur-[80px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="w-[500px] h-[500px] bg-blue-300/10 blur-[90px] absolute bottom-0 right-1/4 animate-pulse" style={{animationDelay: '3s'}}></div>
      
      <div className="relative z-10 w-full min-h-screen">
        <div className="container mx-auto px-6 lg:px-8 py-16">
          <section className="space-y-16">
            {/* Header Section */}
            <div className="text-center space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
                Features of{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Interview Prep AI
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Master your interviews with AI-powered practice sessions and personalized feedback
              </p>
            </div>

            <LogoCloud />

            {/* Features Grid */}
            <div className="space-y-12">
              {/* First Row - 3 Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {APP_FEATURES.slice(0, 3).map((feature, index) => (
                  <div 
                    className="group relative bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-100/50 hover:border-blue-200/70 hover:bg-white/90 hover:-translate-y-2 transform" 
                    key={feature.id}
                    style={{animationDelay: `${index * 0.2}s`}}
                  >
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      {/* Feature Number */}
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm mb-4 group-hover:bg-blue-200 transition-colors">
                        {index + 1}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-4 text-slate-800 group-hover:text-blue-700 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      
                      <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Second Row - 2 Cards Centered */}
              <div className="flex justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
                  {APP_FEATURES.slice(3).map((feature, index) => (
                    <div 
                      className="group relative bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-100/50 hover:border-blue-200/70 hover:bg-white/90 hover:-translate-y-2 transform" 
                      key={feature.id}
                      style={{animationDelay: `${(index + 3) * 0.2}s`}}
                    >
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative z-10">
                        {/* Feature Number */}
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm mb-4 group-hover:bg-blue-200 transition-colors">
                          {index + 4}
                        </div>
                        
                        <h3 className="text-xl font-bold mb-4 text-slate-800 group-hover:text-blue-700 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        
                        <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Enhanced Footer */}
        <div className="relative z-10 bg-gradient-to-r from-slate-100/80 to-blue-50/80 backdrop-blur-sm text-slate-600 text-center py-8 mt-16 border-t border-slate-200/50">
          <div className="container mx-auto px-6">
            <p className="text-lg">
              Made with{' '}
              <span className="text-red-500 animate-pulse">❤️</span>
              {' '}by{' '}
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Rasso
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Features