import React, { MouseEvent, ReactElement } from "react";
import "./TodoListItem.scss";

interface IProps {
  id?: string;
  name: string;
  complete: boolean;
  onClickDelete: (id?: string) => void;
  onToggleCompleted: (id?: string) => void;
}

export default (props: IProps): ReactElement => {
  const onToggleCompleted = (e: MouseEvent): void => {
    e.stopPropagation();
    e.preventDefault();
    props.onToggleCompleted(props.id);
  };
  const onClickDelete = (e: MouseEvent): void => {
    e.stopPropagation();
    e.preventDefault();
    props.onClickDelete(props.id);
  };

  return (
    <div key={props.id} className="TodoListItem">
      <h3 className="checkmark" onClick={onToggleCompleted}>{props.complete ? "✅" : "🔲"}</h3>
      <span>{props.name}</span>
      <button className="delete" onClick={onClickDelete}>
        Delete
      </button>
    </div>
  );
};
