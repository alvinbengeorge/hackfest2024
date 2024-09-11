"use client";
import Navbar from "../components/navbar";
import { Playfair_Display, Orbitron } from "next/font/google";
import { useEffect, useState, useRef } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { motion, useTransform, useScroll } from "framer-motion";
import MainScreen from "../components/main_screen";
import Prediction from "../components/prediction"
import Image from "next/image";

const API_URL = "https://fantastic-xylophone-vwwxr95q4p43wq5j-8000.app.github.dev/"



const font = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
});

const futuristic = Orbitron({
  subsets: ["latin"],
  weight: "400"
})

const patient_data = {
  name: "Alvin Ben George",
  age: 57,
  phoneno: 9940761235,
  cholestrol: 120,
  bp: 120,
}

export default function Home() {
  const [gyro, setGyro] = useState([{ x: 0, y: 0, z: 0, name: new Date().toLocaleTimeString() }]);
  const [acc, setAcc] = useState([{ x: 0, y: 0, z: 0, name: new Date().toLocaleTimeString() }]);
  const [falls, setFalls] = useState(0);
  const [steps, setStep] = useState(0)
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);


  useEffect(() => {
    const interval = setInterval(() => {
      fetch(API_URL + "data").then((res) => res.json()).then((data) => {
        const { gyroscope, accelerometer, sos, steps } = data;
        setGyro(gyroscope);
        setAcc(accelerometer);
        setFalls(sos);
        setStep(steps);
      })
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <Navbar />
      {/* <section className="h-screen grid place-items-center">
        <motion.div className={font.className} initial={{ opacity: 0, y: "20%" }} whileInView={{ opacity: 1, y: 0 }}>
          <h1 className="text-6xl font-bold z-10">
            <span className="text-8xl text-blue-400">M</span>edi
            <span className="text-blue-400 text-8xl">C</span>o.
          </h1>
          <p className="p-2 text-center">Enabling assistance to <span className="text-blue-300">you</span></p>
        </motion.div>
        <div className="absolute bg-[url('/background.jpg')] bg-cover inset-0 z-0"></div>
        <div></div>
      </section> */}
      <section className="h-screen grid place-items-center bg-[url('/background.jpg')] bg-cover" ref={ref}>
        <MainScreen />
        {/* <div className=""><Image src="/watch.png" width={300} height={300} alt=" " /></div> */}
      </section>
      <section className={" bg-[#111111] p-8"}>
        <div className="pe-2 ps-2"><h1 className={futuristic.className + " text-6xl  p-4 text-center bg-blue-900 rounded-2xl"}>Report</h1></div>
        <motion.div className="grid grid-cols-1 w-full h-full gap-2 p-2 sm:grid-cols-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          <div className="w-full h-full bg-blue-900 rounded-2xl grid place-items-center grid-cols-1">
            <div className="grid grid-cols-2 place-items-center w-full p-2 gap-2">
              <div className="text-center text-4xl text-black bg-blue-200 rounded-2xl w-full h-full grid place-items-center p-2"><h1>{patient_data.name}</h1></div>
              <div className="text-left text-black bg-blue-200 rounded-2xl w-full text-2xl p-6 h-full">
                <p>
                  <span className="font-bold">Age:</span> {patient_data.age}<br></br>
                  <span className="font-bold">Phone Number:</span> {patient_data.phoneno}<br></br>
                  <span className="font-bold">Cholestrol:</span> {patient_data.cholestrol}<br></br>
                  <span className="font-bold">Blood Pressure:</span> {patient_data.bp}<br></br>
                </p>
              </div>
            </div>
            <div className="w-full h-full grid grid-cols-1 p-2 gap-2">
              <div className="bg-blue-200 p-4 rounded-2xl grid place-items-center">
                <div>
                  <h1 className={font.className + " text-center text-4xl text-black"}>Gyroscope</h1>
                  <LineChart width={600} height={300} data={gyro.slice(gyro.length > 10 ? gyro.length - 10 : 0, gyro.length - 1)}>
                    <CartesianGrid stroke="#000" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="x" stroke="#8884d8" strokeWidth={4} />
                    <Line type="monotone" dataKey="y" stroke="#82ca9d" strokeWidth={4} />
                    <Line type="monotone" dataKey="z" stroke="#ff0000" strokeWidth={4} />
                  </LineChart>
                </div>
              </div>
              <div className="bg-blue-200 p-4 rounded-2xl grid place-items-center">
                <div>
                  <h1 className={font.className + " text-center text-4xl text-black"}>Accelerometer</h1>
                  <LineChart width={600} height={300} data={acc.slice(acc.length > 10 ? acc.length - 10 : 0, acc.length - 1)} title="Accelerometer">
                    <CartesianGrid stroke="#000" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="x" stroke="#8884d8" strokeWidth={4} />
                    <Line type="monotone" dataKey="y" stroke="#82ca9d" strokeWidth={4} />
                    <Line type="monotone" dataKey="z" stroke="#ff0000" strokeWidth={4} />
                  </LineChart>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-full rounded-2xl grid grid-cols-1 grid-rows-2 gap-2">
            <div className="bg-blue-900 rounded-2xl grid place-items-center gap-2 grid-cols-2 text-center p-2 text-black">
              <div className=" p-4 text-xl  bg-blue-200 grid place-items-center rounded-2xl w-full h-full hover:shadow-lg hover:shadow-blue-300 transition duration-500">
                <div>
                  <div className="font-bold">No. of Falls</div>
                  <div className={futuristic.className + " text-6xl"}>{falls}</div>
                </div>
              </div>
              <div className=" p-4 text-xl  bg-blue-200 grid place-items-center rounded-2xl w-full hover:shadow-lg hover:shadow-blue-300 transition duration-500 h-full">
                <div>
                  <div className="font-bold">Steps</div>
                  <div className={futuristic.className + " text-6xl"}>{steps}</div>
                </div>
              </div>
              <div className=" p-4 text-xl  bg-blue-200 grid place-items-center rounded-2xl w-full hover:shadow-lg hover:shadow-blue-300 transition duration-500 h-full col-span-2">
                <div>
                  <div className="font-bold">Distance Covered</div>
                  <div className={futuristic.className + " text-6xl"}>{(steps*0.74).toPrecision(2)}m</div>
                </div>
              </div>
              {/* <div className=" p-4 text-xl  bg-blue-200 grid place-items-center rounded-2xl w-full hover:shadow-lg hover:shadow-blue-300 transition duration-500 h-full">
                <div>
                  <div className="font-bold">Heading</div>
                  <div>32</div>
                </div>
              </div> */}
            </div>
            <div className="bg-blue-900 rounded-2xl grid place-items-center gap-2 grid-cols-1 text-center p-2 text-black sm:grid-cols-3">
              <div className=" p-4 text-xl  bg-blue-200 grid place-items-center rounded-2xl w-full h-full hover:shadow-lg hover:shadow-blue-300 transition duration-500">
                <div>
                  <div className="font-bold">Acceleration X</div>
                  <div className={futuristic.className + " text-6xl"}>{acc[acc.length - 1].x.toPrecision(2)}</div>
                </div>
              </div>
              <div className=" p-4 text-xl  bg-blue-200 grid place-items-center rounded-2xl w-full h-full hover:shadow-lg hover:shadow-blue-300 transition duration-500">
                <div>
                  <div className="font-bold">Acceleration Y</div>
                  <div className={futuristic.className + " text-6xl"}>{acc[acc.length - 1].y.toPrecision(2)}</div>
                </div>
              </div>
              <div className=" p-4 text-xl  bg-blue-200 grid place-items-center rounded-2xl w-full hover:shadow-lg hover:shadow-blue-300 transition duration-500 h-full">
                <div>
                  <div className="font-bold">Acceleration Z</div>
                  <div className={futuristic.className + " text-6xl"}>{acc[acc.length - 1].z.toPrecision(2)}</div>
                </div>
              </div>
              <div className=" p-4 text-xl  bg-blue-200 grid place-items-center rounded-2xl w-full hover:shadow-lg hover:shadow-blue-300 transition duration-500 h-full">
                <div>
                  <div className="font-bold">Gyro X</div>
                  <div className={futuristic.className + " text-6xl"}>{gyro[gyro.length - 1].x.toPrecision(2)}</div>
                </div>
              </div>
              <div className=" p-4 text-xl  bg-blue-200 grid place-items-center rounded-2xl w-full hover:shadow-lg hover:shadow-blue-300 transition duration-500 h-full">
                <div>
                  <div className="font-bold">Gyro Y</div>
                  <div className={futuristic.className + " text-6xl"}>{gyro[gyro.length - 1].y.toPrecision(2)}</div>
                </div>
              </div>
              <div className=" p-4 text-xl  bg-blue-200 grid place-items-center rounded-2xl w-full hover:shadow-lg hover:shadow-blue-300 transition duration-500 h-full">
                <div>
                  <div className="font-bold">Gyro Z</div>
                  <div className={futuristic.className + " text-6xl"}>{gyro[gyro.length - 1].z.toPrecision(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      <section className="p-8">
        <Prediction API_URL={API_URL} font={font.className} />
      </section>
    </main>
  );
}
