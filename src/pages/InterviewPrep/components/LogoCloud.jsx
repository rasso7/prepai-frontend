import React from 'react'
import logo1 from '../../../assets/logo-cloud/savvycal.svg'
import logo2 from '../../../assets/logo-cloud/laravel.svg'
import logo3 from '../../../assets/logo-cloud/tuple.svg'
import logo4 from '../../../assets/logo-cloud/transistor.svg'
import logo5 from '../../../assets/logo-cloud/statamic.svg'

const LogoCloud = ({ className }) => {
  return (
    <div
      className={`${className} flex justify-between max-sm:mx-auto max-sm:max-w-md max-sm:flex-wrap max-sm:justify-evenly max-sm:gap-x-4 max-sm:gap-y-4`}
    >
      <img
        alt="SavvyCal"
        src={logo1}
        className="h-9 max-sm:mx-auto sm:h-8 lg:h-12"
      />
      <img
        alt="Laravel"
        src={logo2}
        className="h-9 max-sm:mx-auto sm:h-8 lg:h-12"
      />
      <img
        alt="Tuple"
        src={logo3}
        className="h-9 max-sm:mx-auto sm:h-8 lg:h-12"
      />
      <img
        alt="Transistor"
        src={logo4}
        className="h-9 max-sm:mx-auto sm:h-8 lg:h-12"
      />
      <img
        alt="Statamic"
        src={logo5}
        className="h-9 max-sm:mx-auto sm:h-8 lg:h-12"
      />
    </div>
  )
}

export default LogoCloud