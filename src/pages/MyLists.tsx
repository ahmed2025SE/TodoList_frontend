import { useEffect, useState } from "react";
import {
  getLists,
  createList,
  deleteList,
  updateList,
} from "../api/lists";
import ListCard from "../components/ListCard";
import Layout from "../components/Layout";
import type { List } from "../types/list";

export default function MyLists() {
  const [lists, setLists] = useState<List[]>([]);
  const [newName, setNewName] = useState("");

  const loadLists = async () => {
    const res = await getLists();
    setLists(res.data);
  };

  useEffect(() => {
    loadLists();
  }, []);

  return (
    <Layout>
      <h2>My Lists</h2>

      <input
        placeholder="New list name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />

      <button
        onClick={async () => {
          await createList(newName);
          setNewName("");
          loadLists();
        }}
      >
        Add List
      </button>

      <hr />

      {lists.map((list) => (
        <ListCard
          key={list.id}
          list={list}
          onDelete={async (id) => {
            await deleteList(id);
            loadLists();
          }}
          onUpdate={async (id, name) => {
            await updateList(id, name);
            loadLists();
          }}
        />
      ))}
    </Layout>
  );
}