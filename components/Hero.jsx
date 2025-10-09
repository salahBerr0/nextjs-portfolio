export default function Hero(){
    return(
        <main id="hero" className="h-screen w-full  grid content-between justify-items-center lg:content-center lg:w-max text-white font-bold pt-10 pb-10 px-5 lg:px-20 xl:px-48 my-3 z-0">
                <section className=" w-full grid justify-items-center content-center lg:justify-items-start">
                    <article>
                        <span className='text-[88px] lg:text-[100px] grid content-center  h-max justify-items-start w-full' style={{textShadow:'0 0 15px rgb(0,0,0)'}}>BERREDJEM <span className="-translate-y-12">SALAH</span></span>
                        <span className='text-[27px] lg:text-[30px] px-1 w-full -translate-y-[130px] lg:-translate-y-[140px] flex items-center justify-end' style={{textShadow:'0 0 10px rgb(255,255,255)'}}>-3D PORTFOLIO</span>
                    </article>
                </section>
                <section className="flex items-center h-max w-full justify-center gap-3 p-0">
                    <button className="bg-white text-[#0db988] py-1 px-10 rounded-2xl border-[1px] text-[20px] hover:px-16 duration-300 hover:bg-gray-400 hover:text-black transition-all hover:tracking-widest" style={{boxShadow:'0 0 10px #ffffff'}}>GET IN TOUCH</button>
                    <button className="text-[15px] underline hover:tracking-widest duration-300 hover:text-gray-400" style={{textShadow:'0 0 5px #000000'}}>download resume<i className="fas fa-download"></i></button>
                </section>

        </main>
    )
}