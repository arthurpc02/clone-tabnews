import Script from "next/script";

function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100dvw",
        height: "100dvh",
        overflowX: "hidden",
      }}
    >
      <h1>*Me, creating this webpage*</h1>
      <Script
        src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs"
        type="module"
      ></Script>

      <dotlottie-player
        src="https://lottie.host/026e2865-4ae8-441b-919a-b4147e9f7896/sV9R0R69qk.json"
        background="transparent"
        speed="1"
        style={{ width: "300px", height: "300px" }}
        loop
        autoplay
      ></dotlottie-player>
      <h3>
        Meanwhile, please visit my{" "}
        <a href="https://efficacious-archduke-256.notion.site/Tutunauta-com-br-185623b21d73421a94a4bee34f790149">
          Notion page
        </a>{" "}
        or my <a href="https://www.linkedin.com/in/arthurpc02/">LinkedIn</a>.
      </h3>
      <h3></h3>
    </main>
  );
}

export default Home;
