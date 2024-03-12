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
        <div className='flex items-center p-5 px-10 h-[90px] justify-between'>
            {/* <Image src={Logo} width={20} height={0} className='invert' alt='logo'/> */}
            <Link href='/'>
                <div className={clsx('text-[--foreground] py-3 px-4 rounded-xl font-semibold bg-[--border] shadow-xl', fullpath === '/' && 'bg-[--foreground] text-[--background]')}>
                    <img src="/logo.png" width={30} className='invert w-[30px] mx-auto'/>
                </div>
            </Link>
            {/* <button className='text-[--foreground] px-4 py-3 rounded-full font-semibold w-[110px] border border-[--border]' onClick={() => setTheme(clsx(theme === 'light' ? 'dark' : 'light'))}>
                {theme === 'light' ? (
                    'Dark'
                  ) : (
                    'Light'
                )}
            </button> */}
            {/* <div className='backdrop-blur-xl shadow-xl w-full rounded-full flex items-center px-5 gap-2 h-full'>
                <FaMagnifyingGlass className='text-[#767676]'/>
                <input placeholder='Search' className='placeholder:text-[#757575] bg-transparent w-full h-full outline-none'/>
            </div> */}
            {user ? (
                    // If user is logged in, show the profile picture
                    <img src={boardData.creator.profileImg} width={500} height={500} className='w-[110px] rounded-full mb-4'/>
                ) : (
                    // If user is not logged in, show a sign-in button
                    <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}>
                        Sign In with Google <FaGoogle />
                    </button>
                )}
        </div>
        </>
    )
}