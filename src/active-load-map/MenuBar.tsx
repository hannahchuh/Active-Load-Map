import React from "react";

import { Menu /*Dropdown, Button */ } from "semantic-ui-react";

//import Login from "../login";

import "./MenuBar.css";

export const MenuBar: React.FC<{
  isLoggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}> = React.memo(({ isLoggedIn, setLoggedIn }) => {
  const [userImageUrl, setUserImageUrl] = React.useState("");
  const authInstanceRef = React.useRef<gapi.auth2.GoogleAuth | null>(null);

  React.useEffect(() => {
    let cancelEffect = false;
    if (!window.gapi) {
      return;
    }

    if (!authInstanceRef.current) {
      const authInstanceTemp: gapi.auth2.GoogleAuth = window.gapi.auth2.getAuthInstance();
      authInstanceRef.current = authInstanceTemp;
    }

    if (!isLoggedIn) {
      if (!cancelEffect) {
        setUserImageUrl("");
      }
    } else {
      const userProfile = authInstanceRef.current.currentUser
        .get()
        .getBasicProfile();
      if (!cancelEffect) {
        setUserImageUrl(userProfile.getImageUrl());
      }
    }

    return () => {
      cancelEffect = true;
    };
  }, [isLoggedIn]);

  return (
    <div>
      <Menu fluid secondary id = "menuBar">
        <Menu.Item>
          <b id="activeLoadMapLabel">active load map</b>
        </Menu.Item>
        <Menu.Item>
          <a
            href="http://github.com/hannahchuh/Active-Load-Map-Demo"
            target="_blank"
            rel="noreferrer noopener"
          >
            <b id="aboutLink">about</b>
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            href="http://github.com/hannahchuh/Active-Load-Map-Demo"
            target="_blank"
            rel="noreferrer noopener"
          >
            <b id="codeLink">code</b>
          </a>
        </Menu.Item>
      </Menu>

      {/* <Menu.Menu position="right">
          {isLoggedIn ? (
            <div id="userImageDiv">
              <Dropdown
                fluid
                floating
                id="userDropdown"
                className="icon"
                icon={{
                  as: "img",
                  circular: true,
                  className: "userImage",
                  src: userImageUrl
                }}
                item
              >
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      if (authInstanceRef.current) {
                        authInstanceRef.current.signOut();
                        setLoggedIn(false);
                      }
                    }}
                  >
                    Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : (
            <Login
              autoSignIn={true}
              clientId={process.env.REACT_APP_CLIENT_ID as string}
              onLoginChange={user => {
                if (user) {
                  setTimeout(() => {
                    setLoggedIn(true);
                  }, 1000);
                }
              }}
            />
            
          )}
        </Menu.Menu> */}
    </div>
  );
});

export default MenuBar;
