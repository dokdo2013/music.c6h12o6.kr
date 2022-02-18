import { ChakraProvider } from "@chakra-ui/react"
import { Routes, Route } from 'react-router-dom';
import Main from './Main'
import Login from './Login'

function App() {
  const setVh = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`)
  };
  window.addEventListener('resize', setVh);
  setVh();

  return (
    <>
    <Routes>
      <Route path="/" exact={true} element={
        <ChakraProvider>
          <Main />
        </ChakraProvider>
      } />

      <Route path="/login" exact={true} element={
        <ChakraProvider>
          <Login />
        </ChakraProvider>
      } />
    </Routes>
    </>
  );
}

export default App;
