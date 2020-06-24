import React, { useState } from "react";

const JitsiContext = React.createContext({
  jitsiApi: null,
  setJitsiApi: () => { },
  showSmallPayer: true,
  setShowSmallPlayer: () => { },
  miniPlayerEnabled: true
});

export default JitsiContext;

export const JitsiContextProvider = ({ children }) => {
  const [jitsiApi, setJitsiApi] = useState(null);

  return (
    <JitsiContext.Provider
      value={{
        jitsiApi,
        setJitsiApi
      }}
    >
      {children}
    </JitsiContext.Provider>
  );
};
