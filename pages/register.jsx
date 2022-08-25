import Head from 'next/head'
import Image from 'next/image'
import Logo from '../components/Logo'
import { CameraIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Loading from '../components/Loading'

function Register () {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [previewProfilePicture, setPreviewProfilePicture] = useState()

  const [profilePictureField, setProfilePictureField] = useState({
    isError: true,
    message: '',
    value: '',
    key: 'profile_picture'
  })

  const [usernameField, setUsernameField] = useState({
    isError: true,
    message: '',
    value: '',
    key: 'username'
  })

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

  const [confirmPasswordField, setConfirmPasswordField] = useState({
    isError: true,
    message: '',
    value: '',
    key: 'confirm_password'
  })

  useEffect(
    () => {
      if (!profilePictureField.value) {
        setPreviewProfilePicture(undefined)
        return
      }

      const objectUrl = URL.createObjectURL(profilePictureField.value)
      setPreviewProfilePicture(objectUrl)

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl)
    },
    [profilePictureField.value]
  )

  const onChangeProfilePictureInput = e => {
    const profilePictureInput = e.target.files[0]

    if (profilePictureInput) {
      setProfilePictureField({
        isError: false,
        message: '',
        value: profilePictureInput,
        key: 'profile_picture'
      })
    } else {
      setProfilePictureField({
        isError: true,
        message: 'Foto Profil wajib diisi',
        value: profilePictureInput,
        key: 'profile_picture'
      })
    }
  }

  const onChangeUsernameInput = e => {
    const usernameInput = e.target.value

    if (usernameInput !== '') {
      setUsernameField({
        isError: false,
        message: '',
        value: usernameInput,
        key: 'username'
      })
    } else {
      setUsernameField({
        isError: true,
        message: 'Username wajib diisi',
        value: usernameInput,
        key: 'username'
      })
    }
  }

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

  const onChangeConfirmPasswordInput = e => {
    const confirmPasswordInput = e.target.value

    if (confirmPasswordInput === '') {
      setConfirmPasswordField({
        isError: true,
        message: 'Konfirmasi kata sandi wajib diisi',
        value: confirmPasswordInput,
        key: confirmPasswordField.key
      })
    } else if (confirmPasswordInput !== passwordField.value) {
      setConfirmPasswordField({
        isError: true,
        message: 'Kata sandi tidak sama',
        value: confirmPasswordInput,
        key: confirmPasswordField.key
      })
    } else {
      setConfirmPasswordField({
        isError: false,
        message: '',
        value: confirmPasswordInput,
        key: confirmPasswordField.key
      })
    }
  }

  const onRegister = async e => {
    e.preventDefault()

    try {
      // Set Loading Active
      setIsSubmitting(true)

      const payload = new FormData()

      payload.append(profilePictureField.key, profilePictureField.value)
      payload.append(usernameField.key, usernameField.value)
      payload.append(emailField.key, emailField.value)
      payload.append(passwordField.key, passwordField.value)

      // Call login API
      const result = await axios.post(
        process.env.ourpicture_api_url + 'auth/register',
        payload
      )

      if (result.data.status === 'success') {
        // Set Loading Unactive
        setIsSubmitting(false)

        router.push('/login')
      }
    } catch (err) {
      // Set Loading Unactive
      setIsSubmitting(false)

      const responseData = err.response.data

      if (responseData.status !== 'success') {
        const error_validation = responseData.data.error_validation

        error_validation.map(err => {
          if (err.param === profilePictureField.key) {
            setProfilePictureField({
              isError: true,
              message: responseData.data.message,
              value: profilePictureField.value,
              key: profilePictureField.key
            })
          }

          if (err.param === usernameField.key) {
            setUsernameField({
              isError: true,
              message: responseData.data.message,
              value: usernameField.value,
              key: usernameField.key
            })
          }

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
        <title>Register - OurPicture</title>
      </Head>

      {/* Image Desktop Devices */}
      <div className='hidden lg:flex flex-col gap-3 items-center place-content-center order-2'>
        <Logo />
        <Image
          src='/register_banner.png'
          width={300}
          height={300}
          className='cursor-pointer w-full h-full'
          alt='register_banner'
        />
      </div>

      <div className='flex flex-col overflow-x-hidden h-full items-center place-content-center shadow-xl order-1'>
        <div className='p-7 rounded-lg space-y-5 w-[400px]'>
          <h1 className='text-2xl text-primary text-center font-semibold'>
            Register
          </h1>
          <div className='flex flex-col items-center place-content-center space-y-3'>
            <div className='flex rounded-full w-[100px] h-[100px] bg-secondary items-center place-content-center'>
              {profilePictureField.value
                ? <div>
                  <Image
                    className='rounded-full'
                    src={previewProfilePicture}
                    width='100'
                    height='100'
                    alt='profile_picture'
                    />
                </div>
                : <CameraIcon width={50} className='text-gray-400' />}
              <input
                type='file'
                className='absolute w-[100px] opacity-0 border-2 rounded-lg text-sm outline-none'
                onChange={e => onChangeProfilePictureInput(e)}
              />
              {profilePictureField.isError &&
                <p className='text-red-600 text-xs mt-3'>
                  {profilePictureField.message}
                </p>}
            </div>
          </div>
          <div>
            <label>Username</label>
            <input
              type='text'
              className='border-2 w-full py-2 px-3 mt-2 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-primary'
              placeholder='Masukkan username'
              onChange={e => onChangeUsernameInput(e)}
            />
            {usernameField.isError &&
              <p className='text-red-600 text-xs mt-3'>
                {usernameField.message}
              </p>}
          </div>
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
            <input
              type='password'
              className='border-2 w-full py-2 px-3 mt-2 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-primary'
              placeholder='Masukkan password'
              onChange={e => onChangePasswordInput(e)}
            />
            {passwordField.isError &&
              <p className='text-red-600 text-xs mt-3'>
                {passwordField.message}
              </p>}
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type='password'
              className='border-2 w-full py-2 px-3 mt-2 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-primary'
              placeholder='Confirm password'
              onChange={e => onChangeConfirmPasswordInput(e)}
            />
            {confirmPasswordField.isError &&
              <p className='text-red-600 text-xs mt-3'>
                {confirmPasswordField.message}
              </p>}
          </div>
          <div className='space-y-3'>
            <button
              className='flex place-content-center bg-primary hover:bg-orange-500 focus:bg-primary text-white w-full py-2 rounded-lg cursor-pointer'
              onClick={e => onRegister(e)}
            >
              {isSubmitting ? <Loading /> : <div>Register</div>}
            </button>
            <p className='flex gap-1 text-xs'>
              Already have an account?{' '}
              <Link href='/login'>
                <span className='text-primary cursor-pointer font-semibold'>
                  Login
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
