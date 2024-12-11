"use client"

import { useState } from "react";
import { Button } from "./button";
import { LineInput } from "./line-input";
import { login } from "../services/auth-service";
import { useRouter } from "next/navigation";
import { main } from "framer-motion/client";

export function LoginForm() {
    const [email, setMail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter()

    return (
        <div className="flex fixed w-3/4 top-1/4 left-1/3">
            <div className="flex p-16 gap-10 justify-center items-center flex-col bg-neutral-800 rounded top-2/4 left-2/4">
                <div className="text-2xl flex items-center font-semibold">
                    Вход
                </div>
                <div className="flex items-start flex-col gap-9">
                    <LineInput color='white' label="Почта" type='email' onChange={(val)=>{setMail(val)}} value={email}></LineInput>
                    <LineInput color='white' label="Пароль" type='password' onChange={(val)=>{setPassword(val)}} value={password}></LineInput>
                </div>
                <div className="flex items-center">
                    <Button label='Войти' clickHandler={()=>{console.log(email, password); login(email, password); router.push('/strategies')}} color='orange'/>
                </div>
            </div>
            <div className="w-3/5" 
                style={{ 
                    backgroundImage: `url(ball-photo.svg)`, 
                    backgroundRepeat: 'no-repeat', backgroundSize: 'contain'}}>
            </div>
        </div>
    )
}