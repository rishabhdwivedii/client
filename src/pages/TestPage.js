// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// //
// // UNIQUE DEVICE ID (stored permanently in browser)
// //
// function getDeviceId() {
//   let id = localStorage.getItem("deviceId");
//   if (!id) {
//     id = crypto.randomUUID();
//     localStorage.setItem("deviceId", id);
//   }
//   return id;
// }

// export default function TestPage() {
//   const { testId } = useParams();
//   const deviceId = getDeviceId();

//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [score, setScore] = useState(null);
//   const [email, setEmail] = useState("");

//   const [alreadySubmitted, setAlreadySubmitted] = useState(false);
//   const [needsConfirm, setNeedsConfirm] = useState(false);
//   const [sessionLost, setSessionLost] = useState(false);

//   //
//   // INITIAL LOAD
//   //
//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/test/${testId}`, {
//         headers: { "X-Device-Id": deviceId }
//       })
//       .then(res => {
//         if (res.data.alreadySubmitted) {
//           setAlreadySubmitted(true);
//           setEmail(res.data.email);
//           return;
//         }

//         if (res.data.needsConfirmation) {
//           setNeedsConfirm(true);
//           setEmail(res.data.email);
//           return;
//         }

//         setQuestions(res.data.questions || []);
//         setEmail(res.data.email);
//       });
//   }, [testId, deviceId]);

//   //
//   // POLLING: CHECK IF SESSION STOLEN
//   //
//   useEffect(() => {
//     if (needsConfirm || alreadySubmitted || score !== null) return;

//     const interval = setInterval(() => {
//       axios
//         .get(`http://localhost:5000/test/${testId}/status`, {
//           headers: { "X-Device-Id": deviceId }
//         })
//         .then(res => {
//           if (res.data.sessionLost) {
//             setSessionLost(true);
//           }
//         })
//         .catch(() => {});
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [testId, needsConfirm, alreadySubmitted, score, deviceId]);

//   //
//   // CONFIRM TAKEOVER
  
//   const forceActivate = async () => {
//     const res = await axios.post(
//       `http://localhost:5000/test/${testId}/force-activate`,
//       {},
//       { headers: { "X-Device-Id": deviceId } }
//     );

//     if (res.data.alreadySubmitted) {
//       setAlreadySubmitted(true);
//       return;
//     }

//     setNeedsConfirm(false);
//     setSessionLost(false);
//     setQuestions(res.data.questions || []);
//     setEmail(res.data.email);
//   };

//   //
//   // SUBMIT TEST
//   //
//   const submit = async () => {
//     const formatted = Object.keys(answers).map(id => ({
//       id: Number(id),
//       answer: answers[id]
//     }));

//     const res = await axios.post(
//       `http://localhost:5000/test/submit/${testId}`,
//       { answers: formatted },
//       { headers: { "X-Device-Id": deviceId } }
//     );

//     setScore(res.data.score);
//   };

//   //
//   // LOCK SCREEN — SESSION LOST
//   //
//   if (sessionLost) {
//     return (
//       <div style={{ padding: 40, textAlign: "center" }}>
//         <h2>Your test session has moved to another device.</h2>
//         <p>This tab is now locked.</p>
//       </div>
//     );
//   }

//   //
//   // CONFIRMATION SCREEN
//   //
//   if (needsConfirm) {
//     return (
//       <div style={{ padding: 40, textAlign: "center" }}>
//         <h2>This test is already open on another device.</h2>
//         <p>Do you want to continue here?</p>

//         <button
//           onClick={forceActivate}
//           style={{
//             padding: "12px 20px",
//             background: "black",
//             color: "white",
//             borderRadius: "8px",
//             cursor: "pointer",
//             marginTop: "20px"
//           }}
//         >
//           Yes, Continue Here
//         </button>
//       </div>
//     );
//   }

//   //
//   // MAIN TEST UI
//   //
//   return (
//     <div style={{ padding: 30, fontFamily: "Arial", maxWidth: 800, margin: "auto" }}>
//       <div style={{ textAlign: "center", marginBottom: 30 }}>
//         <h1>Your Test</h1>
//         {email && <p>Email: {email}</p>}
//       </div>

//       {alreadySubmitted && score === null && (
//         <div style={{ textAlign: "center", padding: 40 }}>
//           <h2>You already submitted this test.</h2>
//         </div>
//       )}

//       {!alreadySubmitted && score !== null && (
//         <div style={{ textAlign: "center", padding: 40 }}>
//           <h2>Your Score</h2>
//           <div style={{ fontSize: 40, fontWeight: "bold" }}>{score}</div>
//         </div>
//       )}

//       {!alreadySubmitted && score === null && (
//         <>
//           {questions.map(q => (
//             <div
//               key={q.id}
//               style={{
//                 padding: 20,
//                 marginBottom: 20,
//                 background: "#fff",
//                 borderRadius: 10
//               }}
//             >
//               <b>{q.description}</b>

//               {Object.entries(q.options).map(([key, value]) => (
//                 <label key={key} style={{ display: "block", marginTop: 10 }}>
//                   <input
//                     type="radio"
//                     name={`q-${q.id}`}
//                     value={key}
//                     onChange={() =>
//                       setAnswers({ ...answers, [q.id]: key })
//                     }
//                   />
//                   {key}. {value}
//                 </label>
//               ))}
//             </div>
//           ))}

