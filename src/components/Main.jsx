import ReactMarkdown from "react-markdown";

const Main = ({ activeNote, onUpdateNote }) => {
  // takes field we are updating and value and updates the array inside of the app.jsx 
  const onEditField = (field, value) => {
    onUpdateNote({
      //... is the spread operator and destructes the activeNote array into its individual values
      ...activeNote,
      [field]: value,
      lastModified: Date.now(),
    });
  };
  //checks if there is an active note. If not we simply return "No Active Note"
  if (!activeNote) return <div className="no-active-note">No Active Note</div>;

  return (
    <div className="app-main">
      <div className="app-main-note-edit">
        <input
          type="text"
          id="title"
          placeholder="Note Title"
          value={activeNote.title}
          onChange={(e) => onEditField("title", e.target.value)}
          autoFocus
        />
        <textarea
          id="body"
          placeholder="Write your note here..."
          value={activeNote.body}
          onChange={(e) => onEditField("body", e.target.value)}
        />
      </div>
      <div className="app-main-note-preview">
        <h1 className="preview-title">{activeNote.title}</h1>
        <ReactMarkdown className="markdown-preview">
          {activeNote.body}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Main;