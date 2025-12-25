import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { List } from "../types/list";

type Props = {
  list: List;
  onDelete: (id: number) => void;
  onUpdate: (id: number, name: string) => void;
};

export default function ListCard({ list, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(list.name);
  const navigate = useNavigate();

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
      {editing ? (
        <>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={() => {
              onUpdate(list.id, name);
              setEditing(false);
            }}
          >
            Save
          </button>
        </>
      ) : (
        <>
          <h3>{list.name}</h3>
          <button onClick={() => setEditing(true)}>Edit</button>
        </>
      )}

      <br />

      <button onClick={() => navigate(`/lists/${list.id}`)}>
        Open
      </button>

      <button onClick={() => onDelete(list.id)}>
        Delete
      </button>
    </div>
  );
}