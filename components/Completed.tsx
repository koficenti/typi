'use client'
import { useEffect, useState } from "react"
export default function Completed({count, call}: {count: number, call: any}){
    const [percentage, setPercentage] = useState(100)

    useEffect(()=>{
        fetch("/api/"+count).then(e => e.json()).then((e: any) => {
            if(e.average){
                const beat = e.average.filter((num: number) => count >= num).length
                setPercentage(Math.floor((beat/e.average.length) * 100))
            }
        })
    }, [])
    return <div className="absolute z-10 bg-[#CCCCFF] top-0 left-0 w-full h-screen flex flex-col gap-14 place-items-center justify-center">
        <h1 className="font-bold text-2xl">You typed {count}wpm and beat {percentage}% of other users. Congrats!</h1>
        <div id="reload" onClick={() => call(false)} className="cursor-pointer opacity-75 stroke-[#60607C] hover:stroke-black transition-colors duration-200">
            <svg width="41" height="46" viewBox="0 0 41 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.6662 14.6667H38.3328V3M37.6545 34.1661C35.4801 37.5142 32.2897 40.0771 28.5517 41.4783C24.8137 42.8797 20.7246 43.0456 16.8851 41.952C13.0457 40.8583 9.65876 38.563 7.22022 35.4023C4.78168 32.2416 3.42102 28.382 3.33741 24.3908C3.25381 20.3994 4.45104 16.4867 6.75509 13.2266C9.05912 9.96642 12.3478 7.53133 16.138 6.27784C19.9282 5.02433 24.0209 5.01831 27.8144 6.26188C31.6079 7.50546 34.9028 9.93222 37.2154 13.1863" stroke-width="5.33333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <p className="faint">(click enter)</p>
    </div>
}