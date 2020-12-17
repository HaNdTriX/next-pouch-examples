import useOffline from "../hooks/useOffline";
import { usePost } from "../lib/pouch";

export default function IndexPage() {
  const offline = useOffline();

  const [post, { loading, error, result }] = usePost();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    post(Object.fromEntries(data));
    event.target.reset();
  };

  return (
    <>
      <h1>Multi Pouch POC</h1>
      <section>
        <h2>Offline State</h2>
        <div>You are {offline ? "offline" : "online"}</div>
      </section>

      <section>
        <h2>Input</h2>
        <form onSubmit={handleSubmit}>
          <input name="label" type="text" />
          <button disabled={loading}>Add</button>
        </form>
      </section>

      {error && (
        <section>
          <h2>Error</h2>
          <pre>{JSON.stringify(error)}</pre>
        </section>
      )}

      {result && (
        <section>
          <h2>Result</h2>
          <pre>{JSON.stringify(result)}</pre>
        </section>
      )}
    </>
  );
}
