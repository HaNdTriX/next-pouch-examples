import { useFind, usePouch } from "use-pouchdb";

export default function IndexPage() {
  const { post } = (global.db = usePouch());

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    post(Object.fromEntries(data));
    event.target.reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input name="label" type="text" />
        <button>Add</button>
      </form>

      <Todos />
    </>
  );
}

function Todos() {
  const { put, remove } = usePouch();
  const { docs, loading: isValidating, error } = useFind({
    index: {
      fields: ["label"],
    },
    selector: {
      label: { $gte: null },
    },
  });

  const loading = isValidating && !docs;

  if (error) {
    console.log(error);
    return `Some error occured (${error?.message})`;
  }

  if (loading) {
    return "Loading Todos";
  }

  return (
    <ul>
      {docs.map((doc) => (
        <li key={doc._id}>
          <button onClick={() => put({ ...doc, checked: !doc.checked })}>
            Toggle
          </button>
          <button onClick={() => remove(doc)}>Remove</button>{" "}
          {doc.checked ? <strike>{doc.label}</strike> : doc.label}
        </li>
      ))}
    </ul>
  );
}
