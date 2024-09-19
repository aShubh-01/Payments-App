import { useSetRecoilState } from 'recoil';
import { userDataAtom } from '../States/state.jsx';

export function Heading({title, description}) {
    return <div>
        <h4 className='font-semibold font-sans text-center text-[40px]'>{title}</h4>
        <p className='text-[21px] font-medium text-center text-gray-500'>{description}</p>
    </div>
}

export function UserInputField({propertyName, title, type, placeholderData}) {
    const setUserData = useSetRecoilState(userDataAtom);

    return <div>
        <div className='p-[2px] m-[2px] text-[20px] font-sans font-medium'>{title}</div>
        <div className= 'p-[2px] m-[5px]'>
            <input className='pl-[15px] h-[50px] w-[370px] text-[20px] font-medium rounded-md border-black border-[2px]'
                type={type} placeholder={placeholderData} required
                onChange = {(e) => {
                    setUserData((prevState) => (
                        {...prevState, [propertyName] : e.target.value}
                    ));
                }}
            />
        </div>
    </div>
}

export function LinkMessage({description, linkTitle, hlink}) {
    return <div>
        <p className='text-[20px] font-medium'>{description} <a className='underline' href={hlink}>{linkTitle}</a></p>
    </div>
}

export function ErrorMessage({message}) {
    return <div>
        <div className='text-red-500 text-[17px] font-medium'>*{message}</div>
    </div>
}

export function UserIcon({usernameInitial}) {
    return <div className= 'h-[50px] w-[50px] text-[33px] rounded-3xl bg-gray-300 text-center  ml-[10px] '>
        {usernameInitial}
    </div>
}