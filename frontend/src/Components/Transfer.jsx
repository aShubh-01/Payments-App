import { transferAmountAtom, errorInfoAtom } from '../States/state.jsx';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Heading, ErrorMessage } from './SubComponents.jsx';

export default function Transfer() {
    const [errorInfo, setErrorInfo] = useRecoilState(errorInfoAtom);
    
    useEffect(() => {
        setErrorInfo({ isError: false, errorMessage: '' });
    }, []);

    return <div className='bg-gray-100 min-h-screen flex justify-center'>
        <div className='mt-[150px] w-[600px] h-[400px] shadow-lg rounded-xl bg-white'>
            <div className='mt-[20px] flex justify-center'><Heading title="Send Money" /></div>
            <div className='mt-[50px] flex justify-center'><SendComponent /></div>
            {errorInfo.isError && 
                <div className='mt-[0px] flex justify-center'><ErrorMessage message={errorInfo.errorMessage}/></div>
            }
        </div>
    </div>
}

function SendComponent() {

    const receiverInfo = JSON.parse(localStorage.getItem('receiverInfo'));
    
    return <div>
        <div className='flex justify-start'>
            <div><UserIcon usernameInitial={receiverInfo.username[0]} /></div>
            <div className='ml-[20px]'><p className='text-[33px] text-center font-medium'>{receiverInfo.firstName} {receiverInfo.lastName}</p></div>
        </div>
        <div className='m-[15px]'><TransferAmountField /></div>
        <div className='m-[15px]'><SendButton /></div>
    </div>
}

function UserIcon({usernameInitial}) {
    return <div className= 'h-[50px] w-[50px] text-[33px] text-white rounded-3xl bg-blue-400 text-center  ml-[10px] '>
        {usernameInitial}
    </div>
}

function TransferAmountField(){
    const setTransferAmount = useSetRecoilState(transferAmountAtom);

    return <div>
        <p className='text-[20px] font-medium mb-[10px]'>Amount {'(in Rs)'}</p>
        <input type='number' placeholder='Enter amount'
            className='pl-[15px] ml-[1px] h-[50px] w-[420px] text-[20px] font-medium rounded-md border-black border-[2px]'
            onChange={(e) => {
                setTransferAmount(e.target.value);
            }}
        />
    </div>
}

function SendButton(){
    const setErrorInfo = useSetRecoilState(errorInfoAtom);
    const transferAmount = useRecoilValue(transferAmountAtom);
    const receiverInfo = JSON.parse(localStorage.getItem('receiverInfo'));
    
    function transferMoney(){

        setErrorInfo({isError: true, errorMessage: 'Processing Transfer...'});

        axios({
            url: 'http://localhost:3000/api/v1/account/transfer',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            data: {
                to: receiverInfo.username,
                amount: transferAmount
            }
        }).then((response) => {
            if (response.status == 200) {
                setErrorInfo({isError: true, errorMessage: response.data.msg })
            }
        }).catch((err) => {
            console.log(err);
            setErrorInfo({ isError: true, errorMessage: err.response.data.msg});
        })
    }

    return <div>
        <button className='h-[50px] w-[422px] bg-blue-500 text-[20px] font-medium text-white rounded-lg'
            onClick={transferMoney}
        >Initiate Transfer</button>
    </div>
}