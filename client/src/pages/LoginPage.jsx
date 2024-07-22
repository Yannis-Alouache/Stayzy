import {Link, Navigate} from "react-router-dom";
import {useContext, useState} from "react";
import axios from "axios";
import {UserContext} from "../context/UserContext.jsx";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  const {setUser} = useContext(UserContext);

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const {data} = await axios.post('/auth/login', {email,password});
      setUser(data);
      setRedirect(true);
    } catch (e) {
      toast.error(e.response.data);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Connexion</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input type="email"
                 placeholder="mon@email.com"
                 value={email}
                 onChange={ev => setEmail(ev.target.value)} />
          <input type="password"
                 placeholder="mot de passe"
                 value={password}
                 onChange={ev => setPassword(ev.target.value)} />
          <button className="primary">Suivant</button>
          <div className="text-center py-2 text-gray-500">
            Pas encore de compte ? <Link className="underline text-black" to={'/register'}>Je m'inscris</Link>
          </div>
        </form>
      </div>
    </div>
  );
}