import FormUsuario from "./FormUsuario"
import Mensaje from "./Mensaje"
import PersonaList from "./PersonaList"

function App() {

  return (
    <div>Hola react
      <Mensaje texto="Hola, soy el primer mensaje" />
      <Mensaje />
      <PersonaList />
      <FormUsuario />
    </div>
  )
}

export default App
