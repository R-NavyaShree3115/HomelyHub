import  { useState  } from "react"

export default function StudentCard({name,course}) {
  const [likes,setLikes]=useState(0);
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Course:{course}</p>
      <h3>Likes:{likes}</h3>
      <button onClick={() =>setLikes(likes+1)}>Like</button>
    </div>
    
  );
}
