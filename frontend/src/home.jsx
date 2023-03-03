import React, { useState, useRef, useEffect } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import TopBarProgress from "react-topbar-progress-indicator";
import axios from "axios";
import Day from "./day.jsx";
import "./home.css";

export default function Home() {
  const [progress, setProgress] = useState(false);
  const [currentListName, setCurrentListName] = useState("");
  const [deleteConsent, setDeleteConsent] = useState(false);
  const [input, setInput] = useState("");
  const [prevIndex, setPrevIndex] = useState("");
  const [user, setUser] = useState();
  const primaryNav = useRef();
  const navToggle = useRef();
  TopBarProgress.config({ barColors: { 0: "#53516d", "1.0": "#5951d6" } });

  useEffect(() => {
    setProgress(true);
    setCurrentListName(<Day />);
    getUser();
  }, []);

  useEffect(() => {

    if (user) {
      const clickedDiv = document.getElementById(currentListName);

      clickedDiv && clickedDiv.classList.add("clicked");

      if (prevIndex) {
     
        const prevDiv = document.getElementById(prevIndex);
        // console.log("prevDiv", prevDiv);
        if (prevDiv) {
          prevDiv.classList.remove("clicked");
          prevDiv.lastChild.classList.remove("deleteClicked");
          prevDiv.firstChild.firstChild.style.display = "none";
          prevDiv.firstChild.lastChild.style.display = "block";
        }
        setDeleteConsent(false);
      }
      setPrevIndex(currentListName);
   
    }
  }, [currentListName]);

  // console.log("index state: " + (indexState))
  useEffect(() => {
    const clickedDiv = document.getElementById(currentListName);
    if (clickedDiv) {
      deleteConsent
        ? clickedDiv.lastChild.classList.add("deleteClicked")
        : clickedDiv.lastChild.classList.remove("deleteClicked");
      clickedDiv.firstChild.firstChild.style.display = deleteConsent
        ? "block"
        : "none";
      clickedDiv.firstChild.lastChild.style.display = deleteConsent
        ? "none"
        : "block";
    }
  }, [deleteConsent]);

  /*list functions*/

  async function createList() {
    setProgress(true);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      await axios
        .put("/list/create", { listName: input, userId: user._id }, config)
        .then((result) => {
          setUser(result.data);
          setCurrentListName(
            Object.keys(result.data.lists)[
              Object.keys(result.data.lists).length - 1
            ],
          );
        });
      setInput("");
      setProgress(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function addItem() {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      await axios
        .put(
          "/list/add",
          { listName: currentListName, listItem: input, userId: user._id },
          config,
        )
        .then((result) => setUser(result.data));
      setInput("");
    } catch (error) {
      console.log(error);
    }
  }

  function listClicked(listName, index) {
    setCurrentListName(listName);
    // setIndexState(index);
  }
  function cancelled() {
    setDeleteConsent(false);
  }

  async function deleteClicked(listName, listIndex) {
    // console.log("calling deleteClicked");
    setDeleteConsent(true);
    if (deleteConsent) {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      await axios
        .put(
          "/list/deleteList",
          { listName: listName, userId: user._id },
          config,
        )
        .then((result) => result.data)
        .then((data) => {
          setUser(data);
          if(data.lists) {
            if (Object.keys(data.lists).length === listIndex) {
              setCurrentListName(Object.keys(data.lists)[listIndex - 1]);
            } else {
              setCurrentListName(Object.keys(data.lists)[listIndex]);
            }

          }else {
            setCurrentListName(<Day />)
          }
          
         
        });
      setDeleteConsent(false);
      setProgress(false);
    }
  }

  async function checkBoxFilled(listItem, index) {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      await axios
        .put(
          "/list/remove",
          { listName: currentListName, listItemIndex: index, userId: user._id },
          config,
        )
        .then((result) => setUser(result.data));
    } catch (error) {
      console.log(error);
    }
  }

  //////////////////////get user function ///////////////////////
  function googleAuth() {
    window.open("http://localhost:5000/auth/google", "_self");
  }
  async function getUser() {
    try {
      await axios
        .get("/auth/login/success", { withCredentials: true })
        //  .then(result=> console.log(result.data.user))
        .then((result) => {
          setUser(result.data.user);
          setCurrentListName(Object.keys(result.data.user.lists)[0]);
        });
    } catch (error) {
      console.log(error.response?.data);
    }
    // setIndexState(0);
    setProgress(false);
  }
  async function logout() {
    setProgress(true);
    try {
      await axios
        .get("/auth/logout", { withCredentials: true })
        .then((result) => result.data === "logged out" && setUser());
    } catch (error) {
      console.log(error.response?.data);
    }
    setCurrentListName("Sign in to create list");
    setProgress(false);
  }

  /////////navigation bar in mobile functionality //////////////////
  function faltu() {
    const visibility = primaryNav.current.getAttribute("data-visible");

    if (visibility === "false") {
      navToggle.current.setAttribute("aria-expanded", true);
      primaryNav.current.setAttribute("data-visible", true);
    } else {
      primaryNav.current.setAttribute("data-visible", false);
      navToggle.current.setAttribute("aria-expanded", false);
    }
  }

 
  return (
    <div className='wholePage flex'>
      {progress && <TopBarProgress />}

      <div className='page flex'>
        <div className='mainDiv flex'>
          <div className='backgroundForH1Div flex'>
            <div
              onClick={() => faltu()}
              className='h1div flex mobile-nav-toggle'
              aria-controls='primary-navigation'
              aria-expanded='false'
              ref={navToggle}
            >
              <h2>{currentListName === "home" ? <Day /> : currentListName} </h2>
            </div>
          </div>

          <div className='formDiv flex'>
            <div className='contentDiv flex'>
              <div className='inputDiv flex'>
                <input
                  type='text'
                  placeholder='add something...'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <div className='addButtonDiv flex'>
                  <button
                    className='addButton'
                    onClick={() => addItem()}
                    disabled={
                      (!user ||
                        (user && !user.lists) ||
                        input.length > 35 ||
                        input.length == 0) &&
                      true
                    }
                  >
                    +
                  </button>
                  <button
                    className='createButton'
                    onClick={() => createList()}
                    disabled={
                      (!user || input.length > 15 || input.length == 0) && true
                    }
                  >
                    create
                  </button>
                </div>
              </div>
              <div className='lastDiv flex'>
                <div
                  data-visible='false'
                  id='primary-navigation'
                  ref={primaryNav}
                  className='buttonDiv flex primary-navigation'
                >
                  {user &&
                    user.lists &&
                    Object.keys(user.lists).map((listName, index) => (
                      <div
                        key={index}
                        id={listName}
                        className='nestedDiv'
                        onClick={() => listClicked(listName, index)}
                        type='button'
                      >
                        <div className='listText'>
                          <button
                            className='cancelButton'
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelled();
                            }}
                          >
                            Cancel
                          </button>
                          <p>{listName}</p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteClicked(listName, index);
                          }}
                          className='deleteButton flex'
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    ))}
                </div>
                <div className='listDiv flex'>
                  {user &&
                    user.lists &&
                    currentListName &&
                    user.lists[currentListName].map((listItem, index) => (
                      <div key={index} className='listItem flex'>
                        <button
                          className='deleteCheckbox flex'
                          onClick={() => checkBoxFilled(listItem, index)}
                        >
                          <RemoveIcon className='removeIcon' />
                        </button>

                        <p className='strike'>{listItem}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className='flex footer'>
        {user ? (
          <button onClick={() => logout()} className='authButton flex'>
            logout
          </button>
        ) : (
          <button className='authButton flex' onClick={() => googleAuth()}>
            <GoogleIcon /> sign in with google
          </button>
        )}
      </footer>
    </div>
  );
}
