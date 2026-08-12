import MainPage from "../components/MainPage";
import Categories from "../components/Categories";
import Shop from "../components/Shop";
import OurStory from "../components/OurStory";
import WhatsAppCTA from "../components/WhatsappCTA";

function Home() {
  return (
    <>
      <MainPage />
      <Categories />
      <Shop />
      <OurStory />
      <WhatsAppCTA />
    </>
  );
}

export default Home;