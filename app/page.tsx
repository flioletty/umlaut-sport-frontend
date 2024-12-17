"use client"

import { Button } from '@/src/components/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Home() {
  const router = useRouter()
  return (
    <>
      <div className='flex justify-between p-5'>
        <div className='font-bold text-2xl'>Ö spÖrt</div>
        <div className=''>
          <Button label="Зарегистрироваться" color="grey"  clickHandler={()=>{router.push('/register')}} />
          <Button label="Войти" color="orange"  clickHandler={()=>{router.push('/login')}} />
        </div>
      </div>
      <div>
        <img src="/landing.svg" alt={'landing'} width={'100%'}/>
      </div>
      <div className='text-2xl gap-6 flex flex-col ml-20 pb-20'>
          <div className="text-4xl">Основные преимущества</div>
          <div className="text-3xl">1. Интерактивная доска для рисования</div>
          <div className="ml-7">Создавайте стратегии с помощью шаблонов зала, различных кистей и анимаций.</div>
          <div className="text-3xl">2. Разделение доступов</div>
          <div className="ml-7">Делитесь стратегиями с другими тренерами и командами.</div>
          <div className="text-3xl">3. Просматривайте стратегии где угодно</div>
          <div className="ml-7">Цифровые записи вашего тренера всегда под рукой</div>
          <div className="text-3xl">4. Вдохновение от искусственного интеллекта</div>
          <div className="ml-7">В сервисе доступна генерация новых стратегий при помощи ИИ, что, конечно не заменит опыт тренера, но может натолкнуть на новые необычные решения</div>
          <div className="text-3xl">5. Разные вида спорта в одном сервисе</div>
          <div className="ml-7">Для любителей разнообразия в командном спорте</div>
      </div>
    </>
  );
}
