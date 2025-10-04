"use client";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function StarsBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
        <Particles id="tsparticles" init={particlesInit} options={{
            background:{color:{value:"transparent"}},
            fpsLimit:120,
            interactivity: {
                events:{onHover: {enable:true,mode:"attract"},onClick: {enable:true,mode:"repulse"}},
                modes:{
                    attract:{distance:300,speed:1,factor:5},
                    repulse:{distance:300,duration:1,factor:15,speed:2},
                    grab:{distance:150,links:{blink:false,consent:false,opacity:1}},},
            },
            particles: {
                color:{value:"#0a9396"},
                move:{enable:true,speed:1},
                number:{value:500},
                opacity:{value:0.3},
                shape:{type:"circle"},
                size:{value:{min:0.01,max:10}},
                stroke:{width:2,color:"#94d2bd"},
                rotate:{value:30,animation:{enable:true,speed:5,sync:false}}
            },
            detectRetina: true,
            }}
        />
    </div>
  );
}