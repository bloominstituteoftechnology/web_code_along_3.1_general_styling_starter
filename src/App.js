import React, { useState } from "react";
import _uglyData from "./utils/uglify";
import { sortByKey } from "./utils/sorting";
import { cleanUndefinedKeys, cleanDates } from "./utils/data-clean";
import { filter } from "./utils/filtering";
import User from "./components/User";
import "./styles/App.css";

function App() {
  const [initialData] = useState(_uglyData);
  const [uglyData, setUglyData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [field, setField] = useState("");
  const [userCount, setUserCount] = useState(initialData.length);

  const rtt = () => {
    document.documentElement.scrollTop = 0;
  };

  const resetData = () => {
    setUglyData(initialData);
  };

  const sortGeneric = (arr, key) => {
    const newData = sortByKey(arr, key);
    setUglyData(newData);
  };

  const cleanData = async (arr) => {
    const newData1 = await cleanUndefinedKeys(arr);
    const newData2 = await cleanDates(newData1);
    setUglyData(newData2);
    return newData2;
  };

  const searchTermSetter = (e) => {
    setSearchTerm(e.target.value);
  };

  const fieldSetter = (e) => {
    setField(e.target.value);
  };

  const search = async (e) => {
    e.preventDefault();
    const newData = await filter(initialData, field, searchTerm);
    setUglyData(newData);
  };

  const countUsers = (arr) => {
    const reduce = arr.reduce((accumulator) => {
      return (accumulator += 1);
    }, 0);

    setUserCount(reduce);
    return reduce;
  };

  return (
    <div className="container">
      <h1>List of Users</h1>

      <div className="button-container">
        <div className="row">
          <div id="users-count">
            <h2>Users: {userCount}</h2>
            <button onClick={() => countUsers(uglyData)}>Update</button>
          </div>

          <form id="search-bar" onSubmit={search}>
            <input
              name="searchTerm"
              type="text"
              onChange={searchTermSetter}
              placeholder="Search..."
            />

            <select name="field" onChange={fieldSetter}>
              <option value="">Field</option>
              <option value="name">Name</option>
              <option value="username">Username</option>
              <option value="email">Email</option>
              <option value="company">Company</option>
              <option value="address">Address</option>
            </select>

            <button type="submit">Submit</button>
          </form>
        </div>

        <div id="sorting-buttons" className="row">
          <button onClick={() => sortGeneric([...uglyData], "email")}>
            Sort by email
          </button>
          <button onClick={() => sortGeneric([...uglyData], "username")}>
            Sort by username
          </button>
          <button onClick={() => sortGeneric([...uglyData], "lastName")}>
            Sort by last name
          </button>
          <button onClick={() => sortGeneric([...uglyData], "dob")}>
            Sort by dob
          </button>
          <button onClick={() => sortGeneric([...uglyData], "state")}>
            Sort by state
          </button>
        </div>

        <div id="fixData-buttons" className="row">
          <button onClick={() => cleanData([...uglyData])}>Clean data</button>
          <button onClick={() => resetData()}>Reset data</button>
        </div>
      </div>

      <div className="userlist-container">
        {uglyData.map((user) => {
          return <User key={user.id} user={user} />;
        })}
      </div>

      <button id="rtt" onClick={rtt}>Return to Top</button>
    </div>
  );
}

export default App;
