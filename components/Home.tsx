'use client'
import { useState, useEffect, useRef, ChangeEvent } from "react"
import Completed from "./Completed"

const batch = [`apple`, `banana`, `cherry`, `date`, `elderberry`, `fig`, `grape`, `honeydew`, `kiwi`, `lemon`, `mango`, `nectarine`, `orange`, `papaya`, `quince`, `raspberry`, `strawberry`, `tangerine`, `watermelon`, `apricot`, `blueberry`, `cranberry`, `dragonfruit`, `guava`, `kiwifruit`, `lime`, `pomegranate`, `starfruit`, `blackberry`, `cantaloupe`, `durian`, `grapefruit`, `lebkuchen`, `orange`, `peach`, `raspberry`, `tamarind`, `avocado`, `boysenberry`, `cherimoya`, `date`, `elderberry`, `huckleberry`, `loganberry`, `mango`, `persimmon`, `strawberry`, `tomato`, `bellpepper`, `chili`, `garlic`, `horseradish`, `mushroom`, `potato`, `sweetpotato`, `zucchini`, `artichoke`, `broccoli`, `cauliflower`, `ginger`, `kale`, `onion`, `pumpkin`, `turnip`, `asparagus`, `brusselsprout`, `celery`, `greens`, `lettuce`, `parsnip`, `radish`, `spinach`, `zucchini`, `basil`, `caraway`, `cinnamon`, `coriander`, `garlic`, `oregano`, `paprika`, `rosemary`, `thyme`, `cayenne`, `nutmeg`, `tarragon`, `wasabi`, `cumin`, `fennel`, `cardamom`, `chervil`, `cloves`, `dill`, `lavender`, `lemonbalm`, `mace`, `marjoram`, `sage`, `sumac`, `turmeric`, `thyme`, `anise`, `chives`, `dill`, `lemon`, `verbena`, `mint`, `penny`, `royal`, `purslane`, `sorrel`, `borage`, `chicory`, `endive`, `rocket`, `watercress`, `cabbage`, `collard`, `greens`, `kohlrabi`, `kale`, `cauliflower`, `peas`, `bean`, `lentil`, `soybean`, `carrot`, `celery`, `squash`, `courgette`, `eggplant`, `pumpkin`, `beetroot`, `turnip`, `artichoke`, `asparagus`, `parsnip`, `radish`, `horseradish`, `shallot`, `onion`, `leek`, `garlic`, `fennel`, `potato`, `sweetpotato`, `jicama`, `taro`, `yam`, `plantain`, `chayote`, `chili`, `cucumber`, `olive`, `tomato`, `pepper`, `zucchini`, `lettuce`, `cabbage`, `celery`, `cress`, `parsley`, `spinach`, `lemon`, `lime`, `grapefruit`, `orange`, `tangerine`, `banana`, `pineapple`, `grape`, `kiwi`, `papaya`, `watermelon`, `blueberry`, `blackberry`, `strawberry`, `raspberry`, `cherry`, `peach`, `apricot`, `plum`, `pear`, `fig`, `date`, `coconut`, `kiwifruit`, `mango`, `pomegranate`, `passionfruit`, `starfruit`, `dragonfruit`, `guava`, `lychee`, `mangosteen`, `jackfruit`, `durian`, `cranberry`, `gooseberry`, `currant`, `elderberry`, `huckleberry`, `loganberry`, `boysenberry`, `salmonberry`, `cloudberry`, `goji`, `acai`, `bilberry`, `mulberry`, `gooseberry`, `tamarind`, `olive`, `walnut`, `pecan`, `cashew`, `hazelnut`, `almond`, `peanut`, `macadamia`, `chestnut`, `pistachio`, `sunflowerseed`, `sesameseed`, `pumpkinseed`, `flaxseed`, `chia`, `quinoa`, `amaranth`, `barley`, `oats`, `rice`, `wheat`, `corn`, `rye`, `spelt`, `sorghum`, `millet`, `teff`, `buckwheat`, `sugarcane`, `sugarbeet`, `potato`, `sweetpotato`, `yam`, `taro`, `jicama`, `cassava`, `arrowroot`, `salsify`, `parsnip`, `radish`, `horseradish`, `shallot`, `onion`, `leek`, `garlic`, `fennel`, `celery`, `cabbage`, `lettuce`, `spinach`, `kale`, `broccoli`, `cauliflower`, `asparagus`, `artichoke`, `brusselsprout`, `peas`, `bean`, `lentil`, `soybean`, `carrot`, `zucchini`, `beetroot`, `cucumber`, `squash`, `eggplant`, `pepper`, `tomato`, `potato`, `sweetpotato`, `onion`, `garlic`]

