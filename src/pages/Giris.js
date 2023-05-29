import { Button, Icon, Form, Segment } from "semantic-ui-react";
import React from "react";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { useNavigate } from "react-router-dom";
import img from "../Untitled1.png";
import giris from "./giris.png";

function Giris() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [text, setText] = useState(
    " This email already exist or you should fill all of them"
  );
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/home");
  };

  function validatePassword() {
    let isValid = true;

    if (pass !== confirmPassword) {
      isValid = false;
      setText("Those passwords didn’t match. Try again.");
      setShow(true);
    }

    return isValid;
  }

  const singUp = async () => {
    if (validatePassword()) {
      try {
        await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(auth.currentUser, { displayName: username });
        navigateToHome();
      } catch (err) {
        console.error(err);
        if (err == "FirebaseError: Firebase: Error (auth/invalid-email).") {
          setText("Invalid Email");
          setShow(true);
        }
        if (err == "FirebaseError: Firebase: Error (auth/missing-password).") {
          setText("Missing Password");
          setShow(true);
        }
        if (
          err == "FirebaseError: Firebase: Error (auth/email-already-in-use)."
        ) {
          setText("Email already in use");
          setShow(true);
        }
        if (
          err ==
          "FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password)."
        ) {
          setText("Password should be at least 6 characters");
          setShow(true);
        }
      }
    }
  };
  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      navigateToHome();
    } catch (err) {
      console.error(err);
      if (err == "FirebaseError: Firebase: Error (auth/user-not-found).") {
        setText("User not found");
        setShow(true);
      }
      if (err == "FirebaseError: Firebase: Error (auth/invalid-email).") {
        setText("Invalid Email");
        setShow(true);
      }
      if (err == "FirebaseError: Firebase: Error (auth/missing-password).") {
        setText("Missing Password");
        setShow(true);
      }
    }
  };
  const withgoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigateToHome();
    } catch (err) {
      console.error(err);
    }
  };

  const [showU, setShowU] = useState(false);
  const [showS, setShowI] = useState(false);

  const handleCloseU = () => setShowU(false);
  const handleShowU = () => setShowU(true);

  const handleCloseI = () => setShowI(false);
  const handleShowI = () => setShowI(true);
  function signU() {
    handleCloseU();
    singUp();
    setEmail("");
    setConfirmPassword("");
    setPass("");
  }
  function signI() {
    handleCloseI();
    signIn();
    setPass("");
    setEmail("");
  }
  function myFunction() {
    return (
      <div>
        <ToastContainer position="bottom-end" className="p-3">
          <Toast
            bg={"danger"}
            danger
            onClose={() => setShow(false)}
            show={show}
            delay={4000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">Warning</strong>
            </Toast.Header>
            <Toast.Body id="msg">{text}</Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    );
  }

  return (
    <div
      class=" md:max-lg:flex " /*style={{backgroundImage: `url(${img})`,backgroundRepeat:"no-repeat"}}*/
      className="App"
    >
      <style>
        {`html, body {
          background-color: #69427a !important;
          color: #f0f8ff 
          
          
          
  
        }
        .first{
          text-align:center; 
          font-size:50px 
          
        }
  
         .nav1{
         padding-top:20px
          
         } 
        
          `}
      </style>

      <nav className="navbar navbar-expand-sm mx-auto bg-transparent nav1">
        <div className="container-fluid container">
          <h1 style={{ fontSize: 30 }}>
            <img style={{ width: 60, height: 45 }} src={img}></img>SocialTone
          </h1>
          <div>
            <Button animated onClick={() => handleShowI()}>
              <Button.Content visible>Sign In</Button.Content>
              <Button.Content hidden>
                <Icon name="user" />
              </Button.Content>
            </Button>
            <Button animated onClick={() => handleShowU()}>
              <Button.Content visible>Sign Up</Button.Content>
              <Button.Content hidden>
                <Icon name="user outline" />
              </Button.Content>
            </Button>
          </div>
        </div>
      </nav>
      <div>
      <br/>
        <h2 style={{ textAlign: "center" }}>
          From breaking news and entertainment to sports and politics, get the
          full story with all the live commentary.
        </h2>{" "}
        <br></br>
        <h1 style={{ textAlign: "center" }}>Sign up and start using it too</h1>
        <br></br>
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <img src={giris} height="auto" width="80%"></img>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
      <script src="assets/vendor/fancybox/dist/jquery.fancybox.min.js"></script>
      {setShow ? <>{myFunction()}</> : <></>}

      <Modal
        style={{ color: "black", textAlign: "center" }}
        show={showU}
        onHide={handleCloseU}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ paddingLeft: 200 }}>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Input
              fluid
              focus
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Form.Input
              fluid
              icon="mail outline"
              iconPosition="left"
              focus
              required={email}
              placeholder="E-mail Adress"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              focus
              type="password"
              value={pass}
              placeholder="Password"
              onChange={(e) => setPass(e.target.value)}
            />

            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              focus
              type="password"
              value={confirmPassword}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ marginRight: 130 }} onClick={withgoogle}>
            Sign Up with Google
          </Button>
          <Button positive style={{ marginRight: 60 }} onClick={signU}>
            Sign Up
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Sign In */}
      <Modal
        style={{ color: "black", textAlign: "center" }}
        show={showS}
        onHide={handleCloseI}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ paddingLeft: 200 }}>Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Input
              fluid
              icon="mail outline"
              iconPosition="left"
              focus
              required={email}
              placeholder="E-mail Adress"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              focus
              type="password"
              value={pass}
              placeholder="Password"
              onChange={(e) => setPass(e.target.value)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ marginRight: 130 }} onClick={withgoogle}>
            Sign In with Google
          </Button>
          <Button positive style={{ marginRight: 60 }} onClick={signI}>
            Sign In
          </Button>
        </Modal.Footer>
      </Modal>

      <div style={{ backgroundColor: "#1b1b1b", height: 250 }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <Segment vertical>
            <a
              target="_blank"
              style={{ color: "white" }}
              href="https://github.com/bengisusagir"
            >
              <Icon link name="github" size="huge"></Icon>
            </a>
            <a
              target="_blank"
              style={{ color: "blue" }}
              href="https://www.linkedin.com/in/bengisu-sağır/"
            >
              <Icon link name="linkedin" color="blue" size="huge"></Icon>
            </a>
            <br />
            <br />

            <small style={{ color: "grey" }}>
              {" "}
              Copyright &copy; 2023 Bengisu Sağır , All rights reserved
            </small>
          </Segment>
        </div>
      </div>
    </div>
  );
}

export default Giris;
