import { FaMagnifyingGlass } from 'react-icons/fa6';
import Logo from '@/public/logo.png'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes'
import clsx from 'clsx';

export default function Navbar() {
    const { theme, setTheme } = useTheme()
    const fullpath = usePathname()

    console.log(fullpath)

    return (
        <>
        {/* Navbar */}
        <div className='flex items-center p-5 px-10 gap-5 h-[90px]'>
            {/* <Image src={Logo} width={20} height={0} className='invert' alt='logo'/> */}
            <Link href='/'>
                <h1 className={clsx('px-4 py-3 rounded-full font-medum h-full', fullpath === '/' && 'bg-[--foreground] text-[--background]')}>Home</h1>
            </Link>
            {/* <button className='text-[--foreground] px-4 py-3 rounded-full font-semibold w-[110px] border border-[--border]' onClick={() => setTheme(clsx(theme === 'light' ? 'dark' : 'light'))}>
                {theme === 'light' ? (
                    'Dark'
                  ) : (
                    'Light'
                )}
            </button> */}
            <div className='bg-[--light-gray] w-full rounded-full flex items-center px-5 gap-2 h-full'>
                <FaMagnifyingGlass className='text-[#767676]'/>
                <input placeholder='Search' className='placeholder:text-[#757575] bg-transparent w-full h-full outline-none'/>
            </div>
            <button className='text-[--foreground] px-4 py-2 rounded-full font-semibold w-[110px]'>
                Sign In
            </button>
        </div>
        </>
    )
}