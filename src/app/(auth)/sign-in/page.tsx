"use client"
import { useForm } from "react-hook-form";
import "./SignIn.scss";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import axios , {AxiosError} from "axios";
import { useEffect, useState } from "react";
import { useDebounceValue } from 'usehooks-ts';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";


export function SignIn(){

  const [username , setUsername] = useState("");
  const [usernameMessage , setUsernameMessage] = useState("");
  const [isCheckingUsername , setIsCheckingUsername] = useState(false);
  const [isSubmitting , setIsSubmitting] = useState(false);

  const debouncedUsername =  useDebounceValue(username , 300);

  const {toast} = useToast();
  const router = useRouter();

  //zod implementation

  const form = useForm({
    resolver : zodResolver(signUpSchema),
    defaultValues : {
      username : "",
      email : "",
      password : ""
    }
  })

  useEffect(()=>{

    const checkUsernameUniqueness = async ()=>{

      if(debouncedUsername){
        try {
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)

          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error Checking Username")

        }
        finally{
          setIsCheckingUsername(false);
        }
      }

    }

    checkUsernameUniqueness();

  },[debouncedUsername])


  const onSubmit = async (data : z.infer<typeof signUpSchema>){ 
      setIsSubmitting(true);
      try {

        const response = axios.post("api/sign-up",data)
        
      } catch (error) {
        
      }
  }




  return <>
  
  </>
}