import { atom, selector } from 'recoil';

export const userDataAtom = atom({
    key: 'userDataAtom',
    default: {
        firstName: '',
        lastName: '',
        username: '',
        password: ''
    }
});

export const errorInfoAtom = atom({
    key: 'isErrorAtom',
    default: {
        isError: false,
        errorMessage: '',
    },
});

export const transferAmountAtom = atom({
    key: 'transferAmountAtom',
    default: 0
})