import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getListById } from "../api/lists";
import Layout from "../components/Layout";
import type { List } from "../types/list";

export default function ListDetails() {
  const { id } = useParams();
  const [list, setList] = useState<List | null>(null);

  useEffect(() => {
    if (id) {
      getListById(Number(id)).then((res) => {
        setList(res.data);
      });
    }
  }, [id]);

  if (!list) {
    return <Layout>Loading...</Layout>;
  }

  return (
    <Layout>
      <h2>{list.name}</h2>

      {list.tasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
        list.tasks.map((task) => (
          <div key={task.id}>
            {task.title}
          </div>
        ))
      )}
    </Layout>
  );
}