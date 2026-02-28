// import React, { createContext, useContext, useEffect, useState } from "react";

// const StateContext = createContext();

// const getFreshContext = () => {
//   const data = localStorage.getItem("context");

//   if (!data) {
//     const fresh = {
//       participantId: 0,
//       timeTaken: 0,
//       selectedOptions: [],
//     };
//     localStorage.setItem("context", JSON.stringify(fresh));
//     return fresh;
//   }

//   return JSON.parse(data);
// };

// export default function useStateContext() {
//   return useContext(StateContext);
// }

// export function ContextProvider({ children }) {
//   const [context, setContext] = useState(getFreshContext);

//   const updateContext = (obj) => {
//     setContext((prev) => {
//       const updated = { ...prev, ...obj };
//       localStorage.setItem("context", JSON.stringify(updated));
//       return updated;
//     });
//   };

//   const resetContext = () => {
//     const fresh = getFreshContext();
//     setContext(fresh);
//   };

//   useEffect(() => {
//     localStorage.setItem("context", JSON.stringify(context));
//   }, [context]);

//   return (
//     <StateContext.Provider
//       value={{
//         context,
//         setContext: updateContext,
//         resetContext,
//       }}
//     >
//       {children}
//     </StateContext.Provider>
//   );
// }

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const StateContext = createContext();

// 🔹 initial clean state
const initialContext = {
  participantId: 0,
  timeTaken: 0,
  selectedOptions: [],
};

// 🔹 load from storage once
const getFreshContext = () => {
  const data = localStorage.getItem("context");
  return data ? JSON.parse(data) : initialContext;
};

export default function useStateContext() {
  return useContext(StateContext);
}

export function ContextProvider({ children }) {
  const [context, setContext] = useState(getFreshContext);

  // ✅ stable updater (no re-render loop)
  const updateContext = useCallback((obj) => {
    setContext((prev) => ({
      ...prev,
      ...obj,
    }));
  }, []);

  // ✅ stable reset
  const resetContext = useCallback(() => {
    setContext(initialContext);
  }, []);

  // 🔹 sync storage
  useEffect(() => {
    localStorage.setItem("context", JSON.stringify(context));
  }, [context]);

  return (
    <StateContext.Provider
      value={{
        context,
        setContext: updateContext,
        resetContext,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}
