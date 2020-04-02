import React from "react";
import ReactDOM from "react-dom";
import useSnacks from "./useSnacks";
import "./styles.css";

function createTheSnack(createSnack) {
  const report = `Snack report for event at timestamp ${Date.now()}`;
  const actionTitle = `OK`;
  const action = function(id, deleteSnack) {
    deleteSnack(id);
  };
  createSnack(report, actionTitle, action);
}

function App() {
  const { SnacksBar, createSnack } = useSnacks(7500);
  const clickHandler = () => {
    createTheSnack(createSnack);
  };
  return (
    <div className="App">
      <h1>-= App =-</h1>
      <div style={{ marginTop: "5px", marginBottom: "5px" }}>
        <button onClick={clickHandler}>Trigger Event</button>
      </div>
      <div style={{ marginBottom: "5px" }}>
        <SnacksBar />
      </div>
      <hr />
      <h2>Create a Snackbar component that has </h2>
      <ul>
        <li>(DONE) An auto destruct</li>
        <li>(DONE) Information</li>
        <li>(DONE) A button that can trigger an action anywhere in the app</li>
        {/* <li>Add interviewer's feature improvements</li> */}
      </ul>
      <h2>
        Create a Snackbar Manager that holds and manages snackbar notifications
        of the entire page.
      </h2>
      <ul>
        <li>(DONE) Manages all snackbars on the page</li>
        <li>
          (DONE^) Further: Manages if something is read or acknowledged per
          user, that can re-reloaded with refreshing.
        </li>
      </ul>
      <h2>ISSUES</h2>
      <ul>
        <li>
          React.memo doesn't have desired affect on SnackWgt component. Not just
          because same-but-dif action function is passed in as a prop, but even
          when tested with non-changing simple props, memo didn't prevent a
          rerender for explored but yet unresolved reasons.
        </li>
        <li>
          ^ Action functions in this build-out can be customized to each snack
          and are stored in snack objects, but these functions don't store along
          with the snacks in local storage since functions don't stringify for
          storage, hence these actions are no longer available when snacks are
          reconstituted from local storage. Therefore a different storage
          approach, or a different appraoch to creating actions for snacks,
          would need to be considerd.
        </li>
      </ul>
    </div>
  );
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
