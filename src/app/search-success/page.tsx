import styles from "./page.module.css";


export default function SearchSuggestPage() {
    return (
        <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#FBCEB1",
          color: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
        >
          <div className={styles.hero_text_container}>
            <p style={{ color: "black" }}>Searching for meds!</p>
            <p style={{ color: "#F94D00" }}>We'll text you soon</p>
          </div>
        </div>
    );

}