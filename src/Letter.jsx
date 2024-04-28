import React from "react";

export default function Letter(props)
{   
    const styles = {
        color: props.guessed ? (props.word !== null ? "green" : "#1F1F1F") : (props.selected ? "green" : "#1F1F1F")
    };
    
    return(
        <>
        <td>
            <button className = "letter" style={styles} onClick={props.toggleSelected}>{props.value}</button>
            </td>
       </>
        

    )
}