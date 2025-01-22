import MinMaxCropProduction from "../../components/MinMaxCropProduction/MinMaxCropProduction.tsx";
import AverageCropYields from "../../components/AverageCropYields/AverageCropYields.tsx";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <MinMaxCropProduction />
        <AverageCropYields />
      </div>
    </div>
  );
};

export default Home;
