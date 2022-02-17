import { ChakraProvider } from "@chakra-ui/react"
import Main from './Main'

function App() {
  const setVh = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`)
  };
  window.addEventListener('resize', setVh);
  setVh();

  return (
    <ChakraProvider>
      <Main />
    </ChakraProvider>
  );
}

export default App;