//           <button
//             onClick={submit}
//             style={{
//               padding: "12px 25px",
//               background: "black",
//               color: "white",
//               borderRadius: 8,
//               cursor: "pointer",
//               margin: "20px auto",
//               display: "block"
//             }}
//           >
//             Submit Test
//           </button>
//         </>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

//
// UNIQUE DEVICE ID (stored permanently in browser)
//
function getDeviceId() {
  let id = localStorage.getItem("deviceId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("deviceId", id);
  }
  return id;
}

export default function TestPage() {
  const { testId } = useParams();
  const deviceId = getDeviceId();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [email, setEmail] = useState("");

  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [sessionLost, setSessionLost] = useState(false);

  //
  // INITIAL LOAD
  //
  useEffect(() => {
    axios
      .get(`http://localhost:5000/test/${testId}`, {
        headers: { "X-Device-Id": deviceId }
      })
      .then(res => {
        if (res.data.alreadySubmitted) {
          setAlreadySubmitted(true);
          setEmail(res.data.email);
          return;
        }

        if (res.data.needsConfirmation) {
          setNeedsConfirm(true);
          setEmail(res.data.email);
          return;
        }

        setQuestions(res.data.questions || []);
        setEmail(res.data.email);
      })
      .catch(err => console.error(err));
  }, [testId, deviceId]);

  //
  // POLLING: CHECK IF SESSION STOLEN
  //
  useEffect(() => {
    if (needsConfirm || alreadySubmitted || score !== null) return;

    const interval = setInterval(() => {
      axios
        .get(`http://localhost:5000/test/${testId}/status`, {
          headers: { "X-Device-Id": deviceId }
        })
        .then(res => {
          if (res.data.sessionLost) {
            setSessionLost(true);
          }
        })
        .catch(() => {});
    }, 3000);

    return () => clearInterval(interval);
  }, [testId, needsConfirm, alreadySubmitted, score, deviceId]);

  //
  // CONFIRM TAKEOVER
  //
  const forceActivate = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/test/${testId}/force-activate`,
        {},
        { headers: { "X-Device-Id": deviceId } }
      );

      if (res.data.alreadySubmitted) {
        setAlreadySubmitted(true);
        return;
      }

      setNeedsConfirm(false);
      setSessionLost(false);
      setQuestions(res.data.questions || []);
      setEmail(res.data.email);
    } catch (err) {
      console.error(err);
    }
  };

  //
  // SUBMIT TEST
  //
  const submit = async () => {
    const formatted = Object.keys(answers).map(id => ({
      id: Number(id),
      answer: answers[id]
    }));

    try {
      const res = await axios.post(
        `http://localhost:5000/test/submit/${testId}`,
        { answers: formatted },
        { headers: { "X-Device-Id": deviceId } }
      );

      setScore(res.data.score);
    } catch (err) {
      if (err.response?.status === 400) {
        setAlreadySubmitted(true);
        return;
      }
      if (err.response?.status === 403) {
        setSessionLost(true);
        return;
      }
      console.error(err);
    }
  };

  //
  // LOCK SCREEN — SESSION LOST
  //
  if (sessionLost) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Your test session has moved to another device.</h2>
        <p>This tab is now locked.</p>
      </div>
    );
  }

  //
  // CONFIRMATION SCREEN (OTHER TAB OR DEVICE)
  //
  if (needsConfirm) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>This test is already open on another device or tab.</h2>
        <p>Do you want to continue here?</p>

        <button
          onClick={forceActivate}
          style={{
            padding: "12px 20px",
            background: "black",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "20px"
          }}
        >
          Yes, Continue Here
        </button>
      </div>
    );
  }

  //
  // MAIN TEST UI
  //
  return (
    <div style={{ padding: 30, fontFamily: "Arial", maxWidth: 800, margin: "auto" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h1>Your Test</h1>
        {email && <p>Email: {email}</p>}
      </div>

      {alreadySubmitted && score === null && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <h2>You already submitted this test.</h2>
        </div>
      )}

      {!alreadySubmitted && score !== null && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <h2>Your Score</h2>
          <div style={{ fontSize: 40, fontWeight: "bold" }}>{score}</div>
        </div>
      )}

      {!alreadySubmitted && score === null && (
        <>
          {questions.map(q => (
            <div
              key={q.id}
              style={{
                padding: 20,
                marginBottom: 20,
                background: "#fff",
                borderRadius: 10
              }}
            >
              <b>{q.description}</b>

              {Object.entries(q.options).map(([key, value]) => (
                <label key={key} style={{ display: "block", marginTop: 10 }}>
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={key}
                    onChange={() =>
                      setAnswers({ ...answers, [q.id]: key })
                    }
                  />
                  {key}. {value}
                </label>
              ))}
            </div>
          ))}

          <button
            onClick={submit}
            style={{
              padding: "12px 25px",
              background: "black",
              color: "white",
              borderRadius: 8,
              cursor: "pointer",
              margin: "20px auto",
              display: "block"
            }}
          >
            Submit Test
          </button>
        </>
      )}
    </div>
  );
}
