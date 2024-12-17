import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "react-toastify";
import { json } from "stream/consumers";
import { Snapshot } from "../models/moving.dto";


export const aiAssistUrl = 'http://95.165.172.243:8001/ai-assistant'


export function getAiStrategy(promt : string, router: AppRouterInstance) {
    return fetch(aiAssistUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({promt: promt}),
      })
      .then((data) => {
        return data;
      })
      .then((result)=>result.json())
      .then((json)=>{
        return json as Snapshot[];
      })
      .catch(()=>{
        toast.error('Произошла ошибка на нашей стороне. Повторите попытку позже', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
          return undefined;
      })
  }