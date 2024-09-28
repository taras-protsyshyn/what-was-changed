import { time } from "../../../services";
interface SnapshotListItem {
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
  snapshotID: string;
}

export const SnapshotListItem = ({ snapshotID, onClick, onDelete }: SnapshotListItem) => {
  return (
    <li>
      <span onClick={() => onClick(snapshotID)}>{time.formatDate(snapshotID)}</span>
      <button onClick={() => onDelete(snapshotID)}>X</button>
    </li>
  );
};
