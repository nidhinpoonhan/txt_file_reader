import React, { memo, useEffect, useState } from 'react';
import './App.css';

const App = memo(function App(props) {
  const [values, setValues] = useState({ delimiter: '|', lines: 1 });
  const [errors, setErrors] = useState({});
  const [fileData, setFileData] = useState([]);

  useEffect(() => {
    let dropArea = document.getElementsByTagName("BODY")[0];;
    dropArea.addEventListener('dragenter', onDrag, false)
    dropArea.addEventListener('dragover', onDrag, false)
    dropArea.addEventListener('drop', onDrop, false)
    return () => {
      dropArea.removeEventListener('dragenter', onDrag);
      dropArea.removeEventListener('dragover', onDrag);
      dropArea.removeEventListener('drop', onDrop);
    }
  }, []);

  const onDrag = (e) => {
    e.preventDefault();
  }
  const onDrop = (e) => {
    e.preventDefault()
    let dt = e.dataTransfer
    let files = dt.files;
    console.log("files", files)
    readTextFile(files)
  }
  const readTextFile = (files) => {
    if (files.length > 0 && files[0].type === "text/plain") {
      const file = files[0];
      setErrorValues("file", '')
      var formData = new FormData();
      formData.append('file', file);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:8000', true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          setFileData(JSON.parse(xhr.response));
        }
      }
      xhr.send(formData);
    } else {
      setErrorValues('file', 'Invalid file');
    }
  };

  const onFileSelect = (e) => {
    let files = e.target.files;
    readTextFile(files)
  }

  const setErrorValues = (name, value) => {
    setErrors((errs) => ({ ...errs, [name]: value }))
  }

  const onChangeText = (e) => {
    let { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }))
  }

  console.log("fileData", fileData)
  const getTableData = () => {
    let newData = [...fileData];
    newData.length = values.lines || 0;
    return <table>
      <tbody>
        {newData.map((item, r) => (
          <tr key={r} className="tr">
            {item.split(values.delimiter).map((v, i) => (
              <td key={i}>{v}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  }

  return (
    <div className="root">
      <div className="form-field">

        <label htmlFor="myfile">Select a file:</label>
        <input type="file" accept=".txt" htmlFor="myfile" onChange={onFileSelect} />
      </div>
      <div className="error">{errors.file}</div>
      <div className="form-field">
        <div className="field">
          <label htmlFor="delimiter">Delimiter:</label>
          <input type="text" name="delimiter" onChange={onChangeText} value={values.delimiter} />
        </div>
        <div className="field">
          <label htmlFor="lines">Lines:</label>
          <input type="number" name="lines" onChange={onChangeText} value={values.lines} />
        </div>
      </div>
      <div>
        {getTableData()}
      </div>
    </div>
  );
})

export default App;
