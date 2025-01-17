'use client';



import Link from 'next/link';
import { useState } from 'react';

import * as BackendApi from '../../network/api';
import { useRouter } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const SignInForm = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (ev: { preventDefault: () => void; }) => {
    ev.preventDefault();
    try{
      const response = await  BackendApi.login({username,password})
  
      router.push('/dashboard');
      location.reload();
    }catch(e){
      window.alert(e);
    }

  
  };

  return (
    <section className="bg-gray-50 ">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

        <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
             Login
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 ">User Name</label>
                <input type="text"
                  value={username}
                  onChange={(ev) => setUsername(ev.target.value)}

                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Username" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                <input type="password"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  autoComplete='false' placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " />
              </div>

              <button type="submit" className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Log in</button>
              <p className="text-sm font-light text-gray-500 ">
                Don’t have an account yet? <Link  href='/sign-up' className="font-medium text-primary-600 hover:underline text-lg text-blue-500">Sign up</Link>

              </p>
            </form>
          </div>
        </div>
      </div>
    </section>

  );
};

export default SignInForm;
