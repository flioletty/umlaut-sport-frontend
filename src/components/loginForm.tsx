"use client"

import { useState } from "react";
import { Button } from "./button";
import { LineInput } from "./line-input";
import { login } from "../services/auth-service";
import { useRouter } from "next/navigation";
import { Bounce, ToastContainer } from "react-toastify";

export function LoginForm() {
    const [email, setMail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter()

    function validate() {
        if (email.length < 3)
            return "Почта должна быть не менее 3 символов";
        else if (/[A-Za-z@.0-9 ]*/.test(email) == false)
            return "Почта должна состоять только из латинских букв, цифр и символов @ и .";
        else if (password.length < 3)
            return "Пароль должен быть не менее 3 символов";
        return "ok"
    }

    return (
        <div className="p-2">
            <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
            />
            <div className="flex fixed w-3/4 top-1/4 left-1/3">
                <div className="flex p-16 gap-10 justify-center items-center flex-col bg-neutral-800 rounded top-2/4 left-2/4">
                    <div className="text-2xl flex items-center font-semibold">
                        Вход
                    </div>
                    <div className="flex items-start flex-col gap-9">
                        <LineInput color='white' label="Почта" type='email' onChange={(val)=>{setMail(val)}} value={email} pattern="[A-Za-z@.0-9 ]*"></LineInput>
                        <LineInput color='white' label="Пароль" type='password' onChange={(val)=>{setPassword(val)}} value={password}></LineInput>
                    </div>
                    <div className="flex flex-col items-center max-w-64">
                        <div className="text-white text-xs">Еще нет аккаунта?  
                            <span className="cursor-pointer underline underline-offset-2" onClick={()=>router.push('/register')}> Зарегистрируйтесь</span>
                        </div>
                        {validate()!=='ok' && <div className="text-red-500 text-xs text-center">{validate()}</div>}
                        <Button disabled={validate()!=='ok'}  label='Войти' clickHandler={()=>{login(email, password, router)}} color='orange'/>
                    </div>
                </div>
                <div className="w-3/5" 
                    style={{ 
                        backgroundImage: `url(ball-photo.svg)`, 
                        backgroundRepeat: 'no-repeat', backgroundSize: 'contain'}}>
                </div>
            </div>
        </div>
    )
}