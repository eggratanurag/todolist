import React, { useState, useRef, useEffect } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import TopBarProgress from "react-topbar-progress-indicator";
import Day from "./day.jsx";
import "./home.css";
import {
  getUserFn,
  logOut,
  addItemFn,
  createListFn,
  checkBoxFilledFn,
  deleteClickedFn,
} from "./api.jsx";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function Home() {
  const [listIndex, setListIndex] = useState();
  const [currentListName, setCurrentListName] = useState(<Day />);
  const [deleteConsent, setDeleteConsent] = useState(false);
  const [input, setInput] = useState("");
  const [prevIndex, setPrevIndex] = useState("");
  const [user, setUser] = useState();
  const primaryNav = useRef();
  const navToggle = useRef();
  TopBarProgress.config({ barColors: { 0: "#53516d", "1.0": "#5951d6" } });

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

  const createList = useMutation({
    mutationFn: createListFn,
    onSuccess: (data) => {
      setUser(data);
      setCurrentListName(
        Object.keys(data.lists)[Object.keys(data.lists).length - 1],
      );
      setInput("");
    },
    onError: (data) => {
      console.log(data.message);
    },
  });

  const addItem = useMutation({
    mutationFn: addItemFn,
    onSuccess: (data) => {
      setInput("");
      setUser(data);
    },
    onError: (data) => {
      console.log(data.message);
    },
  });

  const deleteClicked = useMutation({
    mutationFn: deleteClickedFn,
    onSuccess: (data) => {
      setDeleteConsent(false);
      setUser(data);
      if (data.lists) {
        if (Object.keys(data.lists).length === listIndex) {
          setCurrentListName(Object.keys(data.lists)[listIndex - 1]);
        } else {
          setCurrentListName(Object.keys(data.lists)[listIndex]);
        }
      } else {
        setCurrentListName(<Day />);
      }
    },
    onError: (data) => {
      console.log(data.message);
    },
  });

  const deleteHandle = (listName) => {
    setDeleteConsent(true);

    deleteConsent && deleteClicked.mutate({ listName, userId: user._id });
  };

  const checkBoxFilled = useMutation({
    mutationFn: checkBoxFilledFn,
    onSuccess: (data) => {
      setUser(data);
    },
  });

  //////////////////////get user function ///////////////////////
  function googleAuth() {
   
    window.open(process.env.VITE_AUTH_URL, "_self");
    console.log(process.env.VITE_AUTH_URL)
  }

  const { isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUserFn,
    retry: false,
    onSuccess: (data) => {
      console.log(data);
      setUser(data);
      setCurrentListName(Object.keys(data.lists)[0]);
    },
    onError: (data) => {
      console.log(data.message);
    },
  });

  const { refetch: logOutRefetch, isFetching: logOutFetch } = useQuery({
    queryKey: ["logout"],
    queryFn: logOut,
    enabled: false,
    onSuccess: () => {
      setUser();
      setCurrentListName("Sign in to create list");
    },
    onError: (data) => {
      console.log(data.message);
    },
  });

  /////////navigation bar in mobile functionality //////////////////
  function progNav() {
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
      {(createList.isLoading ||
        addItem.isLoading ||
        deleteClicked.isLoading ||
        logOutFetch ||
        userLoading) && <TopBarProgress />}

      <div className='page flex'>
        <div className='mainDiv flex'>
          <div className='backgroundForH1Div flex'>
            <div
              onClick={() => progNav()}
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
                    onClick={() =>
                      addItem.mutate({
                        listName: currentListName,
                        listItem: input,
                        userId: user._id,
                      })
                    }
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
                    onClick={() =>
                      createList.mutate({
                        listName: input,
                        userId: user._id,
                      })
                    }
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
                        onClick={() => setCurrentListName(listName)}
                        type='button'
                      >
                        <div className='listText'>
                          <button
                            className='cancelButton'
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConsent(false);
                            }}
                          >
                            Cancel
                          </button>
                          <p>{listName}</p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setListIndex(index);
                            deleteHandle(listName);
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
                          onClick={() =>
                            checkBoxFilled.mutate({
                              listName: currentListName,
                              listItemIndex: index,
                              userId: user._id,
                            })
                          }
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
          <button onClick={() => logOutRefetch()} className='authButton flex'>
            do you want to logout {user.name} ?
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
