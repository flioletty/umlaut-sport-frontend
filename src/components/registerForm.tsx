"use client"

import { useState } from "react";
import { Button } from "./button";
import { LineInput } from "./line-input";
import { register } from "../services/auth-service";
import { useRouter } from "next/navigation";

export function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setMail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter()

    function validate() {
        if (name.length < 3)
            return "Имя должно быть не менее 3 символов";
        else if (/[A-Za-zА-Яа-я0-9 ]*/.test(name) == false)
            return "Имя должно состоять только из букв и цифр";
        else if (email.length < 3)
            return "Почта должна быть не менее 3 символов";
        else if (/[A-Za-z@.0-9 ]*/.test(email) == false)
            return "Почта должна состоять только из латинских букв, цифр и символов @ и .";
        else if (password.length < 3)
            return "Пароль должен быть не менее 3 символов";
        return "ok"
    }

    return (
        <div className="flex fixed w-3/4 top-1/4 left-1/4">
            <div className="w-2/5" 
            style={{ 
                backgroundImage: `url(player-photo.svg)`, 
                backgroundRepeat: 'no-repeat', backgroundSize: 'contain'}}>
            </div>
            <div className="flex m-7 ml-12 p-16 gap-10 justify-center items-center flex-col bg-neutral-800 rounded top-2/4 left-2/4">
                <div className="text-2xl flex items-center font-semibold">
                    Регистрация
                </div>
                <div className="flex items-start flex-col gap-9">
                    <LineInput color='white' label="Имя" onChange={(val)=>{setName(val)}} value={name} pattern="[A-Za-zА-Яа-я0-9 ]*"></LineInput>
                    <LineInput color='white' label="Почта" type='email' onChange={(val)=>{setMail(val)}} value={email} pattern="[A-Za-z@.0-9 ]*"></LineInput>
                    <LineInput color='white' label="Пароль" type='password' onChange={(val)=>{setPassword(val)}} value={password}></LineInput>
                </div>
                <div className="flex flex-col items-center">
                    {validate()!=='ok' && <div className="text-red-500 text-xs">{validate()}</div>}
                    <Button disabled={validate()!=='ok'} label='Зарегистрироваться' clickHandler={()=>{register(name, email, password); router.push('/strategies')}} color='orange'/>
                </div>
            </div>
        </div>
    )
}