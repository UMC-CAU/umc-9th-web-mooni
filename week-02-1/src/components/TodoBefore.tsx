import { useState } from "react";
import { TTodo } from "../types/todo";
import { FormEvent } from "react";

const TodoBefore = () => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
  const [input, setInput] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const text = input.trim();

    if (text) {
      const newTodo: TTodo = { id: Date.now(), text };
      setTodos((prevTodos): TTodo[] => [...prevTodos, newTodo]);
      setInput("");
    }
  };

  const completeTodo = (todo: TTodo): void => {
    setTodos((prevTodos) => prevTodos.filter((t): boolean => t.id !== todo.id));
    setDoneTodos((prevDoneTodos): TTodo[] => [...prevDoneTodos, todo]);
  };

  const deletTodo = (todo: TTodo): void => {
    setDoneTodos((prevDoneTodo): TTodo[] =>
      prevDoneTodo.filter((t): boolean => t.id !== todo.id)
    );
  };

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">MOONI TODO🌙</h1>
      <h4>(Before)</h4>
      <form onSubmit={handleSubmit} className="todo-container__form">
        <input
          value={input}
          onChange={(e): void => setInput(e.target.value)}
          type="text"
          className="todo-container__input"
          placeholder="할 일 입력"
          required
        />
        <button type="submit" className="todo-container__button">
          Add
        </button>
      </form>
      <div className="render-container">
        <div className="render-container__section">
          <h2 className="render-container__title">할 일</h2>
          <ul id="todo-list" className="render-container__list">
            {todos.map((todo) => (
              <li key={todo.id} className="render-container__item">
                <span className="render-container__item-text">{todo.text}</span>
                <button
                  onClick={(): void => completeTodo(todo)}
                  style={{
                    backgroundColor: "#28a745",
                  }}
                  className="render-container__item-button"
                >
                  완료
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="render-container__section">
          <h2 className="render-container__title">완료</h2>
          <ul id="todo-list" className="render-container__list">
            {doneTodos.map((todo) => (
              <li key={todo.id} className="render-container__item">
                <span className="render-container__item-text">{todo.text}</span>
                <button
                  onClick={(): void => deletTodo(todo)}
                  style={{
                    backgroundColor: "#dc3545",
                  }}
                  className="render-container__item-button"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TodoBefore;
