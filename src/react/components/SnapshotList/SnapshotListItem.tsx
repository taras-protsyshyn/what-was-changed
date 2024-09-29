import { time } from "../../../services";
interface SnapshotListItem {
  onClick: (id: string, active: Boolean) => void;
  onDelete: (id: string) => void;
  snapshotID: string;
  active: Boolean;
}

export const SnapshotListItem = ({ snapshotID, onClick, onDelete, active }: SnapshotListItem) => {
  return (
    <li>
      {active ? "V" : ""}
      <button onClick={() => onClick(snapshotID, active)}>{time.formatDate(snapshotID)}</button>-
      <button onClick={() => onDelete(snapshotID)}>X</button>
    </li>
  );
};