const generateWords = (amount: number): string[] => {
    let text = []
    for(let i = 0; i <= amount; i++){
        text.push(batch[Math.floor(Math.random() * batch.length)])
    }
    return text
}

export default function Home(){
    const inputRef = useRef<null | HTMLInputElement>(null)
    const [words, setWords] = useState<string[]>([])
    const [lastCount, setLastCount] = useState(0)
    const [count, setCount] = useState(0)
    const [best, setBest] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [modal, isModalOpen] = useState(false)

    const [seconds, setSeconds] = useState(0);

    useEffect(()=>{
        (localStorage.getItem("best") != null) ? setBest(parseInt(localStorage.getItem("best") as any)) : setBest(0)
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
        if(!playing && !modal){
            setPlaying(true)
        }
        while(!words[count].startsWith(e.target.value) && e.target.value.length > 0){
            e.target.value = e.target.value.slice(0, -1)
        }
        if(e.target.value == words[count]){
            setCount(last => last + 1)
            e.target.value = ""

            let currentword = document.querySelector(`div[data-index='${count}']`) as any
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
    }

    return <div className="px-20 pt-5">
    {modal ? <Completed call={isModalOpen} count={lastCount}/> : <></>}
    <div className="text-xl faint py-16 leading-10">
        <p>last score: {lastCount} wpm</p>
        <p>best score: {best} wpm</p>
    </div>
    <h1 className="text-3xl font-black">Welcome {localStorage.getItem("name")}!</h1>
    {/* <p className="text-xl font-black mt-5">You typed <span className="text-xl">1232</span> words total today!</p> */}
    <div className="faint font-black text-xl py-20 opacity-80 leading-[3rem] select-none">
        <p className="h-[270px] overflow-hidden flex flex-wrap gap-5 relative" id="words_to_type" onClick={() => inputRef.current && inputRef.current.focus()}>
            <input  aria-autocomplete="none" autoComplete="false" id="typedword" ref={inputRef} autoFocus onChange={e => inputChanged(e)} type="text" className="bg-transparent absolute font-black text-xl"/>
            {words.map((word, index) => <div data-index={index} className="inline-block">{word}</div>)}
        </p>
    </div>
    <div className="m-auto flex justify-between w-[80%]">
        <div id="timer" className="text-lg font-black faint">Time: {seconds} seconds</div>
        <div id="reload" onClick={() => setPlaying(false)} className="cursor-pointer opacity-75 stroke-[#60607C] hover:stroke-black transition-colors duration-200">
            <svg width="41" height="46" viewBox="0 0 41 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.6662 14.6667H38.3328V3M37.6545 34.1661C35.4801 37.5142 32.2897 40.0771 28.5517 41.4783C24.8137 42.8797 20.7246 43.0456 16.8851 41.952C13.0457 40.8583 9.65876 38.563 7.22022 35.4023C4.78168 32.2416 3.42102 28.382 3.33741 24.3908C3.25381 20.3994 4.45104 16.4867 6.75509 13.2266C9.05912 9.96642 12.3478 7.53133 16.138 6.27784C19.9282 5.02433 24.0209 5.01831 27.8144 6.26188C31.6079 7.50546 34.9028 9.93222 37.2154 13.1863" stroke-width="5.33333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    </div>
</div>
}