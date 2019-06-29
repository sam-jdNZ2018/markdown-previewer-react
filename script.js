const render = ReactDOM;
const OPTIONS = { breaks: true };

marked.setOptions(OPTIONS);

const placeholder =
`# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:
  
Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`
  
You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want! 
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
`;

const Editor = props => {
  return (
    React.createElement("div", { id: "editor-outer", style: props.style },
    React.createElement("h2", null, "Editor"),
    React.createElement("textarea", { id: "editor", style: props.subStyle, onChange: props.convertText, value: props.text })));


};

const Previewer = props => {
  return (
    React.createElement("div", { id: "preview-outer", style: props.style },
    React.createElement("h2", null, "Previewer"),
    React.createElement("div", { id: "preview", dangerouslySetInnerHTML: { __html: props.markdown } })));


};

class MarkApp extends React.Component {
  constructor(props) {
    super(props);
    let disabled = false;
    if (window.innerWidth < 800) {
      disabled = true;
    }
    this.state = { markdown: placeholder, view: "stack", disabledView: disabled };
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.convert = this.convert.bind(this);
    this.switchView = this.switchView.bind(this);
    this.clearEditor = this.clearEditor.bind(this);
  }

  componentDidMount() {
    //window.addEventListener("resize",this.handleResize);
  }

  componentDidUnmount() {

  } //window.removeEventListener("resize",this.handleResize);

  //Set the current text in state to the current text in the editor
  handleEditorChange(e) {
    this.setState({ markdown: e.target.value, view: this.state.view, disabledView: this.state.disabledView });
  }

  //
  handleResize(e) {
    let width = e.target.innerWidth;
    let height = e.target.innerHeight;
    if (e.target.innerWidth < 800) {
      this.setState({ markdown: this.state.markdown, view: "stack", disabledView: true });
    } else
    {
      this.setState({ markdown: this.state.markdown, view: this.state.view, disabledView: false, editorMinimised: this.state.editorMinimised, previewMinimised: this.state.previewMinimised });
    }
  }

  //Convert the text in the editor pane into parsed github flavoured markdown
  convert() {
    return marked(this.state.markdown);
  }

  //Switch the orientation of the two containers(editor and preview) between editor above the previewer
  //or the editor next to the previewer
  switchView() {
    if (this.state.view == "stack") {
      this.setState({ markdown: this.state.markdown, view: "aside", disabledView: this.state.disabledView });
    } else
    {
      this.setState({ markdown: this.state.markdown, view: "stack", disabledView: this.state.disabledView });
    }
  }

  //Clear all the text in the editor pane
  clearEditor() {
    this.setState({ markdown: "", view: this.state.view, disabledView: this.state.disabledView });
  }

  render() {
    let paneStyle = { display: "grid", gridTemplateRows: "auto 1fr", gridRowGap: "20px" };
    let editorStyle = {};
    let previewStyle = {};
    if (this.state.view != "stack") {
      paneStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gridColumnGap: "10px" };
      editorStyle = { height: "100%", width: "100%" };
      previewStyle = { height: "100%", width: "100%" };
    }
    return (
      React.createElement("div", { id: "app-outer" },
      React.createElement("h1", { id: "title" }, "Markdown Previewer"),
      React.createElement("div", { id: "button-div" },
      React.createElement("button", { type: "button", onClick: this.switchView, disabled: this.state.disabledView }, "Switch Views"),
      React.createElement("button", { type: "button", onClick: this.clearEditor }, "Clear Editor")),

      React.createElement("div", { id: "app-inner", style: paneStyle },
      React.createElement(Editor, { style: editorStyle, convertText: this.handleEditorChange, text: this.state.markdown }),
      React.createElement(Previewer, { style: previewStyle, markdown: this.convert() }))));



  }}


ReactDOM.render(React.createElement(MarkApp, null), document.getElementById("main"));
