import React, {useEffect, useState} from 'react';
import './App.css';
import {Session} from "@inrupt/solid-client-authn-browser";
import Chat from "./components/Chat"

const session: Session = new Session();

function App() {

  const [currentSession, setCurrentSession] = useState(session.info)
  const [selectedProvider, setSelectedProvider] = useState("https://cloud.pr8.io");
  const [error, setError] = useState("");


  useEffect(() => {

    session.handleIncomingRedirect({restorePreviousSession: true}).then((s) => {
      if (s !== undefined)
        setCurrentSession(s)
    }).catch(console.error);

  }, [])

  return currentSession.isLoggedIn
      ? <Chat
          session={session}
          provider={selectedProvider}
      />
      : <div className={'app-loading-page'} >

        <img alt="" src="/brand.png" />
        <div>
          <input
              style={{width: "20rem"}}
              type="text"
              value={selectedProvider}
              onChange={e => setSelectedProvider(e.target.value)}
              placeholder="Select your provider"
          />
          {error && <div style={{color: "red"}}>{error}</div>}
        </div>
        <div>You are not logged in. Please
          click <span style={{color: "green", cursor: "pointer"}} onClick={() => {
            session.login({
              oidcIssuer: selectedProvider,
            }).then(console.log).catch((e) => {setError(`Could not load provider "${selectedProvider}"`)});
          }}> here </span> to login.
          <i>
            <br/>
            <br/>Please check the box
            <br/>"Give other people and apps access to the Pod, or revoke their (and your) access"
            <br/>When loading first time
          </i>
        </div>
      </div>
}

export default App;
