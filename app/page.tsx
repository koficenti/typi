'use client'
import { useState, useEffect} from "react"

import Home from "@/components/Home"
import Welcome from "@/components/Welcome"

export default function Index() {
  const [check, setCheck] = useState(false)
  useEffect(()=>{
    localStorage.getItem("name") ? setCheck(true) : null
  }, [check])
  return check ? <Home/>: <Welcome ch={(v: boolean) => setCheck(v)}/>
}
