import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import { userDataAtom, errorInfoAtom } from '../States/state.jsx';
import { useNavigate } from 'react-router-dom';
import { Heading, UserInputField, LinkMessage, ErrorMessage} from './SubComponents.jsx';
import axios from 'axios';

export default function Signin() {
    const [isError, setIsError] = useRecoilState(errorInfoAtom);
    const setUserData = useSetRecoilState(userDataAtom);

    useEffect(() => {
        setIsError({isError: false, errorMessage: ''});
        setUserData({ firstName: '', lastName: '', username: '', password: '' })
    }, []);

    return <div className='bg-[#7E7E7F] min-h-screen flex justify-center'>
        <div className ='p-[5px] py-[25px] mt-[100px] h-[550px] w-[435px] bg-white rounded-2xl'>
            <div className='flex justify-center mb-[15px]'><Heading title="Sign In" description="Enter your credentials to access your account" /></div>
            <div className='flex justify-center mb-[15px]'><UserInputField propertyName="username" title="Username" type="text" placeholderData="johndoe123" /></div>
            <div className='flex justify-center mb-[15px]'><UserInputField propertyName="password" title="Password" type="password" /></div>
            <div className='flex justify-center mb-[15px]'><SigninButton title="Signin"/></div>
            {isError.isError &&
                <div className='flex justify-center mb-[15px]'><ErrorMessage message={isError.errorMessage}/></div>
            }
            <div className='flex justify-center'><LinkMessage description="Dont have an account?" linkTitle="SignUp" hlink="/signup" /></div>
        </div>
    </div>
}

function SigninButton({title}){
    const userData = useRecoilValue(userDataAtom);
    const setErrorInfo = useSetRecoilState(errorInfoAtom);
    const navigate = useNavigate();

    async function findUser() {

        if(userData.username == '' || userData.password.length == '') {
            setErrorInfo((prevData) => ({...prevData,
                isError: true, errorMessage: 'Please enter valid information'
            }))
            return;
        }

        await axios ({
            url: 'http://localhost:3000/api/v1/user/signin',
            method: 'POST',
            headers: {
                "Content-Type" : 'application/json',
            },
            data : {
                username: userData.username,
                password: userData.password,
            }

        }).then ((response) => {
            if(response.status == 200) {
                localStorage.setItem('username', userData.username);
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            }

        }).catch ((err) => {
            console.log(err)
            setErrorInfo((prevData) => ({...prevData,
                isError: true, errorMessage: err.response.data.msg,
            }));
        })
    }

    return <div>
        <button className='h-[50px] w-[370px] bg-black text-[20px] font-medium text-white rounded-lg'
            onClick = {findUser}
        >{title}</button>
    </div>
}

