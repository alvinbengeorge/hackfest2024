"use client";
import Navbar from "../components/navbar";
import { Playfair_Display } from "next/font/google";
import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const API_URL = "https://shiny-funicular-7wwg56x5v6wfr5vj-8000.app.github.dev/"

const font = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  // change every 3 seconds and append a random value to x, y, z to gyro
  const [gyro, setGyro] = useState([{ x: 0, y: 0, z: 0, name: new Date().toLocaleTimeString() }]);
  const [acc, setAcc] = useState([{ x: 0, y: 0, z: 0, name: new Date().toLocaleTimeString() }]);


  useEffect(() => {
    const interval = setInterval(() => {
      setGyro((prev) => {
        console.log(new Date().toLocaleTimeString())
        const x = Math.random() * 10;
        const y = Math.random() * 10;
        const z = Math.random() * 10;
        return [...prev, { x, y, z, name: new Date().toLocaleTimeString()}];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <Navbar />
      <section className="h-screen grid place-items-center ">
        <div className={font.className}>
          <h1 className="text-6xl font-bold">
            <span className="text-8xl text-red-400">M</span>edi
            <span className="text-red-400 text-8xl">C</span>o.
          </h1>
          <p className="p-2 text-center">Enabling assistance to <span className="text-red-300">you</span></p>
        </div>
      </section>
      <section className="h-screen bg-[#111111] p-8">
        <div className="grid grid-cols-2 w-full h-full gap-2 p-2">
          <div className="w-full h-full bg-red-900 rounded-2xl grid place-items-center">
            <div className="bg-red-100 p-4 rounded-2xl">
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
          <div className="w-full h-full rounded-2xl grid grid-cols-1 grid-rows-2 gap-2">
            <div className="bg-red-900 rounded-2xl grid place-items-center gap-2 grid-cols-2 text-center p-2 text-black">
              <div className=" p-4 text-xl  bg-red-200 grid place-items-center rounded-2xl w-full h-full hover:shadow-lg hover:shadow-red-300 transition duration-500">
                <div>
                  <div className="font-bold">No. of Falls</div>
                  <div>32</div>
                </div>
              </div>
              <div className=" p-4 text-xl  bg-red-200 grid place-items-center rounded-2xl w-full hover:shadow-lg hover:shadow-red-300 transition duration-500 h-full">
                <div>
                  <div className="font-bold">Steps</div>
                  <div>32</div>
                </div>
              </div>
              <div className=" p-4 text-xl  bg-red-200 grid place-items-center rounded-2xl w-full hover:shadow-lg hover:shadow-red-300 transition duration-500 h-full">
                <div>
                  <div className="font-bold">Distance Covered</div>
                  <div>32</div>
                </div>
              </div>
              <div className=" p-4 text-xl  bg-red-200 grid place-items-center rounded-2xl w-full hover:shadow-lg hover:shadow-red-300 transition duration-500 h-full">
                <div>
                  <div className="font-bold">Heading</div>
                  <div>32</div>
                </div>
              </div>
            </div>
            <div className="bg-red-900 rounded-2xl grid place-items-center gap-2 grid-cols-3 text-center p-2 text-black">
              <div className=" p-4 text-xl  bg-red-200 grid place-items-center rounded-2xl w-full h-full hover:shadow-lg hover:shadow-red-300 transition duration-500">
                <div>
                  <div className="font-bold">Acceleration X</div>
                  <div>32</div>
                </div>
              </div>
              <div className=" p-4 text-xl  bg-red-200 grid place-items-center rounded-2xl w-full h-full hover:shadow-lg hover:shadow-red-300 transition duration-500">
                <div>
                  <div className="font-bold">Acceleration Y</div>
                  <div>32</div>
                </div>
              </div>
              <div className=" p-4 text-xl  bg-red-200 grid place-items-center rounded-2xl w-full hover:shadow-lg hover:shadow-red-300 transition duration-500 h-full">
                <div>
                  <div className="font-bold">Acceleration Z</div>
                  <div>32</div>
                </div>
              </div>
              <div className=" p-4 text-xl  bg-red-200 grid place-items-center rounded-2xl w-full hover:shadow-lg hover:shadow-red-300 transition duration-500 h-full">
                <div>
                  <div className="font-bold">Gyro X</div>
                  <div>{gyro[gyro.length - 1].x.toPrecision(2)}</div>
                </div>
              </div>
              <div className=" p-4 text-xl  bg-red-200 grid place-items-center rounded-2xl w-full hover:shadow-lg hover:shadow-red-300 transition duration-500 h-full">
                <div>
                  <div className="font-bold">Gyro Y</div>
                  <div>{gyro[gyro.length - 1].y.toPrecision(2)}</div>
                </div>
              </div>
              <div className=" p-4 text-xl  bg-red-200 grid place-items-center rounded-2xl w-full hover:shadow-lg hover:shadow-red-300 transition duration-500 h-full">
                <div>
                  <div className="font-bold">Gyro Z</div>
                  <div>{gyro[gyro.length - 1].z.toPrecision(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
