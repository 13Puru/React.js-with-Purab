import { useState } from "react"



function App() {
  const [color, setColor] = useState('olive')
  return (
    <div className="w-full h-screen duration-200" style={{backgroundColor: color}}>
      <div className="fixed flex flex-wrap justify-center bottom-12 inset-x-0 px-2">
        <div className="flex flex-wrap gap-2.5 justify-center shadow-lg bg-amber-50 px-3 py-2 rounded-3xl">
          <button onClick={()=> setColor('red')}
           className="px-5 py-2 rounded-3xl shadow-lg text-white" style={{backgroundColor: 'red'}}>Red</button>
          <button onClick={()=> setColor('blue')} 
          className="px-5 py-2 rounded-3xl shadow-lg text-white" style={{backgroundColor: 'blue'}}>Blue</button>
          <button onClick={()=> setColor('green')}
          className="px-5 py-2 rounded-3xl shadow-lg text-white" style={{backgroundColor: 'green'}}>Green</button>
          <button onClick={()=> setColor('orange')} 
          className="px-5 py-2 rounded-3xl shadow-lg text-white" style={{backgroundColor: 'orange'}}>orange</button>
        </div>
      </div>
    </div>
  )
}

export default App
