const mount = document.querySelector<HTMLDivElement>('#app');

if (!mount) {
  throw new Error('Missing app mount node.');
}

mount.innerHTML = `
  <h1>Modernization Runtime Ready</h1>
  <p>
    TypeScript app scaffold is active. Next step is wiring the Rust/WASM domain engine and parity-tested UI modules.
  </p>
  <p style="margin-top:12px">
    Current migration contract: <code>no functionality or knowledge loss</code>.
  </p>
`;
