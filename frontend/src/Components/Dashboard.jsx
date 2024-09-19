import { Heading, UserIcon } from './SubComponents.jsx'
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {

    return <div>
        <div className='flex justify-between m-[20px]'>
            <div><Heading title="Payments App"/></div>
            <div className='mt-[5px]'><GreetUser /></div>
        </div>
        <hr />
        <div className='m-[20px]'><ShowBalance /></div>
        <div className='m-[20px]'><ShowUsers /></div>
    </div>
}

function GreetUser(){
    const username = localStorage.getItem('username');
    return <div className='flex justify-between'>
        <p className='text-[26px] font-medium mr-[5px] lg:mr-[20px] mt-[6px]'>Welcome! {username} </p>
        <UserIcon usernameInitial={username[0]} />
    </div>
}

function ShowBalance(){
    const [balance, setBalance] = useState('Loading...');

    useEffect(() => {
        axios({
            url: 'http://localhost:3000/api/v1/account/balance',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        }).then((response) => {
            setBalance(response.data.balance);

        }).catch((err) => {
            console.log(err);
        })
    }, []);

    return <div>
        <p className='text-[30px] font-bold'>Your Balance &nbsp; ₹ {balance}</p>
    </div>
}

function ShowUsers(){
    const [searchFilter, setSearchFilter] = useState('');
    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        axios({
            url: 'http://localhost:3000/api/v1/user/bulk?filter=' +searchFilter,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Username': localStorage.getItem('username'),
            }

        }).then((response) => {
            if(response.status == 200) {
                setUsersList(response.data.users);
            }

        }).catch((err) => {
            console.log(err);
            return;
        })
    }, [searchFilter]);
    

    return <div>
        <div>
            <h5 className='text-[30px] font-sans font-bold'>Users</h5>
            <input className='mt-[15px] ml-[5px] mb-[20px] pl-[15px] h-[50px] w-[575px] md:w-[705px] lg:w-[1860px] text-[21px] font-medium rounded-md border-black border-[2px]'
                type="text" placeholder="Search users..."
                onChange={(e) => {
                    setSearchFilter(e.target.value);
                }}
            />
        </div>
        <div className='m-[20px] ml-[0px]'> 
        {
            usersList.map((user, index) => {
                return <RenderUser key={index} userData={user} />
            })
        } 
        </div>
    </div>
}

function RenderUser({userData}){
    const navigate = useNavigate();

    function setUpTransferMoney(){
        localStorage.setItem('receiverInfo', JSON.stringify(userData));
        navigate('/transfer');
    }

    return <div className='mb-[20px] flex justify-between '>
        <div className='flex justify-between'>
            <UserIcon usernameInitial={userData.firstName[0]} />
            <div className='m-[5px] ml-[15px] text-[28px] font-medium text-center '>{userData.firstName} {userData.lastName}</div>
        </div>
        <div>
            <button className='h-[50px] w-[150px] bg-black text-[20px] font-medium text-white rounded-lg'
                onClick={setUpTransferMoney}
            > Send Money</button>
        </div>
    </div>
}