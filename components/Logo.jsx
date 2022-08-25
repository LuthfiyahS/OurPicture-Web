import Image from 'next/image'

function Logo () {
  return (
    <div className='flex space-x-1 items-center place-content-center'>
      <Image src='/favicon.ico' width='40' height='40' alt='icon' />
      <h1 className='text-primary hidden sm:block text-2xl font-bold'>Our Picture</h1>
    </div>
  )
}

export default Logo
