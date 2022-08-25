import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import Logo from '../components/Logo'
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import Loading from '../components/Loading'

function Login () {
  const router = useRouter()

  const [cookies, setCookie] = useCookies()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [emailField, setEmailField] = useState({
    isError: true,
    message: '',
    value: '',
    key: 'email'
  })

  const [passwordField, setPasswordField] = useState({
    isError: true,
    message: '',
    value: '',
    key: 'password'
  })

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const onChangeEmailInput = e => {
    const emailInput = e.target.value

    if (emailInput === '') {
      setEmailField({
        isError: true,
        message: 'Email wajib diisi',
        value: emailInput,
        key: 'email'
      })
    } else if (
      !emailInput
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      setEmailField({
        isError: true,
        message: 'Email yang anda masukkan tidak valid',
        value: emailInput,
        key: 'email'
      })
    } else {
      setEmailField({
        isError: false,
        message: '',
        value: emailInput,
        key: 'email'
      })
    }
  }

  const onChangePasswordInput = e => {
    const passwordInput = e.target.value

    if (passwordInput === '') {
      setPasswordField({
        isError: true,
        message: 'Kata sandi wajib diisi',
        value: passwordInput,
        key: 'password'
      })
    } else if (passwordInput.length < 8) {
      setPasswordField({
        isError: true,
        message: 'Kata sandi diisi minimal 8 karakter',
        value: passwordInput,
        key: 'password'
      })
    } else {
      setPasswordField({
        isError: false,
        message: '',
        value: passwordInput,
        key: 'password'
      })
    }
  }

  const onLogin = async e => {
    e.preventDefault()

    try {
      // Set Loading Active
      setIsSubmitting(true)

      // Call login API
      const result = await axios.post(
        process.env.ourpicture_api_url + 'auth/login',
        {
          email: emailField.value,
          password: passwordField.value
        }
      )

      if (result.data.status === 'success') {
        // Set Loading Unactive
        setIsSubmitting(false)

        // Store token to redux state
        const token = result.data.data.token

        // Set token to cookie
        setCookie('token', token)
        
        router.push('/')
      }
    } catch (err) {
      // Set Loading Unactive
      setIsSubmitting(false)

      const responseData = err.response.data

      if (responseData.status !== 'success') {
        const error_validation = responseData.data.error_validation

        error_validation.map(err => {
          if (err.param === emailField.key) {
            setEmailField({
              isError: true,
              message: responseData.data.message,
              value: emailField.value,
              key: emailField.key
            })
          }

          if (err.param === passwordField.key) {
            setPasswordField({
              isError: true,
              message: responseData.data.message,
              value: passwordField.value,
              key: passwordField.key
            })
          }
        })
      }
    }
  }

  return (
    <div className='flex gap-20 items-center place-content-center min-h-screen bg-white'>
      <Head>
        <title>Login | OurPicture</title>
      </Head>

      {/* Image Desktop Devices */}
      <div className='hidden lg:flex flex-col gap-3 items-center place-content-center order-2'>
        <Logo />
        <Image
          src='/login_banner.png'
          width={300}
          height={300}
          className='cursor-pointer w-full h-full'
          alt='login_banner'
        />
      </div>

      <div className='flex flex-col overflow-x-hidden h-full items-center place-content-center shadow-xl order-1'>
        <div className='shadow-lg p-7 rounded-lg space-y-5 w-[400px]'>
          <h1 className='text-2xl text-primary text-center font-semibold'>
            Login
          </h1>
          <div>
            <label>Email</label>
            <input
              type='text'
              className='border-2 w-full py-2 px-3 mt-2 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-primary'
              placeholder='Masukkan email'
              onChange={e => onChangeEmailInput(e)}
            />
            {emailField.isError &&
              <p className='text-red-600 text-xs mt-3'>
                {emailField.message}
              </p>}
          </div>
          <div>
            <label>Password</label>
            <div className='relative w-full'>
              <div className='absolute inset-y-0 right-0 flex items-center px-3 pt-2'>
                <input className='hidden js-password-toggle' type='checkbox' />
                {isPasswordVisible
                  ? <EyeOffIcon
                    className='text-gray-400 cursor-pointer js-password-label'
                    width={20}
                    onClick={() => setIsPasswordVisible(false)}
                    />
                  : <EyeIcon
                    className='text-gray-400 cursor-pointer js-password-label'
                    width={20}
                    onClick={() => setIsPasswordVisible(true)}
                    />}
              </div>
              <input
                type={`${isPasswordVisible ? 'text' : 'password'}`}
                className='border-2 w-full py-2 px-3 mt-2 rounded-lg text-sm focus:outline-none focus:border-primary'
                placeholder='Masukkan Kata Sandi'
                onChange={e => onChangePasswordInput(e)}
              />
            </div>
            {passwordField.isError &&
              <p className='text-red-600 text-xs mt-3'>
                {passwordField.message}
              </p>}
          </div>

          <div className='flex space-x-2 items-center text-sm'>
            <p className='text-gray-600'>Remember me</p>
            <input type='checkbox' />
          </div>

          <div className='space-y-3'>
            <button
              className='flex place-content-center bg-primary hover:bg-orange-500 focus:bg-primary text-white w-full py-2 rounded-lg cursor-pointer'
              onClick={e => onLogin(e)}
            >
              {isSubmitting ? <Loading /> : <div>Login</div>}
            </button>
            <p className='flex gap-1 text-xs'>
              Doesn&apos;t have an account?
              <Link href='/register'>
                <span className='text-primary cursor-pointer font-semibold'>
                  Sign Up
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
