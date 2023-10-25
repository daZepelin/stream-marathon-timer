import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { BaseDirectory, createDir, writeFile, writeTextFile } from "@tauri-apps/api/fs";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  const dataToStore = { key: 'value' };
  const dataToStoreString = JSON.stringify(dataToStore);
  async function saveData() {
    console.log('Saving data...', BaseDirectory.AppLocalData);
    // create folder if not exists
    await createDir('data2', { dir: BaseDirectory.AppLocalData, recursive: true });
    writeFile('data2/data.json', dataToStoreString, { dir: BaseDirectory.AppLocalData })
      .then(() => {
        console.log('Data saved successfully.');
      })
      .catch((error) => {
        console.error('Error saving data:', error);
      }); 
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
          saveData();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
