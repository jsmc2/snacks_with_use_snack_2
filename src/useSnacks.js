import React, { memo, useState, useEffect } from "react";

const __myStorage = window.localStorage;

export default useSnacks;
function useSnacks(_snackLife = 100000 /* 10 secs */) {
  const [snacksList, setSnacksList] = useState(getSnacksListFromStorage(true)); // snacksList is an obj of objs.

  function getSnacksList() {
    return snacksList;
  }
  function getSnacksListFromStorage(doChangeTimestamps) {
    const listObj = JSON.parse(__myStorage.getItem("snacksList")) || null;
    if (doChangeTimestamps && listObj) {
      const sortedIds = Object.keys(listObj).sort(function(a, b) {
        return listObj[a] - listObj[b];
      });
      const newTimeStamp = Date.now();
      let staggeringDelay = 0;
      sortedIds.forEach(key => {
        listObj[key].timestamp = newTimeStamp + staggeringDelay;
        staggeringDelay += 200;
      });
    }
    return listObj;
  }
  function updateSnacksListStorage(list) {
    __myStorage.setItem("snacksList", JSON.stringify(list));
  }
  function createSnack(report, actionTitle, action) {
    console.log("-------------");
    const timestamp = Date.now();
    const id = timestamp;
    const newSnack = {
      id,
      timestamp,
      report,
      actionTitle,
      action
    };
    const snacksList = getSnacksList("1a - createSnack") || {};
    const updatedSnacksList = {
      ...snacksList,
      [id]: newSnack
    };
    console.log("1b. @createSnack | updatedSnacksList: ", updatedSnacksList);
    updateSnacksListStorage(updatedSnacksList);
    setSnacksList(updatedSnacksList);
  }
  function deleteSnack(id) {
    const snacksList = getSnacksList("deleteSnack") || {};
    const updatedSnacksList = {
      ...snacksList
    };
    delete updatedSnacksList[id];
    updateSnacksListStorage(updatedSnacksList);
    setSnacksList(updatedSnacksList);
  }
  const SnacksBar = props => {
    const snacksList = getSnacksList("SnacksBar");
    return (
      <div
        style={{
          padding: "5px",
          border: "solid",
          borderSize: "1px",
          borderColor: "#bbb"
        }}
      >
        <h2>-= Snacks Bar (Time: {Date.now()}) =-</h2>
        <SnacksList
          {...props}
          snackList={snacksList}
          snackLife={_snackLife}
          deleteSnack={deleteSnack}
        />
      </div>
    );
  };

  return {
    createSnack,
    SnacksBar
  };
}

//:: HOISTED INTO HOOK ::::::::::-::::::::::-::::::::::-::::::::::
function SnacksList(props) {
  let output = "";
  const snacksList = props.snackList;
  if (snacksList) {
    const sortedIds = Object.keys(snacksList).sort(function(a, b) {
      return snacksList[a] - snacksList[b];
    });
    output = (
      <div>
        <ul
          style={{
            padding: "0",
            listStyleType: "none"
          }}
        >
          {sortedIds.map(id => {
            const snack = snacksList[id];
            return (
              <Snack
                key={id}
                snackLife={props.snackLife}
                deleteSnack={props.deleteSnack}
                {...snack}
              />
            );
          })}
        </ul>
      </div>
    );
  }
  return output;
}

function Snack(props) {
  const {
    id,
    timestamp,
    report,
    snackLife,
    actionTitle,
    action,
    deleteSnack
  } = props;
  // Assume remove snack after n secs after first shown vs n secs after created.
  useEffect(() => {
    const delay = snackLife - (Date.now() - timestamp);
    const stoRef = setTimeout(() => {
      deleteSnack(id);
      return function cleanup() {
        clearTimeout(stoRef);
      };
    }, delay);
    return function cleanup() {
      clearTimeout(stoRef);
    };
  }, []);
  // Props.action may not be defined if snacks coming from local storage, hence provide passable alternarice.
  console.log("action :", action);
  const _action = action
    ? () => {
        action(id, deleteSnack);
      }
    : () => {
        deleteSnack(id);
      };
  const _actionTitle = action ? actionTitle : actionTitle + "*";
  return (
    <SnackWgt
      id={id}
      report={report}
      actionTitle={_actionTitle}
      action={_action}
    />
  );
}

//:: HOISTED INTO Snack ::::::::::-::::::::::-::::::::::-::::::::::

// Note memo not having desired affect becasue same-but-dif action is passed in,
// ...and seemingly for other TBD reasons.
const SnackWgt = React.memo(({ id, report, actionTitle, action }) => {
  return (
    <li
      style={{
        marginTop: "5px",
        marginBottom: "5px",
        padding: "5px",
        border: "solid",
        borderSize: "1px",
        borderColor: "#eee"
      }}
    >
      <div style={{ marginBottom: "2px" }}>
        {report} (Time: {Date.now()})
      </div>
      <button onClick={action}>{actionTitle}</button>
    </li>
  );
});
