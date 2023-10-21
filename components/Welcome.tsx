'use client'

import { useEffect } from "react"

export default function Welcome({ch}: {ch: any}){
    useEffect(()=>{
        localStorage.getItem("name") ? ch(true) : null

        window.addEventListener("keypress", (e) => {
            let x = document.getElementById("name") as any
            if(e.key == "Enter" && x && x.value != ""){
                localStorage.setItem("name", x.value)
                e.currentTarget?.removeEventListener("keypress", ()=>{})
                ch(true)
            }
        })
    }, [])
    return <div className="absolute z-10 bg-[#CCCCFF] top-0 left-0 w-full h-screen flex flex-col gap-14 place-items-center justify-center">
    <h1 className="font-bold text-3xl text-center">Enter nickname to begin typing!</h1>
    <input id="name" autoSave="false"  aria-autocomplete="none" autoComplete="false" type="text" autoFocus className="outline-none stroke-none appearance-none rounded-full min-w-[300px] w-[500px] max-w-[90%] py-2 text-center text-xl"/>
    <p className="faint">(click enter)</p>
</div>
}