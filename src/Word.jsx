import React from "react";

export default function Word(props){
    const styles = 
    {
        color: props.guessed ? "gray":"black",
    }
    return (
    <div className = "word-comp" style ={styles}>
    <h1 >{props.word}</h1>
    </div>)
}