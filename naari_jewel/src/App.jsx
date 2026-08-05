import Navbar from "./components/navbar";
import MainPage from "./components/mainpage";
import Categories from "./components/Categories";
import Shop from "./components/Shop";
import WhatsAppCTA from "./components/WhatsappCTA";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <Navbar />
      <MainPage />
      <Categories />
      <Shop />
      <WhatsAppCTA />
      <Footer />
    </div>
  );
}

export default App;