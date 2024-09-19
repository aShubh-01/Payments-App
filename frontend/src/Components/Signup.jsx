import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { userDataAtom, errorInfoAtom } from '../States/state.jsx';
import { Heading, UserInputField, LinkMessage, ErrorMessage } from './SubComponents.jsx';
import axios from 'axios';

export default function Signup() {
    const [isError, setIsError] = useRecoilState(errorInfoAtom);
    const setUserData = useSetRecoilState(userDataAtom);

    useEffect(() => {
        setIsError({ isError: false, errorMessage: '' });
        setUserData({ firstName: '', lastName: '', username: '', password: '' });
    }, []);
    
    return <div className='bg-[#7E7E7F] min-h-screen flex justify-center'>
        <div className ='p-[5px] py-[25px] mt-[100px] h-[740px] w-[435px] bg-white rounded-2xl'>
            <div className='flex justify-center mb-[20px]'><Heading title="Sign Up" description="Enter your information to sign up"/></div>
            <div className='flex justify-center mb-[10px]'><UserInputField propertyName ="firstName" title ="First Name" type ="text" placeholderData ="John" /></div>
            <div className='flex justify-center mb-[10px]'><UserInputField propertyName ="lastName" title ="Last Name" type ="text" placeholderData ="Doe" /></div>
            <div className='flex justify-center mb-[10px]'><UserInputField propertyName ="username" title ="Username" type ="text" placeholderData ="johndoe123" /></div>
            <div className='flex justify-center mb-[10px]'><UserInputField propertyName ="password" title ="Password" type ="password" placeholderData="Minimum 6 characters"/></div>
            <div className='flex justify-center mb-[10px]'><SignupButton title="Sign Up"/></div>

            {isError.isError && 
                <div className='flex justify-center mb-[10px]'><ErrorMessage message={isError.errorMessage}/></div>
            }

            <div className='flex justify-center mb-[10px]'><LinkMessage description="Already have an account?" linkTitle="Login" hlink='/signin'/></div>

        </div>
    </div>
}

function SignupButton({title}) {
    const userData = useRecoilValue(userDataAtom);
    const setIsError = useSetRecoilState(errorInfoAtom);
    const navigate = useNavigate();

    async function postUserData() {

        await axios({
            url: 'http://localhost:3000/api/v1/user/signup',
            method: 'POST',
            data: userData,
            headers: {
                "Content-Type" : "application/json" 
            }
            
        }).then((response) => {
            if (response.status == 200) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', userData.username);
                navigate('/dashboard');
            }

        }).catch((err) => {
            const errorMessage = err.response.data.msg;
            setIsError((prevData) => (
                {...prevData, isError: true, errorMessage: errorMessage}
            ));
        });
    }

    return <div>
        <button
            className='h-[50px] w-[370px] bg-black text-[20px] font-medium text-white rounded-lg'
            onClick ={postUserData}
        >{title}</button>
    </div>
}


