import { Button } from "@material-tailwind/react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../provider/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  const handleSignin = async () => {
    const user = await signInWithPopup(auth, googleProvider);
    console.log(user);
    navigate("/home");
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <img src='https://links.papareact.com/1ui' height='300' width='550' alt='Login Logo' />
      <Button className='w-fit mt-10' color='blue' variant='filled' ripple onClick={() => handleSignin()}>
        Login using Google
      </Button>
    </div>
  );
};

export default Login;

// import { signIn } from "next-auth/react";
// import { Button } from "@material-tailwind/react";

// function Login() {
//   return (
//     <div className='flex flex-col items-center justify-center min-h-screen py-2'>
//       <Image src='https://links.papareact.com/1ui' height='300' width='550' objectFit='contain' alt='Logo' />
//       <Button className='w-fit mt-10' color='blue' variant='filled' ripple onClick={() => signIn()}>
//         Login using Google
//       </Button>
//     </div>
//   );
// }

// export default Login;
