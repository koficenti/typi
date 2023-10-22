'use client'
import { useState, useEffect, useRef, ChangeEvent } from "react"
import Completed from "./Completed"
import { generateWords } from "@/words"

export default function Home(){
    const inputRef = useRef<null | HTMLInputElement>(null)
    const [words, setWords] = useState<string[]>([])
    const [lastCount, setLastCount] = useState(0)
    const [count, setCount] = useState(0)
    const [best, setBest] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [pressedSpace, setPressedSpace] = useState(false)

    const [modal, isModalOpen] = useState(false)

    const [seconds, setSeconds] = useState(0);

    useEffect(()=>{
        (localStorage.getItem("best") != null) ? setBest(parseInt(localStorage.getItem("best") as any)) : setBest(0)

        // document.getElementById("typedword")?.addEventListener("keypress", (e: any) => {
        //     if(e.key == " "){
        //         setPressedSpace(true)
        //     }
        // })
        setTimeout(()=>{
            if(inputRef.current){
                inputRef.current.focus()
            }
        }, 500)

    }, [])

    useEffect(() => {

        let interval: any;
        if(playing){
            interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1);
                if(seconds === 59){ // time
                    setPlaying(false)
                    isModalOpen(true)
                    setSeconds(0)
                }
            }, 1000);
        } else{
            const tw = document.getElementById("typedword") as any
            if(tw){
                tw.value = ""
                tw.style.top = ""
                tw.style.left = ""
            }
            let words = document.querySelectorAll(`div[data-index]`)
            words && words.forEach((e: any) => {
                e.style = ""
            })
            if(localStorage.getItem("total_words") != null){
                localStorage.setItem('total_words', "0");
            }else{
                localStorage.setItem("total_words", "" + (parseInt(localStorage.getItem("total_words") as any) + count))
            }

            if(localStorage.getItem("best") != null){
                let best = parseInt(localStorage.getItem("best") as any)
                if(best < count){
                    localStorage.setItem('best', String(count));
                    setBest(count)
                }
            }else{
                localStorage.setItem('best', String(count));
                setBest(count)
            }

            setLastCount(count)
            setCount(0)
            setSeconds(0)
            setWords(generateWords(500))
            clearInterval(interval)
        }
        return () => clearInterval(interval);
    }, [playing, seconds]);

    const inputChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const currentword = document.querySelector(`div[data-index='${count}']`) as any
        const tw = document.getElementById("typedword") as any
        tw.focus()
        if(!playing && !modal){
            setPlaying(true)
        }

        // while(!words[count].startsWith(e.target.value) && e.target.value.length > 0){
        //     e.target.value = e.target.value.slice(0, -1)
        // }

        if(!words[count].startsWith(e.target.value)){
            tw.style.color = "red"
            currentword.style.color = "red"
        }else{
            tw.style.color = ""
            currentword.style.color = ""
        }

        if(e.target.value.endsWith(" ") && e.target.value.slice(0, -1) === words[count]){
            setCount(last => last + 1)
            e.target.value = ""
            tw.style.color = ""
            currentword.style.color = ""

            currentword.style.color = "black"
            currentword.style.animation = "shake"
            currentword.style.animationDuration = "500ms"
            currentword.style.transition = "color 700ms"

            let nextword = document.querySelector(`div[data-index='${count+1}']`) as any
            if(nextword){
                e.target.style.top = String(nextword.offsetTop + "px")
                e.target.style.left = String(nextword.offsetLeft + "px")
                e.target.parentElement?.scrollTo({top: nextword.offsetTop, behavior: "smooth"})
            }
        }
        // setPressedSpace(false)
    }

    const inputFocused = (e: any) => {

        const currentword = document.querySelector(`div[data-index='${count}']`) as any
        if(currentword && e.target){
            e.target.style.top = String(currentword.offsetTop + "px")
            e.target.style.left = String(currentword.offsetLeft + "px")
        }
    }

    return <div className="px-10 md:px-32 pt-5">
    {modal ? <Completed call={isModalOpen} count={lastCount}/> : <></>}
    <div className="text-xl faint py-16 leading-10">
        <p>last score: {lastCount} wpm</p>
        <p>best score: {best} wpm</p>
    </div>
    <h1 className="text-3xl font-black text-center md:text-left">Welcome {localStorage.getItem("name")}!</h1>
    <p className="text-xl pt-5 text-center md:text-left">You typed {localStorage.getItem("total_words") ? "0" : localStorage.getItem("total_words")} words total today!</p>
    {/* <p className="text-xl font-black mt-5">You typed <span className="text-xl">1232</span> words total today!</p> */}
    <div className="faint font-black text-xl py-20 opacity-80 leading-[3rem] select-none">
        <p className="h-[270px] overflow-hidden flex flex-wrap gap-5 relative justify-center md:justify-normal" id="words_to_type" onClick={() => inputRef.current && inputRef.current.focus()}>
            {words.map((word, index) => <div data-index={index} className="inline-block">{word}</div>)}
            <input autoCapitalize="none" name="very_unique_name" aria-autocomplete="none" autoComplete="false" id="typedword" ref={inputRef} onFocus={e => inputFocused(e)} onChange={e => inputChanged(e)} type="text" className="bg-transparent absolute font-black text-xl"/>
        </p>
    </div>
    <div className="m-auto flex justify-between w-full md:w-[80%] place-items-center">
        <div id="timer" className="text-lg font-black faint">Time: {seconds} seconds</div>
        <div id="reload" onClick={() => setPlaying(false)} className="cursor-pointer opacity-75 stroke-[#60607C] hover:stroke-black transition-colors duration-200">
            <svg width="41" height="46" viewBox="0 0 41 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.6662 14.6667H38.3328V3M37.6545 34.1661C35.4801 37.5142 32.2897 40.0771 28.5517 41.4783C24.8137 42.8797 20.7246 43.0456 16.8851 41.952C13.0457 40.8583 9.65876 38.563 7.22022 35.4023C4.78168 32.2416 3.42102 28.382 3.33741 24.3908C3.25381 20.3994 4.45104 16.4867 6.75509 13.2266C9.05912 9.96642 12.3478 7.53133 16.138 6.27784C19.9282 5.02433 24.0209 5.01831 27.8144 6.26188C31.6079 7.50546 34.9028 9.93222 37.2154 13.1863" stroke-width="5.33333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    </div>
</div>
}