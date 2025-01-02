import React, { useState,useCallback } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import * as roomActions from '../redux/actions/roomActions'
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash'; // Import lodash debounce function

const OnlineEditor = () => {
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const {roomUuid,codeText,codeLanguage} = useSelector((state) => state.room);
  const dispatch = useDispatch();

  const executeCode = async () => {
    try {
      let url =`https://code-exexution-backend.onrender.com/run`
      let localurl = `http://localhost:9000/run`
      const response = await axios.post(url, {
        language:codeLanguage,
        code:codeText,
      });
      setOutput(response.data.output);
    } catch (error) {
      setOutput('Error: ' + error.message);
    }
  };
  const sendCodeChange = useCallback(
    debounce((value) => {
      dispatch(roomActions.sendCode({ roomId: roomUuid, message: { data: value } }));
    }, 300), // Delay in milliseconds
    [dispatch, roomUuid]
  );
  const languageChange = useCallback(
    debounce((value) => {
      dispatch(roomActions.setLanguage({ roomId: roomUuid, message: { data: value } }));
    }, 300), // Delay in milliseconds
    [dispatch, roomUuid]
  );

  // Handle editor changes
  const handleEditorChange = (value) => {
    setCode(value); // Update local state immediately
    sendCodeChange(value); // Debounced server dispatch
  };

  // Handle code language changes
  const handlelanguageChange = (e) => {
    setLanguage(e.target.value)
    languageChange(e.target.value); // Debounced server dispatch
  };

  return (
    // <div className="h-screen w-screen flex flex-col bg-gray-900 text-white">
    //   {/* Language Selector */}
    //   <div className="p-4 bg-gray-800 flex justify-between items-center">
    //     <select
    //       onChange={handlelanguageChange}
    //       value={codeLanguage}
    //       className="bg-gray-700 text-white p-2 rounded"
    //     >
    //       <option value="javascript">JavaScript</option>
    //       <option value="python">Python</option>
    //       <option value="cpp">C++</option>
    //     </select>
    //     <button
    //       onClick={executeCode}
    //       className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
    //     >
    //       Run
    //     </button>
    //   </div>

    //   {/* Editor */}
    //   <div className="flex-1">
    //     <Editor
    //       theme="vs-dark" // Enables dark mode
    //       height="100%" // Full height of container
    //       language={codeLanguage}
    //       // value={code}
    //       value={codeText}
    //       // onChange={(value) => setCode(value)}
    //       onChange={handleEditorChange}
    //     />
    //   </div>

    //    {/* Output Section */}
    //    <div className="p-4 bg-gray-800">
    //      <h3 className="text-lg font-semibold">Output:</h3>
    //      <pre
    //        className="bg-gray-700 p-4 rounded text-sm whitespace-pre-wrap overflow-auto resize-y"
    //        style={{ minHeight: "100px", maxHeight: "300px" }} // Optional: Set height constraints
    //      >
    //        {output}
    //      </pre>
    //    </div>
    // </div>

    <div className="flex flex-col h-full w-full bg-[#313338] text-white">
    {/* Language Selector and Run Button */}
    <div className="p-4 bg-[#313338] flex justify-between items-center">
      <select
        onChange={handlelanguageChange}
        value={codeLanguage}
        className="bg-gray-700 text-white p-2 rounded"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
      </select>
      <button
        onClick={executeCode}
        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
      >
        Run
      </button>
    </div>

    {/* Editor Container */}
    <div className="flex-1 ">
      <Editor
        theme="vs-dark" // Enable dark mode theme
        height="100%" // Ensure the editor takes the full height of the parent container
        language={codeLanguage}
        value={codeText}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          wordWrap: "on",
          lineNumbers: "on",
        }}
      />
    </div>

    {/* Output Section */}
    <div className="p-4 bg-[#313338]">
      <h3 className="text-lg font-semibold">Output:</h3>
      <pre
        className="bg-gray-[#404249] p-4 rounded text-sm whitespace-pre-wrap overflow-auto resize-y"
        style={{ minHeight: "100px", maxHeight: "300px" }} // Optional: set height constraints for the output area
      >
        {output}
      </pre>
    </div>
  </div>
  );
};

export default OnlineEditor;
