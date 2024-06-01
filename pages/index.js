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
      <h1>*Me creating the webpage*</h1>
      <script
        src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs"
        type="module"
      ></script>

      <dotlottie-player
        src="https://lottie.host/026e2865-4ae8-441b-919a-b4147e9f7896/sV9R0R69qk.json"
        background="transparent"
        speed="1"
        style={{ width: "300px", height: "300px" }}
        loop
        autoplay
      ></dotlottie-player>
    </main>
  );
}

export default Home;
