import { useRef, useState } from "react";
import { getAuth } from "firebase/auth";
import { addDoc, collection, limit, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { app, databaseApp } from "./services/firebaseConfig";
import "./main.css";

const auth = getAuth(app);

export const App = () => {
  const [user] = useAuthState(auth);

  return (
    <div className='App'>
      <header>
        <div className="header-left">
          <h1>Chat</h1>
          <img src="/bater-papo.png" alt="" />
        </div>
        <SignOut />
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
};

export const ChatRoom = () => {
  const [formValue, setFormValue] = useState("");
  const dummy = useRef()
  const messagesRef = collection(databaseApp, "messages");
  const q = query(messagesRef, orderBy("createdAt"), limit(25));
  const [messages] = useCollectionData(q, { idField: "id" });

  const sendMessage = async (e) => {
    e.preventDefault();
    const { photoURL, uid } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      uid,
      photoURL,
      createdAt: serverTimestamp()
    });
    setFormValue('')
    dummy.current.scrollIntoView({ behavior: 'smooth' })
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit" disabled={!formValue}>
          <svg viewBox="0 0 24 24" width="30" height="30">
            <path fill="currentColor" d="M1.101 21.757 23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
          </svg>
        </button>
      </form>
    </>
  );
};

export const ChatMessage = (props) => {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt={`Usuário${uid}`}/>
      <p>{text}</p>
    </div>
  );
};

export const SignIn = () => {
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  return <button className="sign-in" onClick={() => signInWithGoogle()}>Logar com o Google <img src="/google.png" alt="Google" /></button>;
};

export const SignOut = () => {
  return (
    auth.currentUser && <button className="sign-out" onClick={() => auth.signOut()}>Sair</button>
  );
};
