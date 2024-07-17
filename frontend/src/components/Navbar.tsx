'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import * as BackendApi from '../network/api';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [userName, setUserName] = useState<null | string>(null);
  const router = useRouter();

  const getLoginuser = async () => {
    try {
      const response = await BackendApi.getLoggedInUser()
      // console.log("Navbar getLoginuser", response.username)
      setUserName(response.username)
      if (response.username) {
        console.log("router.push", response.username)
        router.push('/dashboard');
      } else {
        router.push('/sign-in');
      }
    } catch (error) {
      router.push('/sign-in');
    }
  }

  useEffect(() => {

    getLoginuser()

  }, []);

  return (
    <div className=' bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0'>
      <div className='container mx-auto flex items-center justify-between '>
        <Link href='/'>
          Crypto
        </Link>
        {userName ? (
          <div>
            <Link className="mx-3 p-2 border bg-blue-400" href='/dashboard'>
              Dashboard
            </Link>
            <Link href='#'  className="mx-3 p-2 border bg-blue-400" onClick={async () => {
              console.log("Logout")
              await BackendApi.logout()
              router.push('/');
              window.location.reload();
            }}>
              {userName} : Logout
            </Link>
          </div>
        ) : (
          <Link href='/sign-in'>
            Sign in
          </Link>
        )}

      </div>
    </div>
  );
};

export default Navbar;
