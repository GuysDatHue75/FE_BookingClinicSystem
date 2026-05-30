import { useContext, useEffect } from "react";
import Header from "../../../layouts/LayoutsUser/Header/Header";
import Main from "../../../layouts/LayoutsUser/Main/Main";
import "./Home.css";
import Introdution from "../../../components/IntrodutionComponent/Introdution";
import AIChatBox from "../../../ai/AIChatBox";
import { State } from "../../../state/context";
import Loading from "../../../components/LoadingComponent/Loading";

const Home = () => {
  const { loading } = useContext(State);
  useEffect(() => {
    window.scrollTo({ top: true, behavior: "instant" });
  }, []);
  return (
    <>
      <Header />
      <AIChatBox />
      <div className="container-home">
        {loading ? <Loading />
          :
          <>
            <Introdution />
            <Main />
          </>
        }
      </div>
    </>
  );
};

export default Home;
