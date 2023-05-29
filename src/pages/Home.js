import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import React, { useEffect, useState, useReducer, useRef } from "react";
import { auth } from "../config/firebase";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { Form, TextArea, Grid } from "semantic-ui-react";
import { red, purple } from "@mui/material/colors";
import SendIcon from "@mui/icons-material/Send";
import img from "./img.png";
import { db, storage } from "../config/firebase";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import EditIcon from "@mui/icons-material/Edit";
import { formatDistanceToNow, format } from "date-fns";
import { CheckSharp, ErrorOutlineOutlined, SendToMobile } from "@mui/icons-material";

const Home = () => {
  const [authUser, setAuthUser] = useState(null);
  const [lick, setLick] = useState([]);
  const [newLick, setNewLick] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCom, setNewCom] = useState([]);
  const [errText, setErrText] = useState("");
  const [showErr, setShowErr] = useState(false);
  const [whCom, setwhCom] = useState("");
  const [opCom, setOpCom] = useState([]);

  const licksCollectionRef = collection(db, "moods");

  const onSubmit = async () => {
    try {
      if (newLick !== "") {
        await addDoc(licksCollectionRef, {
          text: newLick,
          userid2: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL,
          createdAt: Date.now(),
          likes: [],
          comments: [],
        });
      } else {
        setErrText("Empty Area!!");
        setShowErr(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkLikes = (id, likes) => {
    try {
      const likesRef = doc(db, "moods", id);

      if (likes?.includes(authUser.uid)) {
        updateDoc(likesRef, {
          likes: arrayRemove(authUser.uid),
        }).catch((e) => {
          console.log(e);
        });
      } else {
        updateDoc(likesRef, {
          likes: arrayUnion(authUser.uid),
        }).catch((e) => {
          console.log(e);
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setNewCom("");
  }, [whCom]);

  const openComAdd = (com) => {
    if (whCom === com) {
      return false;
    }
    return true;
  };

  const handleAddElement = (a) => {
    if (!opCom.includes(a)) {
      const newElement = a;
      setOpCom((prevArray) => [...prevArray, newElement]);
    } else {
      setOpCom((prevArray) => prevArray.filter((comm) => comm != a));
      openCom(a);
    }
  };

  const openCom = (com) => {
    if (opCom.includes(com)) {
      return false;
    } else {
      return true;
    }
  };


  const checkComments = (id) => {
    try {
      if (newCom !== "") {

        const commentRef = doc(db, "moods", id);
        updateDoc(commentRef, {
          comments: arrayUnion({
            user: authUser.uid,
            usmail:authUser.email,
            userName: authUser.displayName,
            comment: newCom,
            photoURLC: authUser.photoURL,
            createdAt: Date.now(),
          }),
        })
        
          .then(() => {
            console.log("added");
            setNewCom("");
           
          })
          .catch((e) => {
            console.log(e);
          });
      }
      else {
        
        setErrText("Empty Comment!!");
        setShowErr(true);
        
      }
      
    } catch (err) {
      console.error(err);
    }
  };


  function Error() {
    return (
      <div>
        <ToastContainer position="bottom-end" className="p-3">
          <Toast
            bg={"danger"}
            danger
            onClose={() => setShowErr(false)}
            show={showErr}
            delay={4000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">Warning</strong>
            </Toast.Header>
            <Toast.Body id="msg">{errText}</Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    );
  }

  useEffect(() => {
    const getLicks = async () => {
      try {
        const data = await getDocs(licksCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setLick(filteredData);
      } catch (err) {
        console.error(err);
      }
    };
    getLicks();
  }, [onSubmit]);

  const deleteLick = async (id) => {
    const lickDoc = doc(db, "moods", id);
    await deleteDoc(lickDoc);
  };




  const deleteCom = async (id) => {
    try{
      const commentRef = doc(db, "moods", id);
      updateDoc(commentRef, {
        comments:arrayRemove(id),
    })
}
  catch(err){
    console.log(err)
  }
  };

 

  const submitLick = () => {
    onSubmit();
    setNewLick("");
  };

  const uploadFile = async (file, authUser, setLoading) => {
    const fileRef = ref(storage, "images/" + authUser.email + ".png");

    setLoading(true);
    const snapshot = await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);
    updateProfile(authUser, { photoURL });
    console.log(photoURL);

    setLoading(false);
    setFileUpload(null);
  };
  const [show, setShow] = useState(false);

  const handleClose2 = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (authUser?.photoURL) {
      setUrl(authUser.photoURL);
    }
  }, [authUser]);

  const changeUsername = async () => {
    try {
      await updateProfile(authUser, { displayName: newName });
      setIsEditing(false);
      console.log("hop");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
      })
      .catch((error) => console.log(error));
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    handleClose();
    userSignOut();
  };
  const navigate = useNavigate();
  const navigateToGiris = () => {
    navigate("/");
  };

  return (
    <div>
      {authUser ? (
        <>
          {setShow ? <>{Error()}</> : <></>}
          <Modal show={show} onHide={handleClose2} centered size="lg">
            <Modal.Header closeButton>
              <Modal.Title>
                <h2 style={{ marginLeft: 300 }}>Profile Settings</h2>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container className="container">
                <Row>
                  <Col xs={3}>
                    <img
                      style={{ width: 250, height: 250 }}
                      src={authUser.photoURL}
                    ></img>
                  </Col>
                  <Col xs={2}>
                    <div style={{ marginLeft: 60, marginTop: 200 }}>
                      <input
                        accept="image/*"
                        id="icon-button-file"
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => setFileUpload(e.target.files[0])}
                      />
                      <label htmlFor="icon-button-file">
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                        >
                          <AddAPhotoIcon></AddAPhotoIcon>
                        </IconButton>
                      </label>
                      <IconButton
                        color="success"
                        disabled={loading || !fileUpload}
                        onClick={() =>
                          uploadFile(fileUpload, authUser, setLoading)
                        }
                      >
                        <CheckCircleIcon></CheckCircleIcon>
                      </IconButton>
                    </div>
                  </Col>
                  <Col xs={7}>
                    <div class="ui card fluid">
                      <div class="content">
                        <div style={{ height: 250, textAlign: "center" }}>
                          <IconButton
                            style={{ float: "right" }}
                            color="success"
                            disabled={!isEditing}
                            onClick={changeUsername}
                          >
                            <CheckCircleIcon></CheckCircleIcon>
                          </IconButton>
                          <IconButton
                            style={{ float: "right" }}
                            color="primary"
                            onClick={() => setIsEditing(true)}
                          >
                            <EditIcon />
                          </IconButton>

                          <h1>Username:</h1>

                          {isEditing ? (
                            <Form.Input
                              type="text"
                              onChange={(e) => setNewName(e.target.value)}
                            />
                          ) : (
                            <h1>{authUser.displayName}</h1>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
          </Modal>
          <Navbar>
            <Container>
              <Navbar.Brand>
                <h1 style={{ color: "#69427a", tabSize: 10 }}>
                  <img
                    style={{ width: 55, height: 35, marginBottom: 2 }}
                    className="resim"
                    src={img}
                  ></img>{" "}
                  SocialTone
                </h1>
              </Navbar.Brand>
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                  <Box>
                    <Tooltip title="Account settings">
                      <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                      >
                        <Avatar
                          src={authUser.photoURL}
                          sx={{ width: 32, height: 32 }}
                        ></Avatar>
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem onClick={handleShow}>
                      <Avatar
                        src={authUser.photoURL}
                        sx={{ width: 32, height: 32 }}
                      ></Avatar>
                      {authUser.displayName}
                    </MenuItem>
                    <Divider />

                    <MenuItem onClick={() => logout()}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </Navbar.Text>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <style>{`
                    .del {
                      float: right;
                     
                    .resim{
                      max-width: 100%;
                      height: auto;  
                    }
                    
                    
                    
                    `}</style>
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column width={4}></Grid.Column>
              <Grid.Column width={8}>
                <div>
                  <Form>
                    <TextArea
                      placeholder="Tell us more.."
                      onChange={(e) => setNewLick(e.target.value)}
                      style={{ minHeight: 20 }}
                      value={newLick}
                    />
                  </Form>

                  <br />
                  <br />
                  {lick
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .map((mod) => (
                      <div style={{ marginBottom: 19 }}>
                        <div class="ui card fluid">
                          <div class="content">
                            <div class="header">
                              <Avatar
                                src={mod.photoURL}
                                sx={{
                                  width: 32,
                                  height: 32,
                                  float: "left",
                                  marginRight: 2,
                                }}
                              ></Avatar>
                              {mod.displayName}
                            </div>

                            {Math.floor(
                              (Date.now() - mod.createdAt) / 1000 / 60 / 60 / 24
                            ) < 1 ? (
                              <>
                                {formatDistanceToNow(mod.createdAt, {
                                  addSuffix: true,
                                  unit: "s",
                                })}
                              </>
                            ) : (
                              <>{format(mod.createdAt, "dd.MM.yyyy")}</>
                            )}
                          </div>
                          <div class="content">
                            <div class="description">{mod.text}</div>
                          </div>

                          <div>
                            {!mod.likes.includes(authUser.uid) ? (
                              <IconButton
                                onClick={() => checkLikes(mod.id, mod.likes)}
                              >
                                <FavoriteBorderIcon></FavoriteBorderIcon>
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() => checkLikes(mod.id, mod.likes)}
                              >
                                <FavoriteIcon
                                  sx={{ color: red[600] }}
                                ></FavoriteIcon>
                              </IconButton>
                            )}
                            {mod.likes.length}

                            <IconButton
                              style={{ marginLeft: 12 }}
                              onClick={() => handleAddElement(mod.id)}
                            >
                              <ModeCommentOutlinedIcon></ModeCommentOutlinedIcon>
                            </IconButton>
                            {mod.comments.length}

                            <IconButton
                              className="del"
                              name="delete"
                              disabled={!(mod.userid2 == authUser.email)}
                              onClick={() => deleteLick(mod.id)}
                              sx={{ color: red[500], marginRight: 1 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        </div>

                        {openCom(mod.id) ? (
                          <></>
                        ) : (
                          <div>
                            <div style={{ paddingLeft: 30, paddingRight: 25 }}>
                              <div class="content">
                                {" "}
                                {openComAdd(mod.createdAt) ? (
                                  <button
                                    class="fluid ui teal button tiny"
                                    onClick={() => setwhCom(mod.createdAt)}
                                  >
                                    <i class="fa-solid fa-plus"></i>
                                  </button>
                                ) : (
                                  <>
                                    
                                      <TextField
                                      sx={{
                                        width: 565,
                                        maxWidth: "100%",
                                      }}
                                        fullWidth
                                        name={mod.createdAt}
                                        label="Add Comment"
                                        id="fullWidth"
                                        value={newCom}
                                        onChange={(e) =>
                                          setNewCom(e.target.value)
                                        }
                                      />
                                   
                                    <IconButton>
                                        <SendIcon
                                        sx={{fontSize:27}}
                                        onClick={() =>
                                        checkComments(
                                          mod.id,
                                          mod.comments,
                                          newCom
                                        )
                                      }></SendIcon>
                                      </IconButton>
                                    </>
                                )}
                              </div>
                            </div>

                            {mod.comments.length !== 0 ? (
                              mod.comments
                                .sort((a, b) => b.createdAt - a.createdAt)
                                .map((as) => (
                                  <div
                                    style={{
                                      paddingLeft: 30,
                                      paddingRight: 25,
                                      paddingTop: 10,
                                    }}
                                  >
                                    <div class="ui card fluid">
                                      <div class="content">
                                        <div class="header">
                                          <Avatar
                                            src={as.photoURLC}
                                            sx={{
                                              width: 24,
                                              height: 24,
                                              float: "left",
                                              marginRight: 2,
                                            }}
                                          ></Avatar>
                                          {as.userName}
                                        </div>
                                      </div>
                                      <div class="content">
                                        <div class="description">
                                        {as.comment}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))
                            ) : (
                              <></>
                            )}
                            <br></br>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </Grid.Column>
              <Grid.Column width={4}>
                <br></br>
                <IconButton>
                  <SendIcon
                    sx={{ color: purple[400] }}
                    fontSize="large"
                    onClick={submitLick}
                  />
                </IconButton>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </>
      ) : (
        navigateToGiris()
      )}
    </div>
  );
};

export default Home;
