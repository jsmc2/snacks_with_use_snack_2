import React from "react";

/*
Create a Snackbar Manager that holds and manages snackbar notifications of the entire page.
1) Manages all snackbars on the page
Further: Manages if something is read or acknowledged per user, that can re-reloaded with refreshing
*/
export class SnackbarManager extends React.Component {
  render() {
    return <Snackbar />;
  }
}
/*
Create a Snackbar component that has 
1) An auto destruct,
2) A button that can trigger an action anywhere in the app
3) Add interviewer's feature improvements
*/
export class Snackbar extends React.Component {
  render() {
    return <div>Hi I am a snackbar</div>;
  }
}
