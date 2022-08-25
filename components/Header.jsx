import { DocumentAddIcon, HomeIcon } from '@heroicons/react/solid'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Logo from './Logo'
import { removeUser, selectUser } from '../slices/userSlice'
import Image from 'next/image'
import Link from 'next/link'
import { LogoutIcon } from '@heroicons/react/outline'
import Cookie from 'universal-cookie'

import { useRouter } from 'next/router'
const cookies = new Cookie()

function Header () {
  const router = useRouter()
  const user = useSelector(selectUser)
  const dispatch = useDispatch()

  const [isLogoutDropdownActive, setIsLogoutDropdownActive] = useState(false)

  const onLogout = e => {
    e.preventDefault()

    dispatch(removeUser())
    cookies.remove('token')

    router.push('/login')
  }

  return (
    <header className='fixed w-full top-0 bg-white z-50 flex space-x-3 sm:space-x-7 items-center place-content-center py-5 px-3 focus:outline-none'>
      <Logo />
      <input
        className='bg-gray-100 rounded-lg py-2 px-3 text-sm w-full sm:w-[300px] focus:outline-none'
        type='text'
        placeholder='search...'
      />
      <Link href='/'>
        <HomeIcon className='text-primary cursor-pointer' width={25} />
      </Link>

      <Link href='/create-post'>
        <DocumentAddIcon className='text-secondary cursor-pointer' width={25} />
      </Link>

      <div class='relative inline-block text-left'>
        <div
          className='flex items-center gap-2 text-sm font-semibold cursor-pointer'
          onClick={() => setIsLogoutDropdownActive(!isLogoutDropdownActive)}
        >
          <Image
            className='rounded-full'
            src={user.creds.profile_picture}
            width='30'
            height='30'
            alt='profile_picture'
          />
          <p className='hidden sm:block'>
            {user.creds.username}
          </p>
        </div>

        {isLogoutDropdownActive &&
          <div
            class='origin-top-right absolute right-0 mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
            role='menu'
            aria-orientation='vertical'
            aria-labelledby='menu-button'
            tabindex='-1'
          >
            <div
              className='flex py-2 px-3 space-x-2 items-center text-sm text-red-600 cursor-pointer'
              onClick={e => onLogout(e)}
            >
              <LogoutIcon width='20' />
              <p>Logout</p>
            </div>
          </div>}
      </div>
    </header>
  )
}

export default Header
