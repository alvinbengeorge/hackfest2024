import React, { useState, useEffect } from "react";

export default function Prediction({ API_URL, font }: { API_URL: string, font: string }) {
    const [text, setText] = useState("");
    const [prediction, setPrediction] = useState("default");

    useEffect(() => { }, [prediction])

    const predict = () => {
        const body = { data: text.split(",").map(a => parseFloat(a.trim())) }
        console.log(body)
        fetch(API_URL + "predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((data) => {
                setPrediction(data.prediction ? "Parkinson detected": "No Parkinson detected");
            });
    }

    return (
        <div className={" bg-blue-900 w-full rounded-2xl p-2 text-black"}>
            
            <div className="p-8 grid gap-2">
                <h1 className={font + " text-6xl text-center bg-blue-100 p-8 rounded-2xl"}>Input value to predict</h1>
                <textarea className="bg-blue-200 p-4 text-black h-64 rounded-2xl" onChange={(e) => setText(e.target.value)}></textarea>
                <button type="submit" onClick={predict} className="bg-blue-100 text-xl p-8 rounded-2xl">Predict</button>
                <div className="w-full h-full text-2xl rounded-xl text-center bg-blue-200 p-4">
                    <p>{prediction}</p>
                </div>
            </div>
        </div>
    )
}